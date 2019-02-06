const GroupInfo = require('./conversationUtils');
const applozicClient = require("../utils/applozicClient");
const userService = require("../users/userService");
const customerService = require('../customer/customerService');
const config = require('../../conf/config.js')
const logger = require('../utils/logger');
const cacheClient = require("../cache/hazelCacheClient");
const inAppMessageService = require('../application/inAppMsgService');
const { EMAIL_NOTIFY } = require('../users/constants');
const {GROUP_ROLE, ROUTING_RULES_FOR_AGENTS} = require("../utils/constant");
const stringUtils = require("underscore.string");

const addMemberIntoConversation = (data) => {
    //note: getting clientGroupId in data.groupId
    let groupId = data.groupId || data.clientGroupId;
    let userKey = data.userKey || data.userId;
    let header = {}
    return Promise.resolve(customerService.getCustomerByAgentUserKey(userKey)).then(customer => {
        if (customer) {
            return Promise.resolve(userService.getUsersByAppIdAndTypes(customer.applications[0].applicationId, undefined)).then(users => {
                if (users) {
                    return getAgentsList(customer, users, groupId).then(agents => {
                        let userIds = agents.userIds;
                        let agentIds = agents.agentIds;
                        header = agents.header;
                        return applozicClient.getGroupInfo(groupId, customer.applications[0].applicationId, header.apzToken, true).then(group => {
                            if (group && group.metadata && group.metadata.SKIP_ROUTING && group.metadata.SKIP_ROUTING == 'true') {
                                return { code: "ASSIGNMENT_SKIPPED", data: agents }
                            }
                            if (customer.botRouting ) {
                                /** UI: Assign new conversations to bot- enable  */ 
                               // if assigned bot is already present in the conversation let the client know so that it can avoid the duplicate welcome messages. 
                     
                                agents.assignedBotAlreadyPresent = isAssignedBotAlreadyPresentIngroup(group,userIds) && true; //converting to true false
                                if (agents.assignTo != customer.userName) {
                                    applozicClient.addMemberIntoConversation({ groupDetails: [{ groupId: groupId, userId: agents.assignTo, role: 2 }] }, customer.applications[0].applicationId, header.apzToken, header.ofUserId);
                                    assignToDefaultAgent(groupId, customer.applications[0].applicationId, agents.assignTo, agents.header)
                                }
                                return { code: "SUCCESS", data: agents }
                            } else if (customer.agentRouting == ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY) {
                                /** UI: Notify everybody  */ 
                                group.metadata.CONVERSATION_ASSIGNEE != customer.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY] ?
                                    assignToDefaultAgent(groupId, customer.applications[0].applicationId, customer.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY], agents.header)
                                    .then(result => { 
                                        //sendAssigneeChangedNotification(groupId, customer.applications[0].applicationId, customer.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY], agents.header.apzToken) 
                                    })
                                    :"";
                                let groupInfo = { groupDetails: userIds };
                                logger.info('addMemberIntoConversation - group info:', groupInfo, 'applicationId: ', customer.applications[0].applicationId, 'apzToken: ', header.apzToken, 'ofUserId: ', header.ofUserId)
                                return Promise.resolve(applozicClient.addMemberIntoConversation(groupInfo, customer.applications[0].applicationId, header.apzToken, header.ofUserId)).then(response => {
                                    logger.info('response', response.data)
                                    return { code: "SUCCESS", data: agents };
                                });
                            } else if (customer.agentRouting == ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT) {
                                /** UI: Automatic assignment */ 
                                logger.info("adding assignee in round robin fashion");
                                return inAppMessageService.checkOnlineAgents(customer).then(onlineUsers => {
                                    let onlineUser = onlineUsers.find(agent => agent.connected);
                                    if (onlineUser) {
                                        console.log("online user: ", onlineUser)
                                        return assignConversationInRoundRobin(groupId, agentIds, customer.applications[0].applicationId, header, onlineUsers);
                                    } else {
                                        return assignToDefaultAgent(groupId, customer.applications[0].applicationId, customer.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT], agents.header)
                                    }
                                });
                            }
                        })
                    })
                }
            })
        } else {
            return { code: "SUCCESS", data: 'customer not found' };
        }
    }).catch(err => {
        logger.info("error during adding member into conversation", err)
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
const assignConversationInRoundRobin = (groupId, userIds, appId, header, onlineUsers) => {
    return getConversationAssigneeFromMap(userIds, appId, onlineUsers).then(assignTo => {
        logger.info("got conversation assignee : ", assignTo);
        return applozicClient.getGroupInfo(groupId, appId, header.apzToken, true).then(group => {
            if (group.metadata.CONVERSATION_ASSIGNEE != assignTo) {
                let params = { "clientGroupIds": [groupId], "userIds": [group.metadata.CONVERSATION_ASSIGNEE] }
                return assignConversationToUser(group, assignTo, appId, header).then(res => {
                    applozicClient.removeGroupMembers(params, appId, header.apzToken, assignTo);
                    return assignTo;
                })
            }
            return;
        })
    }).catch(err => {
        console.log("error: user fetching from cache", err)
        return;
    });
};


const assignConversationToUser = async (group, assignTo, appId, header) => {
    let groupId = group && group.id;
    if(!groupId){
        logger.info("empty groupId received");
        return;
    }
    let groupInfo = { groupDetails: [{ "groupId":groupId, "userId": assignTo, role: 1 }] };
    logger.info('addMemberIntoConversation - group info:', groupInfo, 'applicationId: ', appId, 'apzToken: ', header.apzToken, 'ofUserId: ', header.ofUserId);
    if(!findUserInGroup(assignTo, group)){
        await applozicClient.addMemberIntoConversation(groupInfo, appId, header.apzToken, header.ofUserId);
    }
    return applozicClient.updateGroup(
            {
                groupId: groupId,
                metadata: { CONVERSATION_ASSIGNEE: assignTo }
            },
            appId,
            header.apzToken,
            header.ofUserId
        ).then(data=>{
            return { code: "SUCCESS", data: 'success' };
        });
        
}
const findUserInGroup = (userId, group)=>{
    let groupUsers =group.groupUsers;
    let user;
    if(userId && groupUsers){
        user = groupUsers.find(element => {
            return element.userId ==userId;
        });
    }
    return user;

}
/** 
 * @param {Integer} groupId 
 * @param {String} appId 
 * @param {Strig} assignTo 
 * @param {Object} header 
 * Assign conversation to given userId
 */
const assignToDefaultAgent = (groupId, appId, userId, header) => {
    let groupInfo = {
        groupId: groupId,
        metadata: { CONVERSATION_ASSIGNEE: userId }
    };
    logger.info("updating assignee for conversation : ", groupInfo);
    return applozicClient.updateGroup(
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
    //store map of appId and userIds
    let assignee = [];
    var mapPrefix = "userRoutingMap";
    let userIdsArray = [];
    return cacheClient.getDataFromMap(mapPrefix, key).then(value => {
        if (value != null && value.userIds.length == userIds.length) {
            userIdsArray = value.userIds;
        } else {
            logger.info("received null from cache, adding default agent as assignee");
            userIdsArray = userIds;
        }
        for (var i = 0; i < userIdsArray.length; i++) {
            for (var index = 0; index < users.length; index++) {

                if (userIdsArray[i] == users[index].userId && users[index].connected) {
                    assignee = userIdsArray.splice(i, 1);
                    userIdsArray.push(assignee[0]);
                    break;
                }
            }
            if (assignee.length > 0) {
                break;
            }
        }
        cacheClient.setDataIntoMap(mapPrefix, key, { userIds: userIdsArray });
        return assignee[0];
    });
};

const getAgentsList = (customer, users, groupId) => {
    let userIds = [];
    let agentIds = [];
    let header = {};
    let assigneeUserName = customer.userName;
    return new Promise((resolve, reject) => {
        users.forEach(function (user) {
            if (user.type === 2) {
                if (user.userName === 'bot') {
                    header.apzToken = user.apzToken;
                } if (customer.botRouting && user.allConversations == 1) {
                    assigneeUserName = user.userName;
                    userIds.push({ groupId: groupId, userId: user.userName, role: 2 });
                }
            }
            else {
                userIds.push({ groupId: groupId, userId: user.userName, role: 1 });
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
 * If assignTo (userId) present then conversation assign to userId.
 * Otherwise assign according to routing rules. 
 */
const switchConversationAssignee = (appId, groupId, assignToUserId) => {
    return Promise.all([customerService.getCustomerByApplicationId(appId), userService.getUsersByAppIdAndTypes(appId)]).then(([customer, users]) => {
        let bot = users.filter(user => {
            return user.userName == "bot";
        });
        return getAgentsList(customer, users, groupId).then(agents => {
            //assign direct given userId 
            let isValidUser = false;
            assignToUserId = stringUtils.isBlank(assignToUserId) ? null : assignToUserId;
            if (assignToUserId) {
                let assignee = users.filter(user => {
                    return user.userName == assignToUserId;
                });
                if (assignee.length == 0) {
                    return "user not exist"
                }
                isValidUser = true;
            }
            //switch according to conditions of botRouting and agentRouting
            return applozicClient.getGroupInfo(groupId, appId, bot[0].apzToken, true).then(group => {
                if (group && group.metadata && group.metadata.CONVERSATION_ASSIGNEE) {
                    let assignee = users.filter(user => {
                        return user.userName == group.metadata.CONVERSATION_ASSIGNEE;
                    });
                    if (assignee[0].type == 2) {
                        if (isValidUser || !customer.agentRouting) {
                            return assignConversationToUser(group, assignToUserId || customer.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY], appId, agents.header).then(res => {
                                return sendAssigneeChangedNotification(groupId, appId, assignToUserId || customer.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.NOTIFY_EVERYBODY], assignee[0].apzToken).then(response=>{
                                    return "success";
                                })
                            });
                        } else if (customer.agentRouting) {
                            return inAppMessageService.checkOnlineAgents(customer).then( async onlineUsers => {
                                let onlineUser = onlineUsers.find(agent => agent.connected);
                                if (onlineUser) {
                                    console.log("online user: ", onlineUser)
                                   let assignTo = await assignConversationInRoundRobin(groupId, agents.agentIds, appId, agents.header, onlineUsers);
                                        assignTo ? await sendAssigneeChangedNotification(groupId, appId, assignTo, assignee[0].apzToken) : "";
                                } else {
                                   let response = await assignConversationToUser(group, customer.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT], appId, agents.header);
                                    await sendAssigneeChangedNotification(groupId, appId, customer.defaultConversationAssignee[ROUTING_RULES_FOR_AGENTS.AUTOMATIC_ASSIGNMENT], assignee[0].apzToken);
                                
                                }
                                return "success";
                            });
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
/**
 * send assignment notification
 * @param {String} groupId groupId
 * @param {String} appId  appId
 * @param {String} assignTo conversation will assign to this user
 * @param {String} apzToken sender apzToken
 */
const sendAssigneeChangedNotification = (groupId, appId, assignTo, apzToken) => {
    let botHeaders = {
        "Content-Type": "application/json",
        "Application-Key": appId,
        "Authorization": "Basic " + apzToken,
    }
    return userService.getByUserNameAndAppId(assignTo, appId).then(user => {
        let messagePxy = {
            'groupId': groupId,
            'message': "Assigned to " + user.name || user.userName,
            'contentType': 10,
            'metadata': {
                'skipBot': true,
                'KM_ASSIGN': user.userName,
                'NO_ALERT': true,
                'BADGE_COUNT': false,
                'category': "ARCHIVE",
            }
        };
        return applozicClient.sendGroupMessagePxy(messagePxy, botHeaders);
    }).catch(err => {
        return;
    });
}

const createConversationFromMail = (req) => {
    let applicationId = req.body.applicationId
    let toAddresses = req.body.tos;
    let fromEmail = req.body.from;
    let messages = req.body.messages || [];
    let groupInfo = new GroupInfo();
    let headers = { "Apz-AppId": applicationId, "Content-Type": "application/json", "Apz-Product-App": true }
    if (!applicationId || messages.length == 0) {
        return "INVALID_PARAMETERS"
    }
    return userService.getUsersByAppIdAndTypes(applicationId).then(users => {
        toAddresses.map(toUser => {
            let userAdded = false;
             users.map(user=> {
                if (toUser == user.userName) {
                    groupInfo.users.push({ "userId": user.userName, "role": 1 })
                    userAdded = true;
                }
            })
            if (!userAdded) { groupInfo.users.push({ "userId": toUser, "role": 3 }) }
        });
        let adminUser = users.find(user => user.type == 3);
        return applozicClient.getUserDetails([fromEmail], adminUser.applicationId, adminUser.apzToken).then(userDetail => {
            groupInfo.groupName = adminUser.name || adminUser.userName;
            groupInfo.admin = adminUser.userName;
            groupInfo.users[0].userId = adminUser.userName;
            groupInfo.metadata.CONVERSATION_ASSIGNEE = adminUser.userName;
            groupInfo.metadata.KM_CONVERSATION_TITLE = req.body.subject;
            groupInfo.metadata['KM_CONVERSATION_SUBJECT'] = req.body.subject;
            headers['Apz-Token'] = 'Basic ' + adminUser.apzToken;
            if (userDetail && userDetail.length > 0) {
                //create conversation with first user
                groupInfo.users[1].userId = userDetail[0].userId;
                return applozicClient.createSupportGroup(groupInfo, headers).then(result => {
                    console.log('conversation : ', result);
                    return sendMessageIntoConversation(result.response.clientGroupId, messages, applicationId, userDetail[0]);
                });
            } else {
                //create new user
                let name = fromEmail.substring(0, fromEmail.indexOf('@'));
                return applozicClient.createApplozicClient(fromEmail, null, applicationId, null, null, fromEmail, name, EMAIL_NOTIFY.SUBSCRIBE_ALL).then(user => {
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
    }).catch(err => {
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

const isAssignedBotAlreadyPresentIngroup = (group,agents) =>{
    let assignedBot  = agents.find(element =>{
        return element.role == GROUP_ROLE.MODERATOR;
    });

    let groupUsers =group.groupUsers;
    let isBotPresent;
    if(assignedBot && groupUsers){
        isBotPresent = groupUsers.find(element => {
            return element.userId ==assignedBot.userId && element.role == GROUP_ROLE.MODERATOR;
        });
    }
    return isBotPresent;
}



module.exports = {
    addMemberIntoConversation: addMemberIntoConversation,
    createConversationFromMail: createConversationFromMail,
    switchConversationAssignee: switchConversationAssignee
}