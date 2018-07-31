const db = require("../models");
const { CONVERSATION_STATUS, CONVERSATION_STATUS_ARRAY, GROUP_INFO } = require('./conversationUtils');
const applozicClient = require("../utils/applozicClient");
const userService = require("../users/userService");
const registrationService = require("../register/registrationService");
const customerService = require('../customer/customerService');
const config = require('../../conf/config.js')
const logger = require('../utils/logger');
const Sequelize = require("sequelize");
const cacheClient = require("../cache/hazelCacheClient");
const { SQL_QUERIES } = require('../../query/query');
const inAppMessageService = require('../application/inAppMsgService');

/**
 * returns conversation list of given participent_user_Id
 * @userId
 */
const getConversationList = (participantUserId) => {

    console.log("request received to get conversation list of participent user: ", participantUserId);
    return Promise.resolve(db.Conversation.findAll({ where: { participantUserId: participantUserId } }));

}

const getConversationByGroupId = groupId => {
    return Promise.resolve(db.Conversation.find({ where: { groupId: groupId } }));
}

/*const updateTicketIntoConversation = (groupId, options) => {
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
}*/
/**
 * create a new conversation
 *@param {Object} options
 *@param {Object} options.groupId: applozic gruop Id
 *@param {Object} options.participantUserId : user who is involved in this conversation
 *@param {Object} options.createdBy: Applozic userId if comming from plugin. AgentId if comming from dashboard;
 *@param {Object} options.status : "OPEN","ASIGNED","CLOSED","SPAM","REOPENED",
 *@param {Object} options.defaultAgentId: assignee agent Id
 *
 */
