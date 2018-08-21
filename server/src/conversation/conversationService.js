const GroupInfo = require('./conversationUtils');
const applozicClient = require("../utils/applozicClient");
const userService = require("../users/userService");
const customerService = require('../customer/customerService');
const config = require('../../conf/config.js')
const logger = require('../utils/logger');
const cacheClient = require("../cache/hazelCacheClient");
const inAppMessageService = require('../application/inAppMsgService');
const { EMAIL_NOTIFY } = require('../users/constants');

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
                        if (customer.botRouting) {
                            if (agents.assignTo != customer.userName) {
                                applozicClient.addMemberIntoConversation({ groupDetails: [{ groupId: groupId, userId: user.userName, role: 2 }] }, customer.applications[0].applicationId, header.apzToken, header.ofUserId);
                                assignToDefaultAgent(groupId, customer.applications[0].applicationId, agents.assignTo, agents.header)
                            }
                            return { code: "SUCCESS", data: 'success' }
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
        return applozicClient.getGroupInfo(groupId, appId, header.apzToken, true).then(group => {
            if (group.metadata.CONVERSATION_ASSIGNEE != assignTo) {
                let params = { "clientGroupIds": [groupId], "userIds": [group.metadata.CONVERSATION_ASSIGNEE] }
                return assignConversationToUser(groupId, assignTo, appId, header).then(res=>{
                   applozicClient.removeGroupMembers(params, appId, header.apzToken, assignTo);
                   return res;
                })
                
                    
            }
        })
    });
};


const assignConversationToUser = (groupId, assignTo, appId, header) => {
    let groupInfo = { groupDetails: [{ "groupId": groupId, "userId": assignTo, role: 1 }] };
    logger.info('addMemberIntoConversation - group info:', groupInfo, 'applicationId: ', appId, 'apzToken: ', header.apzToken, 'ofUserId: ', header.ofUserId)
    return applozicClient.addMemberIntoConversation(groupInfo, appId, header.apzToken, header.ofUserId).then(result => {
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
    })
}
/**
 * 
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
            userIdsArray = value.userIds;
        } else {
            logger.info("received nullfrom cache, adding default agent as assignee");
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
        cacheClient.setDataIntoMap(mapPrifix, key, { userIds: userIdsArray });
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
                    header.apzToken = new Buffer(user.userName+':'+user.accessToken).toString('base64');
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
            return applozicClient.getGroupInfo(groupId, appId, new Buffer(bot[0].userName+":"+bot[0].accessToken).toString('base64'), true).then(group => {
                if (group && group.metadata && group.metadata.CONVERSATION_ASSIGNEE) {
                    let assignee = users.filter(user => {
                        return user.userName == group.metadata.CONVERSATION_ASSIGNEE;
                    });
                    if (assignee[0].type == 2) {
                        if (customer.agentRouting) {
                            inAppMessageService.checkOnlineAgents(customer).then(onlineUsers => {
                                let onlineUser = onlineUsers.find(agent => agent.connected);
                                if (onlineUser) {
                                    console.log("online user: ", onlineUser)
                                    assingConversationInRoundRobin(groupId, agents.agentIds, appId, agents.header, onlineUsers);
                                } else {
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
        let adminUser = users.find(user => user.type == 3);
        return applozicClient.getUserDetails([fromEmail], adminUser.applicationId, new Buffer(adminUser.userName + ":" + adminUser.accessToken).toString('base64')).then(userDetail => {
            groupInfo.groupName = adminUser.name || adminUser.userName;
            groupInfo.admin = adminUser.userName;
            groupInfo.users[0].userId = adminUser.userName;
            groupInfo.metadata.CONVERSATION_ASSIGNEE = adminUser.userName;
            groupInfo.metadata.KM_CONVERSATION_TITLE = req.body.subject;
            groupInfo.metadata['KM_CONVERSATION_SUBJECT'] = req.body.subject;
            headers['Apz-Token'] = 'Basic ' + new Buffer(adminUser.userName + ":" + adminUser.accessToken).toString('base64');
            if (userDetail && userDetail.length > 0) {
                //create conversation with first user
                groupInfo.users[1].userId = userDetail[0].userId;
                return applozicClient.createSupportGroup(groupInfo, headers).then(result => {
                    console.log('conversation : ', result);
                    return sendMessageIntoConversation(result.response.clientGroupId, messages, applicationId, userDetail[0]);
                });
            } else {
                //create new user
                return applozicClient.createApplozicClient(fromEmail, null, applicationId, null, null, fromEmail, null, EMAIL_NOTIFY.SUBSCRIBE_ALL).then(user => {
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



module.exports = {
    addMemberIntoConversation: addMemberIntoConversation,
    createConversationFromMail: createConversationFromMail,
    switchConversationAssignee: switchConversationAssignee
}