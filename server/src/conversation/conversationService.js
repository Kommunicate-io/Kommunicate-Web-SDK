const db = require("../models");
const { CONVERSATION_STATUS, CONVERSATION_STATUS_ARRAY } = require('./conversationUtils');
const applozicClient = require("../utils/applozicClient");
const userService = require("../users/userService");
const registrationService = require("../register/registrationService");
const config = require('../../conf/config.js')
const logger = require('../utils/logger');
const Sequelize = require("sequelize");
const cacheClient = require("../cache/hazelCacheClient");
const { SQL_QUERIES } = require('../../query/query');

/**
 * returns conversation list of given participent_user_Id
 * @userId
 */
const getConversationList = (participentUserId) => {

    console.log("request received to get conversation list of participent user: ", participentUserId);
    return Promise.resolve(db.Conversation.findAll({ where: { participentUserId: participentUserId } }));

}

const getConversationByGroupId = groupId => {
    return Promise.resolve(db.Conversation.find({ where: { groupId: groupId } }));
}

const updateTicketIntoConversation = (groupId, options) => {
    return Promise.resolve(db.Conversation.find({ where: { groupId: groupId } })).then(conversation => {
        if (conversation && conversation.metadata && conversation.metadata.integration) {
            let integration = conversation.metadata.integration;
            integration.push(options)
            return db.Conversation.update({ metadata: { integration: integration } }, { where: { groupId: groupId } })
        } else {
            return db.Conversation.update({ metadata: { integration: [options] } }, { where: { groupId: groupId } });
        }

    }).catch(err => {
        throw err
    })


}
/**
 * create a new conversation
 *@param {Object} options
 *@param {Object} options.groupId: applozic gruop Id
 *@param {Object} options.participentUserId : user who is involved in this conversation
 *@param {Object} options.createdBy: Applozic userId if comming from plugin. AgentId if comming from dashboard;
 *@param {Object} options.status : "OPEN","ASIGNED","CLOSED","SPAM","REOPENED",
 *@param {Object} options.defaultAgentId: assignee agent Id
 * 
 */
const createConversation = (conversation) => {
    console.log("creating new converation, options:", conversation);
    conversation.status = CONVERSATION_STATUS.OPEN;
    return Promise.resolve(db.Conversation.create(conversation)).then(result => {
        console.log("conversation created successfully", result);
        return result;
    });

}
/**
 * 
 * This function create new support group into applozic.
 * on success response,it will make entry of conversation into kommunicate.
 * @param {req} request contain data and headers
 */
const createConversationIntoApplozic = (req) => {
    let headers = req.headers;
    delete headers['host'];
    return Promise.resolve(applozicClient.createSupportGroup(req.body, headers)).then(result => {
        //console.log('group create response: ', group);
        if (result.status === "APPLOZIC_ERROR") {
            return result.data;
        }
        let group = result.response
        let user = group.groupUsers.filter(user => { return user.role == 3 })
        let conversation = {
            groupId: group.id,
            participentUserId: user[0].userId,
            defaultAgentId: group.adminId,
            createdBy: user[0].userId,
            applicationId: headers['application-key']
        }
        createConversation(conversation);
        result.updated = true;
        return result;
    }).catch(err => {
        console.log('error: ', err);
        throw err;
    })
}

/**
 * update conversation
 */
const updateConversation = (options) => {
    let conversation = {};
    if (options.participentUserId) {
        conversation.participentUserId = options.participentUserId;
    }
    if (options.participentUserId) {
        conversation.participentUserId = options.participentUserId;
    }
    if (options.status) {
        conversation.status = CONVERSATION_STATUS_ARRAY[options.status];
        conversation.closeAt = CONVERSATION_STATUS_ARRAY[options.status] == CONVERSATION_STATUS.CLOSED ? new Date() : null;
    }
    if (options.createdBy) {
        conversation.createdBy = options.createdBy;
    }
    if (options.metadata) {
        updateConversationMetadata(options.groupId, options.metadata);
    }
    if (options.agentId) {
        return userService.getByUserNameAndAppId(options.agentId, options.appId).then(user => {
            conversation.agentId = user.id;
            return db.Conversation.update(conversation, { where: { groupId: options.groupId } });
        }).catch(err => { throw err })
    } else {
        return Promise.resolve(db.Conversation.update(conversation, { where: { groupId: options.groupId } })).then(resp => {
            return resp;
        }).catch(err => { throw err });
    }


}

