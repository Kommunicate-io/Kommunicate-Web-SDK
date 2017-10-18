window['APPLOZIC'] || (function(w, d) {
    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function(str) {
            if (str === null)
                return false;
            var i = str.length;
            if (this.length < i)
                return false;
            for (--i; (i >= 0) && (this[i] === str[i]); --i)
                continue;
            return i < 0;
        };
    }
    // DEFAULT INITIALIZE OPTION
    var default_options = {
        "baseUrl": "https://apps.applozic.com",
        "fileUrl": "https://applozic.appspot.com",
        "userId": null,
        "appId": null,
        "userName": null,
        "maxAttachmentSize": 25
    // default size is 25MB
    };
    // DEFAULT MESSAGE OPTION
    var default_message_options = {
        "type": 5,
        "contentType": 0
    };
    APPLOZIC = function(options) {
        var _this = this;
        if ($.type(options) === "object") {
            options = $.extend(true, {}, default_options, options);
        }
        var MCK_TOKEN;
        var AUTH_CODE;
        var MCK_DEVICE_KEY;
        var apzChannelService;
        var MCK_WEBSOCKET_URL;
        var MCK_COUNTRY_CODE;
        var MCK_TIMEZONEOFFSET;
        var MCK_USER_DETAIL_MAP = [];
        var MCK_USER_ID = options.userId;
        var MCK_BASE_URL = options.baseUrl;
        var MCK_FILE_URL = options.fileUrl;
        var APPLICATION_ID = options.appId;
        var MCK_USER_NAME = options.userName;
        var apzUserUtils = new ApzUserUtils();
        var apzMessageUtils = new ApzMessageUtils();
        var INIT_CALLBACK = typeof options.onInit === 'function' ? options.onInit : "";
        var USER_DETAIL_URL = "/rest/ws/user/detail";
        var INITIALIZE_APP_URL = "/tab/initialize.page";
        var MESSAGE_SEND_URL = "/rest/ws/message/send";
        var MESSAGE_LIST_URL = "/rest/ws/message/list";
        var MESSAGE_DELETE_URL = "/rest/ws/message/delete";
        var CONVERSATION_DELETE_URL = "/rest/ws/message/delete/conversation";
        _this.events = {
            'onConnectFailed': function() {
                w.console.log();
            },
            'onConnect': function() {
                w.console.log();
            },
            'onMessageDelivered': function(obj) {
                w.console.log(obj);
            },
            'onMessageRead': function(obj) {
                w.console.log(obj);
            },
            'onMessageDeleted': function(obj) {
                w.console.log(obj);
            },
            'onConversationDeleted': function(obj) {
                w.console.log(obj);
            },
            'onUserConnect': function(obj) {
                w.console.log(obj);
            },
            'onUserDisconnect': function(obj) {
                w.console.log(obj);
            },
            'onConversationReadFromOtherSource': function(obj) {
                w.console.log(obj);
            },
            'onConversationRead': function(obj) {
                w.console.log(obj);
            },
            'onMessageReceived': function(obj) {
                w.console.log(obj);
            },
            'onMessageSentUpdate': function(obj) {
                w.console.log(obj);
            },
            'onMessageSent': function(obj) {
                w.console.log(obj);
            },
            'onCustomNotification': function(obj) {
                w.console.log(obj);
            }
        };
        _this.getOptions = function() {
            return options;
        };
        _this.getTimeZoneOffset = function() {
            return MCK_TIMEZONEOFFSET;
        };
        _this.sendNotifcation = function(params) {
            apzChannelService.sendCustomNotification(params);
        }
        _this.init = function() {
            if (APPLICATION_ID === null || MCK_USER_ID === null) {
                if (INIT_CALLBACK) {
                    INIT_CALLBACK('INVALID_REQUEST');
                }
            }
            var data = "applicationId=" + APPLICATION_ID + "&userId=" + MCK_USER_ID;
            if (MCK_USER_NAME !== null) {
                data += "&userName=" + MCK_USER_NAME;
            }
            $.ajax({
                url: MCK_BASE_URL + INITIALIZE_APP_URL + "?" + data,
                type: 'get',
                success: function(result) {
                    if (result === "INVALID_APPID") {
                        if (INIT_CALLBACK) {
                            INIT_CALLBACK('INVALID_APPID');
                        }
                    }
                    result = $.parseJSON(result);
                    if (typeof result.token !== undefined) {
                        MCK_TOKEN = result.token;
                        MCK_DEVICE_KEY = result.deviceKey;
                        MCK_FILE_URL = result.fileBaseUrl;
                        MCK_COUNTRY_CODE = result.countryCode;
                        MCK_WEBSOCKET_URL = result.websocketUrl;
                        MCK_TIMEZONEOFFSET = result.timeZoneOffset;
                        AUTH_CODE = btoa(result.userId + ":" + result.deviceKey);
                        $.ajaxPrefilter(function(options) {
                            if (!options.beforeSend) {
                                options.beforeSend = function(jqXHR) {
                                    jqXHR.setRequestHeader("UserId-Enabled", true);
                                    jqXHR.setRequestHeader("Authorization", "Basic " + AUTH_CODE);
                                    jqXHR.setRequestHeader("Application-Key", APPLICATION_ID);
                                };
                            }
                        });
                        apzChannelService = new ApzChannelService(_this);
                        var apzChannel = apzChannelService.init();
                        if (INIT_CALLBACK) {
                            INIT_CALLBACK('SUCCESSFULLY_INITIALIZE');
                        }
                    } else if (INIT_CALLBACK) {
                        INIT_CALLBACK('UNABLE TO INITIALIZE');
                    }
                },
                error: function() {
                    if (INIT_CALLBACK) {
                        INIT_CALLBACK('UNABLE TO INITIALIZE');
                    }
                }
            });
        };
        _this.sendMessage = function(message, optns) {
            if ($.type(message) !== "object" || (!message.to && !message.groupId)) {
                optns.callback('INVALID_REQUEST');
                return;
            }
            message = $.extend(true, {}, default_message_options, message);
            var resp = {};
            $.ajax({
                type: "POST",
                url: MCK_BASE_URL + MESSAGE_SEND_URL,
                global: false,
                data: w.JSON.stringify(message),
                contentType: 'application/json',
                success: function(data) {
                    if (typeof optns.callback === "function") {
                        resp.status = "success";
                        var messageFeed = {};
                        messageFeed.key = data.messageKey;
                        messageFeed.timeStamp = data.createdAt;
                        messageFeed.message = message.message;
                        messageFeed.from = MCK_USER_ID;
                        messageFeed.to = message.to;
                        messageFeed.status = "sent";
                        messageFeed.type = 'outbox';
                        resp.message = messageFeed;
                        if (optns.isPlugin) {
                            optns.response = resp;
                            optns.callback(optns);
                        } else {
                            optns.callback(resp);
                        }
                    }
                },
                error: function() {
                    if (typeof optns.callback === "function") {
                        resp.status = "error";
                        if (optns.isPlugin) {
                            optns.response = resp;
                            optns.callback(optns);
                        } else {
                            optns.callback(resp);
                        }
                    }
                }
            });
        };
        _this.userInfo = function(id, callback) {
            var resp = {
                id: id
            };
            var userDetail = apzUserUtils.getUserDetail(id);
            if (typeof userDetail !== 'undefined') {
                resp.status = "success";
                resp.response = userDetail;
                return resp;
            }
            $.ajax({
                url: MCK_BASE_URL + USER_DETAIL_URL + "?userIds=" + id,
                async: false,
                type: 'get',
                success: function(data) {
                    if (data + '' === 'null') {
                        resp.status = "error";
                    } else {
                        resp.status = "success";
                        if (data.length > 0) {
                            $.each(data, function(i, userDetail) {
                                MCK_USER_DETAIL_MAP[userDetail.userId] = userDetail;
                                resp.response = userDetail;
                            });
                        }
                    }
                    if (typeof callback === "function") {
                        callback(resp);
                    }
                    return resp;
                },
                error: function() {
                    resp.status = "error";
                    if (typeof callback === "function") {
                        callback(resp);
                    }
                }
            });
        };
        _this.deleteMessage = function(key, callback) {
            var resp = {
                messageKey: key
            };
            $.ajax({
                url: MCK_BASE_URL + MESSAGE_DELETE_URL + "?key=" + key,
                type: 'get',
                success: function(data) {
                    resp.status = (data === "success") ? "success" : "error";
                    if (typeof callback === "function") {
                        callback(resp);
                    }
                },
                error: function() {
                    resp.status = "error";
                    if (typeof callback === "function") {
                        callback(resp);
                    }
                }
            });
        };
        _this.deleteConversation = function(params, callback) {
            var resp = {
                id: params.id
            };
            if (typeof params.id !== 'undefined') {
                var data = (params.isGroup) ? "groupId=" + params.id : "userId=" + params.id;
                $.ajax({
                    type: "get",
                    url: MCK_BASE_URL + CONVERSATION_DELETE_URL,
                    global: false,
                    data: data,
                    success: function(data) {
                        resp.status = (data === "success") ? "success" : "error";
                        if (typeof callback === "function") {
                            callback(resp);
                        }
                    },
                    error: function() {
                        resp.status = "error";
                        if (typeof callback === "function") {
                            callback(resp);
                        }
                    }
                });
            } else {
                resp.status = "error";
                if (typeof callback === "function") {
                    callback(resp);
                }
            }
        };
        _this.messageList = function(params, optns) {
            var tabId = params.id;
            if (typeof optns.callback !== 'function') {
                return;
            }
            var data = (params.pageSize) ? "&pageSize=" + params.pageSize : "&pageSize=200";
            if (typeof tabId !== "undefined" && tabId !== "") {
                data = (params.isGroup) ? "&groupId=" + tabId : "&userId=" + tabId;
                if (params.startTime) {
                    data += "&endTime=" + params.startTime;
                }
            }
            var resp = {
                'id': tabId
            };
            $.ajax({
                url: MCK_BASE_URL + MESSAGE_LIST_URL + "?startIndex=0" + data,
                type: 'get',
                global: false,
                success: function(data) {
                    resp.status = "success";
                    if (optns.isPlugin) {
                        resp.data = data;
                        optns.response = resp;
                        optns.callback(optns);
                    } else {
                        if (data + '' === "null") {
                            resp.messages = [];
                        } else {
                            if (typeof data.message === "undefined" || data.message.length === 0) {
                                resp.messages = [];
                            } else {
                                var messages = data.message;
                                var messageFeeds = new Array();
                                $.each(messages, function(i, message) {
                                    if (typeof message.to !== "undefined") {
                                        var messageFeed = apzMessageUtils.getMessageFeed(message);
                                        messageFeeds.push(messageFeed);
                                    }
                                });
                            }
                            if (data.userDetails.length > 0) {
                                $.each(data.userDetails, function(i, userDetail) {
                                    MCK_USER_DETAIL_MAP[userDetail.userId] = userDetail;
                                });
                            }
                            resp.messages = messageFeeds;
                        }
                        optns.callback(resp);
                    }
                },
                error: function() {
                    resp.status = "error";
                    if (optns.isPlugin) {
                        optns.response = resp;
                        optns.callback(optns);
                    } else {
                        optns.callback(resp);
                    }
                }
            });
        };
        function ApzMessageUtils() {
            var _this = this;
            _this.getMessageFeed = function(message) {
                var messageFeed = {};
                messageFeed.key = message.key;
                messageFeed.timeStamp = message.createdAtTime;
                messageFeed.message = message.message;
                messageFeed.from = (message.type === 4) ? message.to : MCK_USER_ID;
                messageFeed.to = (message.type === 5) ? message.to : MCK_USER_ID;
                messageFeed.status = "read";
                messageFeed.type = (message.type === 4) ? 'inbox' : 'outbox';
                if (message.type === 5) {
                    if (message.status === 3) {
                        messageFeed.status = "sent";
                    } else if (message.status === 4) {
                        messageFeed.status = "delivered";
                    }
                }
                if (typeof message.fileMeta === 'object') {
                    message.fileMeta.url = MCK_FILE_URL + '/rest/ws/aws/file/' + message.fileMeta.blobKey;
                    delete message.fileMeta.blobKey;
                    messageFeed.file = message.fileMeta;
                }
                messageFeed.source = message.source;
                messageFeed.metadata = message.metadata;
                return messageFeed;
            };
        }
        function ApzUserUtils() {
            var _this = this;
            _this.updateUserStatus = function(params) {
                if (typeof MCK_USER_DETAIL_MAP[params.userId] === 'object') {
                    var userDetail = MCK_USER_DETAIL_MAP[params.userId];
                    if (params.status === 0) {
                        userDetail.connected = false;
                        userDetail.lastSeenAtTime = params.lastSeenAtTime;
                    } else if (params.status === 1) {
                        userDetail.connected = true;
                    }
                } else {
                    return;
                }
            };
            _this.getUserDetail = function(userId) {
                if (typeof MCK_USER_DETAIL_MAP[userId] === 'object') {
                    return MCK_USER_DETAIL_MAP[userId];
                } else {
                    return;
                }
            };
        }
        function ApzChannelService($this) {
            var _this = this;
            if (typeof $this.events === 'object') {
                var stompClient = null;
                var port = (!MCK_WEBSOCKET_URL.startsWith("https")) ? "15674" : "15675";
                var events = $this.events;
                _this.on_error = function(err) {
                    w.console.log("Error in channel notification. " + err.body);
                    events.onConnectFailed();
                };
                _this.subscibeToUserId = function() {
                    stompClient.subscribe("/topic/user-" + MCK_USER_ID, _this.onCustomMessage);
                };
                _this.onCustomMessage = function(message) {
                    var resp = $.parseJSON(message.body);
                    var messageType = resp.type;
                    if (messageType === "APZ_CUSTOM_MESSAGE") {
                        events.onCustomNotification(resp.message);
                    }
                };
                _this.send_status = function(status) {
                    stompClient.send('/topic/status', {
                        "content-type": "text/plain"
                    }, MCK_TOKEN + "," + status);
                };
                _this.on_connect = function() {
                    stompClient.subscribe("/topic/" + MCK_TOKEN, _this.on_message);
                    _this.send_status(1);
                    _this.subscibeToUserId();
                    events.onConnect();
                };
                _this.sendMessage = function(message, optns) {
                    stompClient.send('/topic/message', {
                        "content-type": "application/json"
                    }, w.JSON.stringify(message));
                    var resp = {};
                    if (typeof optns.callback === "function") {
                        resp.status = "success";
                        if (optns.isPlugin) {
                            optns.response = resp;
                            optns.messagePxy = message;
                            optns.callback(optns);
                        } else {
                            optns.callback(resp);
                        }
                    }
                };
                _this.sendCustomNotification = function(params) {
                    var instantMessage = {
                        type: 'APZ_CUSTOM_MESSAGE',
                        message: params.message
                    }
                    var response = stompClient.send('/topic/user-' + params.to, {
                        "content-type": "application/json"
                    }, w.JSON.stringify(instantMessage));
                    console.log(response);
                };
                _this.on_message = function(message) {
                    var resp = $.parseJSON(message.body);
                    var messageType = resp.type;
                    if (messageType === "APPLOZIC_04" || messageType === "MESSAGE_DELIVERED") {
                        events.onMessageDelivered({
                            'messageKey': resp.message.split(",")[0]
                        });
                    } else if (messageType === "APPLOZIC_08" || messageType === "MT_MESSAGE_DELIVERED_READ") {
                        events.onMessageRead({
                            'messageKey': resp.message.split(",")[0]
                        });
                    } else if (messageType === "APPLOZIC_05") {
                        events.onMessageDeleted({
                            'messageKey': resp.message.split(",")[0],
                            'userKey': resp.message.split(",")[1]
                        });
                    } else if (messageType === "APPLOZIC_06") {
                        var userId = resp.message;
                        if (typeof userId !== 'undefined') {
                            events.onConversationDeleted({
                                'userKey': userId
                            });
                        }
                    } else if (messageType === "APPLOZIC_11") {
                        events.onUserConnect({
                            'userId': resp.message
                        });
                        apzUserUtils.updateUserStatus({
                            'userId': resp.message,
                            'status': 1
                        });
                    } else if (messageType === "APPLOZIC_12") {
                        events.onUserDisconnect({
                            'userId': resp.message.split(",")[0],
                            'lastSeenAtTime': resp.message.split(",")[1]
                        });
                        apzUserUtils.updateUserStatus({
                            'userId': resp.message.split(",")[0],
                            'status': 0,
                            'lastSeenAtTime': resp.message.split(",")[1]
                        });
                    } else if (messageType === "APPLOZIC_09)") {
                        events.onConversationReadFromOtherSource({
                            'userId': resp.message
                        });
                    } else if (messageType === "APPLOZIC_10") {
                        events.onConversationRead({
                            'userId': resp.message
                        });
                    } else if (messageType === "APPLOZIC_03") {
                        var messageFeed = apzMessageUtils.getMessageFeed(resp.message);
                        events.onMessageSentUpdate({
                            'messageKey': messageFeed.key
                        });
                    } else if (messageType === "APPLOZIC_01" || messageType === "MESSAGE_RECEIVED") {
                        var messageFeed = apzMessageUtils.getMessageFeed(resp.message);
                        events.onMessageReceived({
                            'message': messageFeed
                        });
                    } else if (messageType === "APPLOZIC_02") {
                        var messageFeed = apzMessageUtils.getMessageFeed(resp.message);
                        events.onMessageSent({
                            'message': messageFeed
                        });
                    }
                };
                _this.init = function() {
                    var socket = new SockJS(MCK_WEBSOCKET_URL + ":" + port + "/stomp");
                    stompClient = w.Stomp.over(socket);
                    stompClient.heartbeat.outgoing = 0;
                    stompClient.heartbeat.incoming = 0;
                    stompClient.connect("guest", "guest", _this.on_connect, _this.on_error, '/');
                    addEventListener("beforeunload", function(e) {
                        _this.send_status(0);
                    });
                    return _this;
                }
            }
        }
        _this.init();
    };
})(window, document);