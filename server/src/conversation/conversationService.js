const db = require("../models");
const { CONVERSATION_STATUS, CONVERSATION_STATUS_ARRAY } = require('./conversationUtils');
const applozicClient = require("../utils/applozicClient");
const userService = require("../users/userService");
const registrationService = require("../register/registrationService");
const config = require('../../conf/config.js')
const logger = require('../utils/logger');
const cacheClient = require("../cache/hazelCacheClient");

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
 *@param options
 {
 *      groupId: applozic gruop Id
 *      participentUserId : user who is involved in this conversation
 *      createdBy: Applozic userId if comming from plugin. AgentId if comming from dashboard;
 *      status : "OPEN","ASIGNED","CLOSED","SPAM","REOPENED",
 *      defaultAgentId: assignee agent Id
 * }
 */
const createConversation = (options) => {
    console.log("creating new converation, options:", options);
    //return Promise.resolve().then().catch();
    let conversation = {
        groupId: options.groupId,
        participentUserId: options.participentUserId,
        status: CONVERSATION_STATUS.OPEN,
        agentId: options.defaultAgentId,
        createdBy: options.createdBy,
    }
    return Promise.resolve(db.Conversation.create(conversation)).then(result => {
        console.log("conversation created successfully", result);
        return result;
    });

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

module.exports = {
    addMemberIntoConversation: addMemberIntoConversation,
    updateTicketIntoConversation: updateTicketIntoConversation,
    updateConversation: updateConversation,
    getConversationList: getConversationList,
    getConversationByGroupId: getConversationByGroupId,
    createConversation: createConversation
}