const updateConversationMetadata = (groupId, metadata) => {
    let conversation = { metadata: metadata };
    getConversationByGroupId(groupId).then(resp => {
        if (resp && resp.metadata) {
            // Object.assign(conversation.metadata, resp.metadata);
            let existingMetadata = resp.metadata;
            for (var key in existingMetadata) {
                if (typeof matadata[key] == 'string' && existingMetadata[key] != metadata[key]) {
                    existingMetadata[key] = metadata[key];
                }
            }
            conversation.metadata = existingMetadata;
        }
        db.Conversation.update(conversation, { where: { groupId: groupId } });
    }).catch(err => {
        console.log('error while updating conversation metadata', err);
    });

}

const addMemberIntoConversation = (data) => {
    //note: getting clientGroupId in data.groupId
    let groupInfo = { userIds: [], clientGroupIds: [data.groupId] }
    let header = {}
    return Promise.resolve(registrationService.getCustomerByAgentUserKey(data.userId)).then(customer => {
        if (customer) {
            return Promise.resolve(userService.getAllUsersOfCustomer(customer, undefined)).then(users => {
                if (users) {
                    let userIds = [];
                    users.forEach(function (user) {
                        if (user.type === 2) {
                            if (user.userName === 'bot') {
                                header.apzToken = user.apzToken
                            } if (user.allConversations == 1) {
                                groupInfo.userIds.push(user.userName);
                            }
                        }
                        else {
                            userIds.push(user.userName);
                            // groupInfo.userIds.push(user.userName);
                        }
                        if (user.type === 3) {
                            header.ofUserId = user.userName
                        }

                    });
                    if (customer.agentRouting) {
                        assingConversationInRoundRobin(data.groupId, userIds, customer.applicationId, header);
                    }
                    groupInfo.userIds = userIds;
                    logger.info('addMemberIntoConversation - group info:', groupInfo, 'applicationId: ', customer.applicationId, 'apzToken: ', header.apzToken, 'ofUserId: ', header.ofUserId)
                    return Promise.resolve(applozicClient.addMemberIntoConversation(groupInfo, customer.applicationId, header.apzToken, header.ofUserId)).then(response => {
                        logger.info('response', response.data)
                        return { code: "SUCCESS", data: 'success' };
                    });
                }
            })
        } else {
            return { code: "SUCCESS", data: 'customer not found' };
        }
    }).catch(err => {
        logger.info("error during creating group", err)
        return { code: "ERROR", data: 'error during adding member into conversation' };
    });
}

const assingConversationInRoundRobin = (groupId, userIds, appId, header) => {
    getConversationAssigneeFromMap(userIds, appId).then(assignTo => {
        let groupInfo = {
            groupId: groupId,
            metadata: { CONVERSATION_ASSIGNEE: assignTo }
        };
        applozicClient.updateGroup(
            groupInfo,
            appId,
            header.apzToken,
            header.ofUserId
        );
        return;
    });
};

const getConversationAssigneeFromMap = (userIds, key) => {
    //store map of appid and userids
    let assignee = "";
    var mapPrifix = "userRoutingMap";
    return cacheClient.getDataFromMap(mapPrifix, key).then(value => {
        if (value != null) {
            let arr = value.userIds;
            assignee = arr.shift();
            arr.push(assignee);
            userIds = arr;
        } else {
            assignee = userIds[0];
        }

        cacheClient.setDataIntoMap(mapPrifix, key, { userIds: userIds });
        return assignee;
    });
};