const createConversation = (conversation) => {
    console.log("creating new converation, options:", conversation);
    conversation.status = CONVERSATION_STATUS.OPEN;
    return userService.getByUserNameAndAppId(conversation.defaultAgentId, conversation.applicationId).then(user => {
        conversation.agentId = user.id
        return Promise.resolve(db.Conversation.create(conversation)).then(result => {
            console.log("conversation created successfully", result);
            return result;
        })
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
        let participantUserId = group.groupUsers.filter(user => { return user.role == 3 })
        let participentUser = group.users.filter(user => { return participantUserId[0].userId == user.userId })
        let defaultAgent = group.users.filter(user => { return user.userId == group.adminId })
        let conversation = {
            groupId: group.id,
            participantUserId: participentUser[0].id,
            defaultAgentId: defaultAgent[0].userId,
            createdBy: participentUser[0].id,
            applicationId: headers['application-key']
        }
        userService.getByUserNameAndAppId(defaultAgent[0].userId, headers['application-key']).then(user => {
            conversation.agentId = user.id;
            createConversation(conversation);
        });
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
    if (options.participantUserId) {
        conversation.participantUserId = options.participantUserId;
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
    let groupId = data.groupId || data.clientGroupId;
    let userKey = data.userKey || data.userId;
    //let groupInfo = { userIds: [], clientGroupIds: [groupId] }
    let header = {}
    return Promise.resolve(customerService.getCustomerByAgentUserKey(userKey)).then(customer => {
        if (customer) {
            return Promise.resolve(userService.getUsersByAppIdAndTypes(customer.applications[0].applicationId, undefined)).then(users => {
                if (users) {
                    return getAgentsList(customer, users, groupId).then(agents => {
                        let userIds = agents.userIds;
                        let agentIds = agents.agentIds;
                        header = agents.header;
                        /*users.forEach(function (user) {
                            if (user.type === 2) {
                                if (user.userName === 'bot') {
                                    header.apzToken = user.apzToken
                                } if (customer.botRouting && user.allConversations == 1) {
                                    userIds.push(user.userName);
                                }
                            }
                            else {
                                userIds.push(user.userName);
                                agentIds.push(user.userName);
                                // groupInfo.userIds.push(user.userName);
                            }
                            if (user.type === 3) {
                                header.ofUserId = user.userName
                            }
    
                        });*/
                        if (customer.botRouting) {
                            agents.assignTo != customer.userName ? assignToDefaultAgent(groupId, customer.applications[0].applicationId, agents.assignTo, agents.header) : "";
                            return { code: "SUCCESS", data: 'success' }
                            // let groupInfo = { groupDetails: userIds };
                            // logger.info('addMemberIntoConversation - group info:', groupInfo, 'applicationId: ', customer.applications[0].applicationId, 'apzToken: ', header.apzToken, 'ofUserId: ', header.ofUserId)
                            // return Promise.resolve(applozicClient.addMemberIntoConversation(groupInfo, customer.applications[0].applicationId, header.apzToken, header.ofUserId)).then(response => {
                            //     logger.info('response', response.data)
                            //     return { code: "SUCCESS", data: 'success' };
                            // });
                        } else if (!customer.agentRouting) {
                            agents.assignTo != customer.userName ? assignToDefaultAgent(groupId, customer.applications[0].applicationId, agents.assignTo, agents.header) : "";
                            let groupInfo = { groupDetails: userIds };
                            logger.info('addMemberIntoConversation - group info:', groupInfo, 'applicationId: ', customer.applications[0].applicationId, 'apzToken: ', header.apzToken, 'ofUserId: ', header.ofUserId)
                            return Promise.resolve(applozicClient.addMemberIntoConversation(groupInfo, customer.applications[0].applicationId, header.apzToken, header.ofUserId)).then(response => {
                                logger.info('response', response.data)
                                return { code: "SUCCESS", data: 'success' };
                            });
                        } else {
                            logger.info("adding assignee in round robin fashion");
                            return inAppMessageService.checkOnlineAgents(customer).then(onlineUsers => {
                                let onlineUser = onlineUsers.find(agent => agent.connected);
                                if (onlineUser) {
                                    console.log("online user: ", onlineUser)
                                    return assingConversationInRoundRobin(groupId, agentIds, customer.applications[0].applicationId, header, onlineUsers);
                                } else {
                                    return assignToDefaultAgent(groupId, customer.applications[0].applicationId, agents.assignTo, agents.header)
                                }
                            });
                        }
                        // let groupInfo = { groupDetails: userIds };
                        // logger.info('addMemberIntoConversation - group info:', groupInfo, 'applicationId: ', customer.applications[0].applicationId, 'apzToken: ', header.apzToken, 'ofUserId: ', header.ofUserId)
                        // return Promise.resolve(applozicClient.addMemberIntoConversation(groupInfo, customer.applications[0].applicationId, header.apzToken, header.ofUserId)).then(response => {
                        //     logger.info('response', response.data)
                        //     return { code: "SUCCESS", data: 'success' };
                        // });
                    })
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
/**
 * 
 * @param {Integer} groupId 
 * @param {Array} userIds  
 * @param {String} appId 
 * @param {Object} header 
 * This method 
 * 1. get assignee from hazel cache in round robin manner.
 * 2. Add the assignee into conversation.
 * 3. assign conversation to assignee
 */
const assingConversationInRoundRobin = (groupId, userIds, appId, header, onlineUsers) => {
    return getConversationAssigneeFromMap(userIds, appId, onlineUsers).then(assignTo => {
        logger.info("got conversation agssignee : ", assignTo);
        let groupInfo = { groupDetails: [{ groupId: groupId, userId: assignTo, role: 1 }] };
        logger.info('addMemberIntoConversation - group info:', groupInfo, 'applicationId: ', appId, 'apzToken: ', header.apzToken, 'ofUserId: ', header.ofUserId)
        return Promise.resolve(applozicClient.addMemberIntoConversation(groupInfo, appId, header.apzToken, header.ofUserId)).then(response => {
            logger.info('response', response.data)
            applozicClient.updateGroup(
                {
                    groupId: groupId,
                    metadata: { CONVERSATION_ASSIGNEE: assignTo }
                },
                appId,
                header.apzToken,
                header.ofUserId
            );

            return { code: "SUCCESS", data: 'success' };
        });
    });
};
/**
 * 
 * @param {Integer} groupId 
 * @param {String} appId 
 * @param {Strig} assignTo 
 * @param {Object} header 
 * Assign conversation to given userId
 */
const assignToDefaultAgent=(groupId, appId, userId, header)=>{
    let groupInfo = {
        groupId: groupId,
        metadata: { CONVERSATION_ASSIGNEE: userId }
    };
    logger.info("updating assignee for conversation : ", groupInfo);
    applozicClient.updateGroup(
        groupInfo,
        appId,
        header.apzToken,
        header.ofUserId
    );
}
/**
 * 
 * @param {String} userIds 
 * @param {String} key 
 * Storing userIds array into map (Map<appId, [userIds]>)
 * Making first item (userId) of array is current assignee and
 * shifting that to last item. then storing back to map.
 */
const getConversationAssigneeFromMap = (userIds, key, users) => {
    //store map of appid and userids
    let assignee = [];
    var mapPrifix = "userRoutingMap";
    let userIdsArray = [];
    return cacheClient.getDataFromMap(mapPrifix, key).then(value => {
        if (value != null && value.userIds.length == userIds.length) {
            // let arr = value.userIds;
            // assignee = arr.shift();
            // arr.push(assignee);
            // userIds = arr;
            userIdsArray = value.userIds;
        } else {
            logger.info("received nullfrom cache, adding default agent as assignee");
            //assignee = userIds[userIds.length - 1];
            userIdsArray = userIds;
        } 
        for (var i = 0; i < userIdsArray.length; i++) {
            for (var index = 0; index < users.length; index++) {

                if (userIdsArray[i] == users[index].userId&&users[index].connected) {
                    assignee = userIdsArray.splice(i, 1);
                    userIdsArray.push(assignee[0]);
                    break;
                }
            }
            if (assignee.length > 0) {
                break;
            }
        }
        cacheClient.setDataIntoMap(mapPrifix, key, { userIds: userIdsArray });
        return assignee[0];
    });
};

const getAgentsList = (customer, users, groupId) => {
    let userIds = [];
    let agentIds = [];
    let header = {};
    let assigneeUserName = customer.userName;
    return new Promise((resolve, reject)=>{
        users.forEach(function (user) {
            if (user.type === 2) {
                if (user.userName === 'bot') {
                    header.apzToken = user.apzToken
                } if (customer.botRouting && user.allConversations == 1) {
                    assigneeUserName = user.userName;
                    userIds.push({groupId: groupId, userId:user.userName, role:2});
                }
            }
            else {
                userIds.push({groupId: groupId, userId:user.userName, role:1});
                agentIds.push(user.userName);
            }
            if (user.type === 3) {
                header.ofUserId = user.userName
            }
        });
        return resolve({ "userIds": userIds, "agentIds": agentIds, "header": header, "assignTo": assigneeUserName });

    })
}

/**
 * 
 * @param {String} appId 
 * @param {Integer} groupId 
 * @param {String} assignTo 
 * If assigTo (userId) prensent then conversation assign to userId.
 * Otherwise assign according to routing rules. 
 */
const switchConversationAssignee = (appId, groupId, assignToUserId) => {
    return Promise.all([customerService.getCustomerByApplicationId(appId), userService.getUsersByAppIdAndTypes(appId)]).then(([customer, users]) => {
        let bot = users.filter(user => {
            return user.userName == "bot";
        });
        return getAgentsList(customer, users, groupId).then(agents => {
            //assign direct given userId 
            if (assignToUserId && assignToUserId != "") {
                let assignee = users.filter(user => {
                    return user.userName == assignToUserId;
                });
                if (assignee.length == 0) {
                    return "user not exist"
                }
                return assignToDefaultAgent(groupId, appId, assignee[0].userName, agents.header).then(res => {
                    return "success";
                });
            }
            //swich acording to conditions of botRouting and agentRouting
            return applozicClient.getGroupInfo(groupId, appId, bot[0].apzToken, true).then(group => {
                if (group && group.metadata && group.metadata.CONVERSATION_ASSIGNEE) {
                    let assignee = users.filter(user => {
                        return user.userName == group.metadata.CONVERSATION_ASSIGNEE;
                    });
                    if (assignee[0].type == 2) {
                        if (customer.agentRouting) {
                            inAppMessageService.checkOnlineAgents(customer).then(onlineUsers=>{
                                let onlineUser = onlineUsers.find(agent=>agent.connected);
                                if(onlineUser){
                                    console.log("online user: ", onlineUser)
                                    assingConversationInRoundRobin(groupId, agents.agentIds, appId, agents.header, onlineUsers);
                                }else{
                                    assignToDefaultAgent(groupId, appId, customer.userName, agents.header);
                                }
                               return "success";
                            });
                        } else {
                            assignToDefaultAgent(groupId, appId, customer.userName, agents.header);
                        }
                        return "success";
                    } else {
                        return "ASSIGNMENT SKIPED";
                    }
                }
            });
        })
    }).catch(err => {
        return "error"
    })
}

const getConversationStatByAgentId = (agentId, startTime, endTime) => {
    let criteria = { agentId: agentId }
    if (startTime && endTime) {
        criteria.created_at = { $between: [new Date(startTime), new Date(endTime)] }
    }
    return Promise.resolve(db.Conversation.findAll({ where: criteria, group: ['status'], attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']] })).then(result => {
        return { agentId: agentId, statics: result };
    }).catch(err => { throw err });
}

const getConversationStats = (agentId, customerId, applicationId, startTime, endTime) => {
    if (applicationId) {
        return userService.getUsersByAppIdAndTypes(applicationId).then(users => {
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
    let UNIT = queryParams.daily == 'true' ? 'DATE' : 'HOUR';
    let query = SQL_QUERIES.NEW_CONVERSATION_COUNT_QUERY.replace(/UNIT/gi, UNIT);
    query = UNIT == 'HOUR' ? query.replace('HOUR (created_at)', 'TIME_FORMAT(created_at,"%H:00")') : query;
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - queryParams.days);
    return Promise.resolve(db.sequelize.query(query, { replacements: { "endDate": endDate, "agentIds": agentIds, startDate: new Date() }, type: db.sequelize.QueryTypes.SELECT }))
}

const getClosedConversation = (queryParams, agentIds) => {
    let UNIT = queryParams.daily == 'true' ? 'DATE' : 'HOUR';
    let query = SQL_QUERIES.CLOSED_CONVERSATION_COUNT_QUERY.replace(/UNIT/gi, UNIT);
    query = UNIT == 'HOUR' ? query.replace('HOUR (created_at)', 'TIME_FORMAT(created_at,"%H:00")') : query;
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - queryParams.days);
    return Promise.resolve(db.sequelize.query(query, { replacements: { "endDate": endDate, "status": CONVERSATION_STATUS.CLOSED, "agentIds": agentIds, startDate: new Date() }, type: db.sequelize.QueryTypes.SELECT }))
}

const getAverageResolutionTime = (queryParams, agentIds) => {
    let UNIT = queryParams.daily == 'true' ? 'DATE' : 'HOUR';
    let query = SQL_QUERIES.AVG_RESOLUTION_TIME_QUERY.replace(/UNIT/gi, UNIT);
    query = UNIT == 'HOUR' ? query.replace('HOUR (created_at)', 'TIME_FORMAT(created_at,"%H:00")') : query;
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - queryParams.days);
    return Promise.resolve(db.sequelize.query(query, { replacements: { "endDate": endDate, "agentIds": agentIds }, type: db.sequelize.QueryTypes.SELECT }));
}

const getAvgResponseTime = (queryParams, agentIds) => {
    let UNIT = queryParams.daily == 'true' ? 'DATE' : 'HOUR';
    let query = SQL_QUERIES.AVG_RESPONSE_TIME_QUERY.replace(/UNIT/gi, UNIT);
    query = UNIT == 'HOUR' ? query.replace('HOUR (created_at)', 'TIME_FORMAT(created_at,"%H:00")') : query;
    var endDate = new Date();
    endDate.setDate(endDate.getDate() - queryParams.days);
    return Promise.resolve(db.sequelize.query(query, { replacements: { "endDate": endDate, "agentIds": agentIds }, type: db.sequelize.QueryTypes.SELECT }));
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
    let applicationId = query.applicationId;
    if (applicationId) {
        return userService.getUsersByAppIdAndTypes(applicationId).then(users => {
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

const createConversationFromMail = (req) => {
    let applicationId = req.body.applicationId
    let toAddresses = req.body.tos;
    let fromEmail = req.body.from;
    let messages = req.body.messages || [];
    let groupInfo = GROUP_INFO;
    let headers = { "Apz-AppId": applicationId, "Content-Type": "application/json", "Apz-Product-App": true }
    if (!applicationId || messages.length == 0) {
        return "INVALID_PARAMETERS"
    }
    return customerService.getCustomerByApplicationId(applicationId).then(customer => {
        return userService.getUsersByAppIdAndTypes(applicationId, [1, 2]).then(users => {
            toAddresses.map(tos => {
                let toUser = JSON.parse(tos);
                let userAdded = false;
                for (var user in users) {
                    if (toUser.address == user.userName) {
                        groupInfo.users.push({ "userId": user.userName, "role": 1 })
                        userAdded = true;
                    }
                }
                if (!userAdded) { groupInfo.users.push({ "userId": toUser.address, "role": 3 }) }
            });

            return applozicClient.getUserDetails([fromEmail], customer.applications[0].applicationId, customer.apzToken).then(userDetail => {
                groupInfo.groupName = customer.name || customer.userName;
                groupInfo.admin = customer.userName;
                groupInfo.users[0].userId = customer.userName;
                groupInfo.metadata.CONVERSATION_ASSIGNEE = customer.userName;
                groupInfo.metadata.KM_CONVERSATION_TITLE = customer.userName;
                headers['Apz-Token'] = 'Basic ' + customer.apzToken;
                if (userDetail && userDetail.length > 0) {
                    //create conversation with first user
                    groupInfo.users[1].userId = userDetail[0].userId;
                    return applozicClient.createSupportGroup(groupInfo, headers).then(result => {
                        console.log('conversation : ', result);
                        return sendMessageIntoConversation(result.response.clientGroupId, messages, applicationId, userDetail[0]);
                    });
                } else {
                    //create new user
                    return applozicClient.createApplozicClient(fromEmail, null, applicationId, null, null, fromEmail, null).then(user => {
                        if (user) {
                            groupInfo.users[1].userId = user.userId
                            return applozicClient.createSupportGroup(groupInfo, headers).then(result => {
                                console.log('conversation : ', result);
                                return sendMessageIntoConversation(result.response.clientGroupId, messages, applicationId, user);
                            });
                        }
                    });
                }
            })
        })
    }).catch(err=>{
        throw err;
    });
}

const sendMessageIntoConversation = (groupId, messages, applicationId, user) => {
    let headers = {
        "Authorization": 'Basic ' + new Buffer("bot:bot").toString('base64'),
        "Application-Key": applicationId, "Content-Type": "application/json",
        "Of-User-Id": user.userId
    };
    return applozicClient.sendMessageListRecursively(messages, groupId, headers).then(resp => {
        console.log('send ', resp);
        return resp.data
    });
}



module.exports = {
    addMemberIntoConversation: addMemberIntoConversation,
    // updateTicketIntoConversation: updateTicketIntoConversation,
    updateConversation: updateConversation,
    getConversationList: getConversationList,
    getConversationByGroupId: getConversationByGroupId,
    createConversation: createConversation,
    getConversationStats: getConversationStats,
    getConversationStat: getConversationStat,
    createConversationIntoApplozic: createConversationIntoApplozic,
    createConversationFromMail: createConversationFromMail,
    switchConversationAssignee: switchConversationAssignee
}