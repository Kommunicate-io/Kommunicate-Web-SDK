(function(window){
    'use strict';
    function define_ALApiService(){
        var ALApiService = {};
        var MCK_APP_ID = "";
        var mckUtils = new MckUtils();
        var KM_BASE_URL = "https://apps.applozic.com";
        var INITIALIZE_APP_URL = "/v2/tab/initialize.page";
        var MESSAGE_LIST_URL = "/rest/ws/message/list";
        var MESSAGE_SEND_URL = "/rest/ws/message/send";
        var GROUP_CREATE_URL = "/rest/ws/group/create";
        var GROUP_LIST_URL = "/rest/ws/group/list";
        var UPDATE_REPLY_MAP ="/rest/ws/message/detail";
        var MESSAGE_DELETE_URL = "/rest/ws/message/delete";
        var MESSAGE_READ_UPDATE_URL = "/rest/ws/message/read";
        var MESSAGE_DELIVERY_UPDATE_URL = "/rest/ws/message/delivered"; 

        function getAsUriParameters(data) {
            var url = '';
            for (var prop in data) {
               url += encodeURIComponent(prop) + '=' + 
                   encodeURIComponent(data[prop]) + '&';
            }
            return url.substring(0, url.length - 1)
        }

        ALApiService.initServerUrl = function(serverUrl) {
            KM_BASE_URL = serverUrl;
        }
		
		
        /**
         * Login user to the chat session, must be done once in a session.
         * Usage Example:
         * Applozic.ALApiService.login({data: {alUser: {userId: 'debug4', password: 'debug4', appVersionCode: 108, applicationId: 'applozic-sample-app'}}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.login = function(options) {
			
            MCK_APP_ID = options.data.alUser.applicationId;
		
            mckUtils.ajax({
                url: KM_BASE_URL + INITIALIZE_APP_URL,
                type: 'post',
                async: (typeof options.async !== 'undefined') ? options.async : true,                
                data: JSON.stringify(options.data.alUser),
                contentType: 'application/json',
                headers: {
                    'Application-Key': MCK_APP_ID
                },
                success: function(response) {
                    mckUtils.setEncryptionKey(response.encryptionKey);
                    var AUTH_CODE = btoa(response.userId + ':' + response.deviceKey);
                    mckUtils.setAjaxHeaders(AUTH_CODE, MCK_APP_ID, response.deviceKey, options.data.alUser.password, options.data.alUser.appModuleName);
            
                    if (options.success) {
                      options.success(response);
                    }
                },
                error: function(response) {
                    if (options.error) {
                      options.error(response);
                    }
                }
            });
        }

        /**
         * Get messages list.
         * 
         * Usage Examples:
         * 
         * Get latest messages group by users and groups:
         * Applozic.ALApiService.getMessages({data: {}, success: function(response) {console.log(response);}, error: function() {}});
         * 
         * Messages between logged in user and a specific userId:
         * Applozic.ALApiService.getMessages({data: {userId: 'debug4'}, success: function(response) {console.log(response);}, error: function() {}});
         * 
         * Messages between logged in user and a specific groupId:
         * Applozic.ALApiService.getMessages({data: {groupId: 5694841}, success: function(response) {console.log(response);}, error: function() {}});
         * 
         * Messages history before a timestamp, for loading message list, pass the endTime = createdAt of the last message received in the message list api response
         * Applozic.ALApiService.getMessages({data: {userId: 'debug4', endTime: 1508177918406}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.getMessages = function(options) {
            if (options.data.userId || options.data.groupId) {
                if (options.data.pageSize === 'undefined') {
                    options.data.pageSize = 30;                    
                }
            } else if (typeof options.data.mainPageSize === 'undefined') {
                options.data.mainPageSize = 60;
            }
            var data = getAsUriParameters(options.data);
            var response = new Object();
            mckUtils.ajax({
                url: KM_BASE_URL + MESSAGE_LIST_URL + "?" + data,
                async: (typeof options.async !== 'undefined') ? options.async : true,                
                type: 'get',
                success: function(data) {
                    response.status = "success";
                    response.data = data;
                    if (options.success) {
                        options.success(response);
                    }
                    return;
                },
                error: function(xhr, desc, err) {
                    response.status = "error";
                    if (options.error) {
                        options.error(response);
                    }
                }
            });
        }

        /**
         * Usage Example:
         * Applozic.ALApiService.sendMessage({data: {message: {"type":5,"contentType":0,"message":"hi","to":"debug4","metadata":{},"key":"mpfj2","source":1}}, success: function(response) {console.log(response);}, error: function() {}});
         * type: 5 - Sent Message, 4 - Received Message
         * contentType: 0 - Standard Chat Message
         * to: userId to whom the message is to be sent
         * metadata: Additional key value pairs
         * source (optional): 1 - WEB, 5 - DESKTOP_BROWSER, 6 - MOBILE_BROWSER
         */
        ALApiService.sendMessage = function(options) {
            mckUtils.ajax({
                type: 'POST',
                url: KM_BASE_URL + MESSAGE_SEND_URL,
                global: false,
                data: JSON.stringify(options.data.message),
                async: (typeof options.async !== 'undefined') ? options.async : true,                
                contentType: 'application/json',
                success: function(response) {
                    if (options.success) {
                      options.success(response);
                    }
                },
                error: function(response) {
                    if (options.error) {
                      options.error(response);
                    }
                }
            });
        }

        /**
         * Send delivery report for a message.
         * Usage Example:
         * Applozic.ALApiService.sendDeliveryUpdate({data: {key: '5-f4c7860c-684a-4204-942d-2ccd2375f4a0-1508588649594'}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.sendDeliveryUpdate = function(options) {
            mckUtils.ajax({
                url: KM_BASE_URL + MESSAGE_DELIVERY_UPDATE_URL,
                data: "key=" + options.data.key,
                global: false,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,                
                success: function() {},
                error: function() {}
            });
        }

        /**
         * Send read report for a message.
         * Usage Example:
         * Applozic.ALApiService.sendReadUpdate({data: {key: '5-f4c7860c-684a-4204-942d-2ccd2375f4a0-1508588649594'}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.sendReadUpdate = function(options) {            
            mckUtils.ajax({
                url: KM_BASE_URL + MESSAGE_READ_UPDATE_URL,
                data: "key=" + options.data.key,
                global: false,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,                
                success: function() {},
                error: function() {}
            });
        }

        /**
         * Delete message
         * Usage Example:
         * Applozic.ALApiService.deleteMessage({data: {key: '5-f4c7860c-684a-4204-942d-2ccd2375f4a0-1508588649594'}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.deleteMessage = function(options) {
            mckUtils.ajax({
                url: KM_BASE_URL + MESSAGE_DELETE_URL + "?key=" + options.data.key,
                global: false,                
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,                
                success: function(response) {
                    if (options.success) {
                      options.success(response);
                    }
                },
                error: function(response) {
                    if (options.error) {
                      options.error(response);
                    }
                }
            });
        }

        /**
         * Reply to a particular message
         * Usage Example:
         * Applozic.ALApiService.updateReplyMessage({data: {key: '5-f4c7860c-684a-4204-942d-2ccd2375f4a0-1508588649594'}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.updateReplyMessage = function(options) {
            mckUtils.ajax({
                url: KM_BASE_URL + UPDATE_REPLY_MAP + "?keys=" + options.data.key,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,                
                success: function(response) {
                    if (options.success) {
                      options.success(response);
                    }
                },
                error: function(response) {
                    if (options.error) {
                      options.error(response);
                    }
                }
            });
        }

        /**
         * Delete conversation thread of the logged in user with a particular user or group.
         * Usage Example:
         * 
         * Delete by userId
         * Applozic.ALApiService.deleteConversation({data: {userId: 'debug2'}, success: function(response) {console.log(response);}, error: function() {}});
         * Delete by groupId
         * Applozic.ALApiService.deleteConversation({data: {groupId: 5694841}, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.deleteConversation = function(options) {
            mckUtils.ajax({
                url: KM_BASE_URL + CONVERSATION_DELETE_URL,                
                type: "get",
                async: (typeof options.async !== 'undefined') ? options.async : true,                
                global: false,
                data: getAsUriParameters(options.data),
                success: function(response) {
                    if (options.success) {
                      options.success(response);
                    }
                },
                error: function(response) {
                    if (options.error) {
                      options.error(response);
                    }
                }
            });
        }

        /**
         * Create group
         * Usage Example:
         * Applozic.ALApiService.createGroup({data: {group: {"groupName":"test","users":[{'userId': 'debug3'}, {'userId': 'debug4'}],"type":2,"metadata":{"CREATE_GROUP_MESSAGE":":adminName created group :groupName","REMOVE_MEMBER_MESSAGE":":adminName removed :userName","ADD_MEMBER_MESSAGE":":adminName added :userName","JOIN_MEMBER_MESSAGE":":userName joined","GROUP_NAME_CHANGE_MESSAGE":"Group name changed to :groupName","GROUP_ICON_CHANGE_MESSAGE":"Group icon changed","GROUP_LEFT_MESSAGE":":userName left","DELETED_GROUP_MESSAGE":":adminName deleted group","GROUP_USER_ROLE_UPDATED_MESSAGE":":userName is :role now","GROUP_META_DATA_UPDATED_MESSAGE":"","ALERT":"","HIDE":""}} }, success: function(response) {console.log(response);}, error: function() {}});
         */
        ALApiService.createGroup = function(options) {
            mckUtils.ajax({
                url: KM_BASE_URL + GROUP_CREATE_URL,
                global: false,
                data: JSON.stringify(options.data.group),
                type: 'post',
                async: (typeof options.async !== 'undefined') ? options.async : true,                                
                contentType: 'application/json',
                success: function(response) {
                    if (options.success) {
                      options.success(response);
                    }
                },
                error: function(response) {
                    if (options.error) {
                      options.error(response);
                    }
                }
            });
        }

        /**
         * Get groups list.
         * Usage Example:
         * Applozic.ALApiService.loadGroups({success: function(response) {console.log(response);} });
         */
        ALApiService.loadGroups = function(options) {
            mckUtils.ajax({
                url: KM_BASE_URL + GROUP_LIST_URL,
                type: 'get',
                async: (typeof options.async !== 'undefined') ? options.async : true,                
                global: false,
                success: function(response) {
                    if (options.success) {
                      options.success(response);
                    }
                },
                error: function(response) {
                    if (options.error) {
                      options.error(response);
                    }
                }
            });
        }

        return ALApiService;
    }

    //define globally if it doesn't already exist
    if(typeof(ALApiService) === 'undefined'){
        window.Applozic.ALApiService = define_ALApiService();
    }
    else{
        console.log("ALApiService already defined.");
    }
})(window);