const getConversationStatByAgentId = (agentId, startTime, endTime) => {
    let criteria = { agentId: agentId }
    if (startTime && endTime) {
        criteria.created_at = { $between: [new Date(startTime), new Date(endTime)] }
    }
    return Promise.resolve(db.Conversation.findAll({ where: criteria, group: ['status'], attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']] })).then(result => {
        return { agentId: agentId, statics: result };
    }).catch(err => { throw err });
}

const getConversationStats = (agentId, customerId, startTime, endTime) => {
    if (customerId) {
        return userService.getUsersByCustomerId(customerId).then(users => {
            if (users.length == 0) {
                return { result: 'no user stats found', data: [] };
            }
            let func = users.map(user => {
                return getConversationStatByAgentId(user.id, startTime, endTime);
            })
            return Promise.all(func).then(data => {
                return { result: 'success', data: data };
            });
        }).catch(err => {
            console.log(err);
            throw err;
        })
    }
    if (agentId) {
        return getConversationStatByAgentId(agentId, startTime, endTime).then(stat => {
            return { result: 'success', data: stat };
        }).catch(err => {
            console.log(err);
            throw err;
        });
    }
    return Promise.resolve({ result: 'oops! invalid query', data: [] });
}

const getNewConversation = (queryParams, agentIds) => {
    let UNIT = queryParams.daily ? 'DAY' : 'HOUR';
    let query = SQL_QUERIES.NEW_CONVERSATION_COUNT_QUERY.replace(/UNIT/gi, UNIT);
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - queryParams.days);
    return Promise.resolve(db.sequelize.query(query, { replacements: { "endDate": endDate, "agentIds": agentIds }, type: db.sequelize.QueryTypes.SELECT }))
}

const getClosedConversation = (queryParams, agentIds) => {
    let UNIT = queryParams.daily ? 'DAY' : 'HOUR';
    let query = SQL_QUERIES.CLOSED_CONVERSATION_COUNT_QUERY.replace(/UNIT/gi, UNIT);;
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - queryParams.days);
    return Promise.resolve(db.sequelize.query(query, { replacements: { "endDate": endDate, "status": CONVERSATION_STATUS.CLOSED, "agentIds": agentIds }, type: db.sequelize.QueryTypes.SELECT }))
}

const getAverageResolutionTime = (queryParams, agentIds) => {
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - queryParams.days);
    return Promise.resolve(db.sequelize.query(SQL_QUERIES.AVG_RESOLUTION_TIME_QUERY, { replacements: { "endDate": endDate, "agentIds": agentIds }, type: db.sequelize.QueryTypes.SELECT }));
}

const getAvgResponseTime = (queryParams, agentIds) => {
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - queryParams.days);
    return Promise.resolve(db.sequelize.query(SQL_QUERIES.AVG_RESPONSE_TIME_QUERY, { replacements: { "endDate": endDate, "agentIds": agentIds }, type: db.sequelize.QueryTypes.SELECT }));
}

const getAllStatistic = (query, agentIds) => {
    //console.log('agentIds', agentIds)
    return Promise.all([getNewConversation(query, agentIds),
    getClosedConversation(query, agentIds),
    getAverageResolutionTime(query, agentIds),
    getAvgResponseTime(query, agentIds)])
        .then(([newConversation, closedConversation, avgResolutionTime, avgResponseTime]) => {
            let response = {
                newConversation: newConversation,
                closedConversation: closedConversation,
                avgResolutionTime: avgResolutionTime,
                avgResponseTime: avgResponseTime
            }
            return response;

        }).catch(err => {
            throw err
        });

}

const getConversationStat = (query) => {
    let customerId = query.customerId;
    let agentId = query.agentId;
    if (customerId) {
        return userService.getUsersByCustomerId(customerId).then(users => {
            if (users.length == 0) {
                return { result: 'no user stats found', data: [] };
            }
            let agentIds = [];
            for (var i = 0; i < users.length; i++) {
                if (agentId && agentId == users[i].userName) {
                    agentIds.push(users[i].id)
                } else if (!agentId) {
                    agentIds.push(users[i].id)
                }
            }
            if (agentIds.length == 0) {
                return { result: 'invalid Agent', data: [] };
            }
            return getAllStatistic(query, agentIds);
        }).catch(err => {
            console.log(err);
            throw err;
        })
    }
}



module.exports = {
    addMemberIntoConversation: addMemberIntoConversation,
    updateTicketIntoConversation: updateTicketIntoConversation,
    updateConversation: updateConversation,
    getConversationList: getConversationList,
    getConversationByGroupId: getConversationByGroupId,
    createConversation: createConversation,
    getConversationStats: getConversationStats,
    getConversationStat: getConversationStat,
    createConversationIntoApplozic:createConversationIntoApplozic
}