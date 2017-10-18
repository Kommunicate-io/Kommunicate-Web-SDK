var MCK_GROUP_MAP = [];
var MCK_CLIENT_GROUP_MAP = [];
(function($applozic, w, d) {
	"use strict";
	var default_options = {
		baseUrl : "https://apps.applozic.com",
		fileBaseUrl : "https://applozic.appspot.com",
		notificationIconLink : '',
		launcher : "applozic-launcher",
		userId : null,
		appId : null,
		userName : null,
		contactNumber : null,
		email : null,
		supportId : null,
		mode : "standard",
		visitor : false,
		olStatus : false,
		desktopNotification : false,
		locShare : false,
		maxAttachmentSize : 25, // default size is 25MB
		notification : true,
		launchOnUnreadMessage : false,
		loadOwnContacts : false,
		maxGroupSize : 100,
		authenticationTypeId : 0,
    labels: {
            'conversations.title': 'Converations',
            'start.new': 'Start New',
            'search.contacts': 'Contacts',
            'search.groups': 'Groups',
            'empty.groups': 'No groups yet!',
            'empty.contacts': 'No contacts yet!',
            'empty.messages': 'No messages yet!',
            'no.more.messages': 'No more messages!',
            'empty.conversations': 'No conversations yet!',
            'no.more.conversations': 'No more conversations!',
            'search.placeholder': 'Search...',
            'location.placeholder': 'Enter a location',
            'create.group.title': 'Create Group',
            'members.title': 'Members',
            'add.members.title': 'Add Member',
            'remove.member': 'Remove Member',
            'change.role': 'Change Role',
            'group.info.update': 'Update',
            'group.info.updating': 'Updating...',
            'add.group.icon': 'Add Group Icon',
            'change.group.icon': 'Change Group Icon',
            'group.title': 'Group Title',
            'group.type': 'Group Type',
            'group.create.submit': 'Creating Group...',
            'blocked': 'You have blocked this user',
            'group.chat.disabled': 'You are no longer part of this group!',
            'block.user.alert': 'Are you sure you want to block this user?',
            'unblock.user.alert': 'Are you sure you want to unblock this user?',
            'exit.group.alert': 'Are you sure you want to exit this group?',
            'remove.member.alert': 'Are you sure you want to remove this member?',
            'clear.messages.alert': 'Are you sure you want to delete all the conversation?',
            'typing': 'typing...',
            'is.typing': 'is typing...',
            'online': 'Online',
            'clear.messages': 'Clear Messages',
            'delete': 'Delete',
            'block.user': 'Block User',
            'unblock.user': 'Unblock User',
            'group.info.title': 'Group Info',
            'exit.group': 'Exit Group',
            'location.share.title': 'Location Sharing',
            'my.location': 'My Location',
            'send': 'Send',
            'send.message': 'Send Message',
            'smiley': 'Smiley',
            'close': 'Close',
            'edit': 'Edit',
            'save': 'Save',
            'file.attachment': 'Files & Photos',
            'file.attach.title': 'Attach File',
            'last.seen': 'Last seen',
            'last.seen.on': 'Last seen on',
            'ago': 'ago',
            'group.metadata': {
                'CREATE_GROUP_MESSAGE': ':adminName created group :groupName',
                'REMOVE_MEMBER_MESSAGE': ':adminName removed :userName',
                'ADD_MEMBER_MESSAGE': ':adminName added :userName',
                'JOIN_MEMBER_MESSAGE': ':userName joined',
                'GROUP_NAME_CHANGE_MESSAGE': 'Group name changed to :groupName',
                'GROUP_ICON_CHANGE_MESSAGE': 'Group icon changed',
                'GROUP_LEFT_MESSAGE': ':userName left'
            }
	    }
	};
	var message_default_options = {
		"messageType" : 5,
		"type" : 0
	};

	$applozic.fn.applozic = function(appOptions, params) {
		var $mck_sidebox = $applozic('#mck-sidebox');
		if ($applozic.type(appOptions) === "object") {
			appOptions = $applozic.extend(true, {}, default_options, appOptions);
		}
		var oInstance = undefined;
		if (typeof ($mck_sidebox.data("applozic_instance")) !== "undefined") {
			oInstance = $mck_sidebox.data("applozic_instance");
			if ($applozic.type(appOptions) === "string") {
				switch (appOptions) {
				case "getLoggedInUser":
					return oInstance.getLoggedInUser();
					break;
				case "reInitialize":
					return oInstance.reInit(params);
					break;
				case "loadConvTab":
					oInstance.loadConvTab(params);
					break;
				case "loadTab":
					oInstance.loadTab(params);
					break;
				case "loadContextualTab":
					return oInstance.loadTabWithTopic(params);
					break;
				case "addWelcomeMessage":
					oInstance.addWelcomeMessage(params);
					break;
				case "loadContacts":
					oInstance.loadContacts(params);
					break;
				case "fetchContacts":
					oInstance.fetchContacts(params);
					break;
				case "getDateTime":
					 return oInstance.getDateAndTime(params);
					break;
				case "sendMessage":
					return oInstance.sendMessage(params);
					break;
				case 'sendGroupMessage':
          return oInstance.sendGroupMessage(params);
          break;
				case "createGroup":
					return oInstance.createGroup(params);
					break;
				case "loadBroadcastTab":
					params.groupName = (params.groupName) ? params.groupName : 'Broadcast';
					params.type = 5;
					return oInstance.initGroupTab(params);
					break;
				case "initBroadcastTab":
					params.groupName = (params.groupName) ? params.groupName : 'Broadcast';
					params.type = 5;
					return oInstance.initGroupTab(params);
					break;
				case "initGroupTab":
					return oInstance.initGroupTab(params);
					break;
				case "loadGroupTab":
					return oInstance.loadGroupTab(params);
					break;
				case "loadGroupTabByClientGroupId":
					return oInstance.loadGroupTabByClientGroupId(params);
					break;
				case 'setOffline':
					oInstance.setOffline();
					return "success";
					break;
				case 'setOnline':
					oInstance.setOffline();
					return 'success';
					break;
			     case 'logout':
                     oInstance.logout();
                     return 'success';
                     break;
				case "getUserDetail":
					oInstance.getUserStatus(params);
					return "success";
					break;
				case "getContactDetail":
					oInstance.getContactDetail(params);
					return "success";
					break;
				case "getContactImage":
					return oInstance.getContactImage(params);
					break;
				case "getGroup":
					return oInstance.getGroup(params);
					break;
				case "getGroupList":
					oInstance.getGroupList(params);
					return "success";
					break;
				case "leaveGroup":
					return oInstance.leaveGroup(params);
					break;
				case "addGroupMember":
					return oInstance.addGroupMember(params);
					break;
				case "removeGroupMember":
					return oInstance.removeGroupMember(params);
					break;
				case 'updateGroupInfo':
					return oInstance.updateGroupInfo(params);
					break;
				case "getMessages":
					oInstance.getMessages(params);
					break;
				case "messageList":
					return oInstance.getMessageList(params);
					break;
				case "getMessageListByTopicId":
					return oInstance.getMessageListByTopicId(params);
					break;
				case "subscribeToEvents":
					return oInstance.subscribeToEvents(params);
					break;
				case 'reset':
        	oInstance.reset(params);
         	break;
				}
			} else if ($applozic.type(appOptions) === "object") {
				oInstance.reInit(appOptions);
			}
		} else if ($applozic.type(appOptions) === "object") {
			if (appOptions.userId && appOptions.appId && $applozic.trim(appOptions.userId) !== "" && $applozic.trim(appOptions.appId) !== "") {
				if (typeof ($mck_sidebox.data("applozic_instance")) !== "undefined") {
					oInstance = $mck_sidebox.data("applozic_instance");
					oInstance.reInit(appOptions);
				} else {
					if (typeof appOptions.ojq !== 'undefined') {
						$ = appOptions.ojq;
						jQuery = appOptions.ojq;
					} else {
						$ = $applozic;
						jQuery = $applozic;
					}
					if (typeof appOptions.obsm === "function") {
						$.fn.modal = appOptions.obsm;
						jQuery.fn.modal = appOptions.obsm;
					} else if (typeof $applozic.fn.modal === 'function') {
						var oModal = $applozic.fn.modal.noConflict();
						$.fn.modal = oModal;
						jQuery.fn.modal = oModal;
					} else if (typeof $.fn.modal === 'function') {
						var oModal = $.fn.modal.noConflict();
						$.fn.modal = oModal;
						jQuery.fn.modal = oModal;
					}
					if (typeof appOptions.omckm === "function") {
						$applozic.fn.mckModal = appOptions.omckm;
					} else if (typeof $applozic.fn.mckModal === 'function') {
						$applozic.fn.mckModal = $applozic.fn.mckModal.noConflict();
					} else if (typeof $.fn.mckModal === 'function') {
						$applozic.fn.mckModal = $.fn.mckModal.noConflict();
					}
					if (typeof $.fn.linkify === 'function') {
						$applozic.fn.linkify = $.fn.linkify;
						jQuery.fn.linkify = $.fn.linkify;
					} else if (typeof $applozic.fn.linkify === 'function') {
						$.fn.linkify = $applozic.fn.linkify;
						jQuery.fn.linkify = $applozic.fn.linkify;
					}
					if (typeof $.fn.emojiarea === 'function') {
						$applozic.fn.emojiarea = $.fn.emojiarea;
					} else if (typeof $applozic.fn.emojiarea === 'function') {
						$.fn.emojiarea = $applozic.fn.emojiarea;
						jQuery.fn.emojiarea = $applozic.fn.emojiarea;
					}
					var applozic = new Applozic(appOptions);
					applozic.init();
					$mck_sidebox.data("applozic_instance", applozic);
				}
			} else {
				alert("Oops! looks like incorrect application id or user Id.");
			}
		}
	};
	$applozic.fn.applozic.defaults = default_options;
	function Applozic(appOptions) {
		var _this = this;
		var MCK_TOKEN;
		var AUTH_CODE;
		MCK_GROUP_MAP = [];
		var FILE_META = [];
		var USER_DEVICE_KEY;
		var USER_COUNTRY_CODE;
		var MCK_WEBSOCKET_URL;
		var IS_LOGGED_IN = true;
		var MCK_CONTACT_MAP = [];
		MCK_CLIENT_GROUP_MAP = [];
		var MCK_TYPING_STATUS = 0;
		var CONTACT_SYNCING = false;
		var MESSAGE_SYNCING = false;
		var MCK_USER_TIMEZONEOFFSET;
		var MCK_BLOCKED_TO_MAP = [];
		var MCK_BLOCKED_BY_MAP = [];
		var MCK_IDLE_TIME_LIMIT = 90;
		var MCK_USER_DETAIL_MAP = [];
		var MCK_TOPIC_DETAIL_MAP = [];
		var MCK_LAST_SEEN_AT_MAP = [];
		var MCK_CONVERSATION_MAP = [];
		var IS_MCK_TAB_FOCUSED = true;
		var MCK_TOTAL_UNREAD_COUNT = 0;
		var MCK_MODE = appOptions.mode;
    MCK_LABELS = appOptions.labels;
		var MCK_APP_ID = appOptions.appId;
		MCK_BASE_URL = appOptions.baseUrl;
		var MCK_CONNECTED_CLIENT_COUNT = 0;
		var MCK_TOPIC_CONVERSATION_MAP = [];
		var IS_MCK_USER_DEACTIVATED = false;
		var MCK_LAUNCHER = appOptions.launcher;
		var IS_MCK_VISITOR = appOptions.visitor;
		var MCK_USER_NAME = appOptions.userName;
		var IS_MCK_LOCSHARE = appOptions.locShare;
		var MCK_FILE_URL = appOptions.fileBaseUrl;
		var AUTHENTICATION_TYPE_ID_MAP = [ 0, 1, 2 ];
		var MCK_ON_PLUGIN_INIT = appOptions.onInit;
		var MCK_ON_PLUGIN_CLOSE = appOptions.onClose;
		var MCK_DISPLAY_TEXT = appOptions.displayText;
		var MCK_ACCESS_TOKEN = appOptions.accessToken;
		var MCK_CALLBACK = appOptions.readConversation;
		var MCK_GROUPMAXSIZE = appOptions.maxGroupSize;
		var MCK_ON_TAB_CLICKED = appOptions.onTabClicked;
		var MCK_CONTACT_NUMBER = appOptions.contactNumber;
		var MCK_FILEMAXSIZE = appOptions.maxAttachmentSize;
		var MCK_APP_MODULE_NAME = appOptions.appModuleName;
		var MCK_GETTOPICDETAIL = appOptions.getTopicDetail;
		var MCK_GETUSERNAME = appOptions.contactDisplayName;
		var MCK_MSG_VALIDATION = appOptions.validateMessage;
		var MCK_PRICE_DETAIL = appOptions.finalPriceResponse;
		var MCK_GETUSERIMAGE = appOptions.contactDisplayImage;
		var MCK_PRICE_WIDGET_ENABLED = appOptions.priceWidget;
		var MCK_INIT_AUTO_SUGGESTION = appOptions.initAutoSuggestions;
		var MCK_AUTHENTICATION_TYPE_ID = appOptions.authenticationTypeId;
		var MCK_GETCONVERSATIONDETAIL = appOptions.getConversationDetail;
		var MCK_NOTIFICATION_ICON_LINK = appOptions.notificationIconLink;
		var IS_SW_NOTIFICATION_ENABLED = (typeof appOptions.swNotification === "boolean") ? appOptions.swNotification : false;
		var MCK_SOURCE = (typeof appOptions.source === 'undefined') ? 1 : appOptions.source;
		var MCK_USER_ID = (IS_MCK_VISITOR) ? "guest" : $applozic.trim(appOptions.userId);
		var MCK_GOOGLE_API_KEY = (IS_MCK_LOCSHARE) ? appOptions.googleApiKey : "NO_ACCESS";
		var IS_MCK_TOPIC_BOX = (typeof appOptions.topicBox === "boolean") ? (appOptions.topicBox) : false;
		var IS_MCK_OL_STATUS = (typeof appOptions.olStatus === "boolean") ? (appOptions.olStatus) : false;
		var MESSAGE_BUBBLE_AVATOR_ENABLED = (typeof appOptions.messageBubbleAvator === "boolean") ? (appOptions.messageBubbleAvator) : false;
		var IS_MCK_TOPIC_HEADER = (typeof appOptions.topicHeader === "boolean") ? (appOptions.topicHeader) : false;
		var MCK_SUPPORT_ID_DATA_ATTR = (appOptions.supportId) ? ('data-mck-id="' + appOptions.supportId + '"') : '';
		var IS_NOTIFICATION_ENABLED = (typeof appOptions.notification === "boolean") ? appOptions.notification : true;
		var IS_MCK_OWN_CONTACTS = (typeof appOptions.loadOwnContacts === "boolean") ? (appOptions.loadOwnContacts) : false;
		var IS_MCK_NOTIFICATION = (typeof appOptions.desktopNotification === "boolean") ? appOptions.desktopNotification : false;
		var IS_AUTO_TYPE_SEARCH_ENABLED = (typeof appOptions.autoTypeSearchEnabled === "boolean") ? appOptions.autoTypeSearchEnabled : true;
		var MCK_CHECK_USER_BUSY_STATUS = (typeof appOptions.checkUserBusyWithStatus === "boolean") ? (appOptions.checkUserBusyWithStatus) : false;
		var IS_LAUNCH_ON_UNREAD_MESSAGE_ENABLED = (typeof appOptions.launchOnUnreadMessage === "boolean") ? appOptions.launchOnUnreadMessage : false;
		var CONVERSATION_STATUS_MAP = [ "DEFAULT", "NEW", "OPEN" ];
		var GROUP_ROLE_MAP = [0, 1, 2, 3];
		var GROUP_TYPE_MAP = [ 1, 2, 5, 6 ];
		var BLOCK_STATUS_MAP = [ "BLOCKED_TO", "BLOCKED_BY", "UNBLOCKED_TO", "UNBLOCKED_BY" ];
		var mckStorage = new MckStorage();
		var TAB_FILE_DRAFT = new Object();
		var MCK_CONTACT_ARRAY = new Array();
		var MCK_GROUP_ARRAY = new Array();
		var TAB_MESSAGE_DRAFT = new Object();
		var MCK_CONTACT_NAME_MAP = new Array();
		var MCK_UNREAD_COUNT_MAP = new Array();
		var MCK_CHAT_CONTACT_ARRAY = new Array();
		var MCK_GROUP_SEARCH_ARRAY = new Array();
		var MCK_TAB_CONVERSATION_MAP = new Array();
		var mckInit = new MckInit();
		var mckMapLayout = new MckMapLayout();
		var mckUserUtils = new MckUserUtils();
		var mckMapService = new MckMapService();
		var mckGroupLayout = new MckGroupLayout();
		var mckFileService = new MckFileService();
		var mckMessageLayout = new MckMessageLayout();
		var mckMessageService = new MckMessageService();
		var mckContactService = new MckContactService();
		var mckNotificationService = new MckNotificationService();
		var $mckChatLauncherIcon = $applozic(".chat-launcher-icon");
		w.MCK_OL_MAP = new Array();
		_this.events = {
			'onConnectFailed' : function() {},
			'onConnect' : function() {},
			'onMessageDelivered' : function() {},
			'onMessageRead' : function() {},
			'onMessageDeleted' : function() {},
			'onConversationDeleted' : function() {},
			'onUserConnect' : function() {},
			'onUserDisconnect' : function() {},
			'onConversationReadFromOtherSource' : function() {},
			'onConversationRead' : function() {},
			'onMessageReceived' : function() {},
			'onMessageSentUpdate' : function() {},
			'onMessageSent' : function() {},
			'onUserBlocked' : function() {},
			'onUserUnblocked' : function() {},
			'onUserActivated' : function() {},
			'onUserDeactivated' : function() {}
		};
		var mckInitializeChannel = new MckInitializeChannel(_this);
		_this.getOptions = function() {
			return appOptions;
		};
		_this.init = function() {
			mckMessageService.init();
			mckFileService.init();
			mckInit.initializeApp(appOptions, false);
			mckNotificationService.init();
			mckMapLayout.init();
			mckMessageLayout.initEmojis();
		};
		_this.getLoggedInUser = function() {
			return MCK_USER_ID;
		};
		_this.reInit = function(optns) {
			if ($applozic.type(optns) === 'object') {
				optns = $applozic.extend(true, {}, default_options, optns);
			} else {
				return;
			}
			$applozic.fn.applozic("reset",optns);
			if (optns.userId && optns.appId && $applozic.trim(optns.userId) !== "" && $applozic.trim(optns.appId) !== "") {
				mckInit.initializeApp(optns, true);
				appOptions = optns;
			} else {
				w.console("Oops! looks like incorrect application id or user Id.");
				return;
			}
		};
		_this.loadTab = function(tabId) {
			mckMessageLayout.loadTab({
				'tabId' : tabId,
				'isGroup' : false,
				isSearch : true
			});
			$applozic("#mck-search").val("");
		};
         _this.getDateAndTime = function(params) {
			  return mckDateUtils.getDate(params);
             }

		_this.loadGroupTab = function(tabId) {
			if (typeof tabId === 'undefined' || tabId === "") {
				return "Group Id Required";
			}
			var group = mckGroupUtils.getGroup(tabId);
			if (typeof group === 'object') {
				mckMessageLayout.loadTab({
					tabId : tabId,
					'isGroup' : true,
					isSearch : true
				});
				$applozic("#mck-search").val("");
			} else {
				mckGroupService.getGroupFeed({
					'groupId' : tabId,
					'apzCallback' : mckGroupLayout.onGroupFeed,
					'callback' : mckGroupLayout.loadGroupTab
				});
			}
		};
		_this.loadGroupTabByClientGroupId = function(params) {
			if ( (typeof params.clientGroupId === 'undefined' || params.clientGroupId === "") ) {
				return "Client Group Id Required";
			}
			var group = mckGroupUtils.getGroupByClientGroupId(params.clientGroupId);
			if (typeof group === 'object') {
				mckMessageLayout.loadTab({
					tabId : group.contactId,
					'isGroup' : true,
					isSearch : true
				});
				$applozic("#mck-search").val("");
			} else {
				mckGroupService.getGroupFeed({
					'clientGroupId' : params.clientGroupId,
					'apzCallback' : mckGroupLayout.onGroupFeed,
					'callback' : mckGroupLayout.loadGroupTab
				});
			}
		};
		_this.loadConvTab = function(optns) {
			if (typeof optns === 'object' && optns.userId && optns.convId) {
				mckMessageLayout.loadTab({
					tabId : optns.userId,
					conversationId : optns.convId,
					'isGroup' : false,
					isSearch : true
				});
			}
		};
		_this.loadTabWithTopic = function(optns) {
			if (typeof optns === 'object' && optns.userId && optns.topicId) {
				var params = {
					'tabId' : optns.userId,
					'topicId' : optns.topicId
				}
				if (optns.userName) {
					params.userName = optns.userName;
				}
				if (optns.topicStatus) {
					params.topicStatus = (CONVERSATION_STATUS_MAP.indexOf(optns.topicStatus) === -1) ? CONVERSATION_STATUS_MAP[0] : optns.topicStatus.toString();
				} else {
					params.topicStatus = CONVERSATION_STATUS_MAP[0];
				}
				if (typeof (MCK_GETTOPICDETAIL) === "function") {
					var topicDetail = MCK_GETTOPICDETAIL(optns.topicId);
					if (typeof topicDetail === 'object' && topicDetail.title !== 'undefined') {
						MCK_TOPIC_DETAIL_MAP[optns.topicId] = topicDetail;
					}
				}
				if (optns.message) {
					var messagePxy = {
						"type" : 5,
						"contentType" : 0,
						"message" : message
					};
					params.messagePxy = messagePxy;
					params.isMessage = true;
				} else {
					params.isMessage = false;
				}
				if (optns.supportId) {
					params.isGroup = true;
					params.supportId = supportId;
				} else {
					params.isGroup = false;
				}
				params.isSearch = true;
				mckMessageService.getConversationId(params);
			} else {
				if (!optns.userId) {
					return 'UserId required';
				} else if (!optns.topicId) {
					return 'TopicId required';
				}
			}
		};
		_this.fetchContacts = function(params) {
			mckContactService.fetchContacts(params);
		};
		_this.loadContacts = function(contacts) {
			mckMessageLayout.loadContacts(contacts);
		};
		_this.setOffline = function() {
			if (typeof mckInitializeChannel !== 'undefined') {
				mckInitializeChannel.sendStatus(0);
			}
		};

		_this.reset = function(optns) {
			w.sessionStorage.clear();
        MCK_TOKEN = '';
        AUTH_CODE = '';
        FILE_META = [];
        MCK_GROUP_MAP = [];
        IS_LOGGED_IN = true;
        MCK_CONTACT_MAP = [];
        USER_DEVICE_KEY = '';
        MCK_MODE = optns.mode;
        USER_COUNTRY_CODE = '';
        MCK_BLOCKED_TO_MAP = [];
        MCK_BLOCKED_BY_MAP = [];
        CONTACT_SYNCING = false;
        MESSAGE_SYNCING = false;
        MCK_IDLE_TIME_LIMIT = 90;
        MCK_APP_ID = optns.appId;
        MCK_LAST_SEEN_AT_MAP = [];
        MCK_CONVERSATION_MAP = [];
        MCK_TOPIC_DETAIL_MAP = [];
        MCK_CLIENT_GROUP_MAP = [];
        IS_MCK_TAB_FOCUSED = true;
        MCK_LABELS = optns.labels;
        MCK_TOTAL_UNREAD_COUNT = 0;
        MCK_BASE_URL = optns.baseUrl;
        TAB_FILE_DRAFT = new Object();
        MCK_GROUP_ARRAY = new Array();
        MCK_LAUNCHER = optns.launcher;
        MCK_CONNECTED_CLIENT_COUNT = 0;
        MCK_USER_NAME = optns.userName;
        IS_MCK_VISITOR = optns.visitor;
        MCK_TOPIC_CONVERSATION_MAP = [];
        MCK_CONTACT_ARRAY = new Array();
        TAB_MESSAGE_DRAFT = new Object();
        MCK_FILE_URL = optns.fileBaseUrl;
        IS_MCK_LOCSHARE = optns.locShare;
        MCK_ON_PLUGIN_INIT = optns.onInit;
        MCK_CONTACT_NAME_MAP = new Array();
        MCK_UNREAD_COUNT_MAP = new Array();
        MCK_ON_PLUGIN_CLOSE = optns.onClose;
        MCK_ACCESS_TOKEN = optns.accessToken;
        MCK_DISPLAY_TEXT = optns.displayText;
        MCK_CALLBACK = optns.readConversation;
        MCK_GROUPMAXSIZE = optns.maxGroupSize;
        MCK_TAB_CONVERSATION_MAP = new Array();
        MCK_ON_TAB_CLICKED = optns.onTabClicked;
        MCK_CONTACT_NUMBER = optns.contactNumber;
        MCK_APP_MODULE_NAME = optns.appModuleName;
        MCK_GETTOPICDETAIL = optns.getTopicDetail;
        MCK_FILEMAXSIZE = optns.maxAttachmentSize;
        MCK_MSG_VALIDATION = optns.validateMessage;
        MCK_GETUSERNAME = optns.contactDisplayName;
        MCK_PRICE_DETAIL = optns.finalPriceResponse;
        MCK_GETUSERIMAGE = optns.contactDisplayImage;
        MCK_PRICE_WIDGET_ENABLED = optns.priceWidget;
        MCK_INIT_AUTO_SUGGESTION = optns.initAutoSuggestions;
        MCK_GETCONVERSATIONDETAIL = optns.getConversationDetail;
        MCK_AUTHENTICATION_TYPE_ID = optns.authenticationTypeId;
        MCK_USER_ID = (IS_MCK_VISITOR) ? 'guest' : $applozic.trim(optns.userId);
        MCK_GOOGLE_API_KEY = (IS_MCK_LOCSHARE) ? optns.googleApiKey : "NO_ACCESS";
        IS_MCK_OL_STATUS = (typeof optns.olStatus === 'boolean') ? (optns.olStatus) : false;
        IS_MCK_TOPIC_BOX = (typeof optns.topicBox === 'boolean') ? (optns.topicBox) : false;
        IS_MCK_TOPIC_HEADER = (typeof optns.topicHeader === 'boolean') ? (optns.topicHeader) : false;
        IS_NOTIFICATION_ENABLED = (typeof optns.notification === 'boolean') ? optns.notification : true;
        IS_SW_NOTIFICATION_ENABLED = (typeof optns.swNotification === "boolean") ? optns.swNotification : false;
        MCK_SUPPORT_ID_DATA_ATTR = (optns.supportId) ? ('data-mck-id="' + optns.supportId + '"') : '';
        IS_MCK_NOTIFICATION = (typeof optns.desktopNotification === "boolean") ? optns.desktopNotification : false;
        IS_MCK_OWN_CONTACTS = (typeof optns.loadOwnContacts === 'boolean') ? (optns.loadOwnContacts) : false;
        MESSAGE_BUBBLE_AVATOR_ENABLED = (typeof optns.messageBubbleAvator === "boolean") ? (optns.messageBubbleAvator) : false;
        IS_AUTO_TYPE_SEARCH_ENABLED = (typeof optns.autoTypeSearchEnabled === "boolean") ? optns.autoTypeSearchEnabled : true;
        MCK_CHECK_USER_BUSY_STATUS = (typeof optns.checkUserBusyWithStatus === "boolean") ? (optns.checkUserBusyWithStatus) : false;
        IS_LAUNCH_ON_UNREAD_MESSAGE_ENABLED = (typeof optns.launchOnUnreadMessage === "boolean") ? optns.launchOnUnreadMessage : false;
			}
			 _this.logout = function() {
	            if (typeof mckInitializeChannel !== 'undefined') {
	              mckInitializeChannel.disconnect();
								mckStorage.clearMckMessageArray();
                 appOptions.appId='';
                 appOptions.accessToken='';
								 appOptions.userId='';
                 $applozic.fn.applozic("reset",appOptions);
                 //$applozic(".mck-container").hide();
                 $applozic(".mck-contacts-inner").empty();
	            }
	            IS_LOGGED_IN = false;
	     };
		_this.setOnline = function() {
			if (typeof mckInitializeChannel !== 'undefined') {
				mckInitializeChannel.sendStatus(1);
			}
		};
		_this.getUserStatus = function(params) {
			if (typeof params.callback === 'function') {
				mckContactService.getUserStatus(params);
			}
		};
		_this.getContactDetail = function(params) {
			if (typeof params.callback == 'function') {
				params.callback(mckUserUtils.getUserDetail(params.userId));
			}
		};
		_this.getContactImage = function(user) {
			var contact = mckMessageLayout.fetchContact(user.userId);
			var displayName = mckMessageLayout.getTabDisplayName(contact.contactId, false);
			return mckMessageLayout.getContactImageLink(contact, displayName);
		};
		_this.getGroup = function(params) {
			if (typeof params.callback === 'function') {
				var group = mckGroupLayout.getGroup(params.groupId);
				params.callback(group);
				return "success";
			} else {
				return "Callback Function Required";
			}
		};
		_this.getGroupList = function(params) {
			if (typeof params.callback === 'function') {
				params.apzCallback = mckGroupLayout.loadGroups;
				mckGroupService.loadGroups(params);
				return "success";
			} else {
				return "Callback Function Required";
			}
		};
		_this.leaveGroup = function(params) {
			if (typeof params !== 'object') {
				return "Unsupported Format. Please check format";
			}
			if (typeof params.callback === 'function') {
				if ((typeof params.groupId === 'undefined' || params.groupId === "") && (typeof params.clientGroupId === 'undefined' || params.clientGroupId === "")) {
					params.callback({
						'status' : 'error',
						'errorMessage' : 'GroupId or Client GroupId Required'
					});
					return;
				}
				params.apzCallback = mckGroupLayout.onGroupLeft;
				mckGroupService.leaveGroup(params);
				return "success";
			} else {
				return "Callback Function Required";
			}
		};
		_this.addGroupMember = function(params) {
			if (typeof params !== 'object') {
				return "Unsupported Format. Please check format";
			}
			if (typeof params.callback === 'function') {
				if ((typeof params.groupId === 'undefined' || params.groupId === "") && (typeof params.clientGroupId === 'undefined' || params.clientGroupId === "")) {
					params.callback({
						'status' : 'error',
						'errorMessage' : 'GroupId or Client GroupId Required'
					});
					return;
				}
				if (typeof params.userId === 'undefined' || params.userId === "") {
					params.callback({
						'status' : 'error',
						'errorMessage' : 'User Id Required'
					});
					return;
				}
				params.apzCallback = mckGroupLayout.onAddedGroupMember;
				mckGroupService.addGroupMember(params);
				return "success";
			} else {
				return "Callback Function Required";
			}
		};
		_this.removeGroupMember = function(params) {
			if (typeof params !== 'object') {
				return "Unsupported Format. Please check format";
			}
			if (typeof params.callback === 'function') {
				if ((typeof params.groupId === 'undefined' || params.groupId === "") && (typeof params.clientGroupId === 'undefined' || params.clientGroupId === "")) {
					params.callback({
						'status' : 'error',
						'errorMessage' : 'GroupId or Client GroupId Required'
					});
					return;
				}
				if (typeof params.userId === 'undefined' || params.userId === "") {
					params.callback({
						'status' : 'error',
						'errorMessage' : 'User Id Required'
					});
					return;
				}
				params.apzCallback = mckGroupLayout.onRemovedGroupMember;
				mckGroupService.removeGroupMember(params);
				return "success";
			} else {
				return "Callback Function Required";
			}
		};
		_this.updateGroupInfo = function(params) {
	  	if (typeof params !== 'object') {
	        return 'Unsupported format. Please check format';
	    }
	    if (typeof params.callback === 'function') {
		  	if ((typeof params.groupId === 'undefined' || params.groupId === '') && (typeof params.clientGroupId === 'undefined' || params.clientGroupId === '')) {
					params.callback({
							'status': 'error',
							'errorMessage': 'GroupId or clientGroupId required'
						});
						return;
					}
					/*if ((typeof params.name === 'undefined' || params.name === '') && (typeof params.imageUrl === 'undefined' || params.imageUrl === '') && (!params.users || params.users.length === 0)) {
						params.callback({
													 'status': 'error',
													 'errorMessage': 'Group properties required'
						});
						return;
					}*/
					if (params.users && params.users.length > 0) {
						var users = [];
						$applozic.each(params.users, function(i, user) {
							if (user.userId && (typeof user.role !== 'undefined') && GROUP_ROLE_MAP.indexOf(user.role) !== -1) {
								users.push(user);
							}
						});
						if (users.length === 0) {
							params.callback({
															 'status': 'error',
															 'errorMessage': 'Incorrect users detail'
							});
							return;
						}
					}
					/*
					//Todo: Check if UI dependency is required
					var users = [];
					$applozic('.mck-group-change-role-box.vis').each(function(i, elm) {
						var $this = $applozic(this);
						var newRole = parseInt($this.find('select').val());
						var role = $this.parents('.mck-li-group-member').data('role');
						if (newRole !== role) {
							var user = {
															 userId: $this.parents('.mck-li-group-member').data('mck-id'),
															 role: newRole
													 }
							users.push(user);
						}
					});*/
					params.apzCallback = mckGroupLayout.onUpdateGroupInfo;
					mckGroupService.updateGroupInfo(params);
						return 'success';
					} else {
						return 'Callback function required';
					}
	  };
		_this.getMessages = function(params) {
			if (typeof params.callback === 'function') {
				mckMessageService.getMessages(params);
			}
		};
		_this.getMessageList = function(params) {
			if (typeof params === 'object' && typeof params.callback === 'function') {
				mckMessageService.getMessageList(params);
				return "success";
			} else {
				return "Callback function required.";
			}
		};
		_this.getMessageListByTopicId = function(params) {
			if (typeof params === 'object') {
				if (typeof params.callback === 'function') {
					if ((typeof params.id === 'undefined' || params.id === "") && (typeof params.clientGroupId === 'undefined' || params.clientGroupId === "")) {
						params.callback({
							'status' : 'error',
							'errorMessage' : "Id or Client GroupId required"
						});
						return;
					}
					if (params.id && typeof params.isGroup !== 'boolean') {
						params.callback({
							'status' : 'error',
							'errorMessage' : 'IsGroup parameter required'
						});
						return;
					}
					if (!params.topicId) {
						params.callback({
							'status' : 'error',
							'errorMessage' : 'TopicId required'
						});
						return;
					}
					if (params.id) {
						params.tabId = params.id;
					}
					params.topicStatus = CONVERSATION_STATUS_MAP[0];
					var conversationId = MCK_TOPIC_CONVERSATION_MAP[params.topicId];
					if (conversationId && typeof MCK_CONVERSATION_MAP[conversationId] === 'object') {
						params.conversationId = conversationId;
						mckMessageService.getMessageList(params);
					} else {
						params.isExtMessageList = true;
						params.pageSize = 1;
						mckMessageService.fetchConversationByTopicId(params);
					}
					return "success";
				} else {
					return "Callback function required.";
				}
			} else {
				return "Unsupported Format. Please check format";
			}
		};
		_this.sendMessage = function(params) {
			if (typeof params === "object") {
				params = $applozic.extend(true, {}, message_default_options, params);
				var to = params.to;
				var message = params.message;
				if (typeof to === 'undefined' || to === "") {
					return "To Field Required";
				}
				if (typeof message === 'undefined' || message === "") {
					return "Message Field Required";
				}
				if (params.type > 12) {
					return "Incorrect Message Type";
				}
				message = $applozic.trim(message);
				var messagePxy = {
					"to" : to,
					"type" : params.messageType,
					"contentType" : params.type,
					"message" : message
				};
				mckMessageService.sendMessage(messagePxy);
				return "success";
			} else {
				return "Unsupported Format. Please check format";
			}
		};

    _this.sendGroupMessage = function(params) {
        if (typeof params === 'object') {
            params = $applozic.extend(true, {}, message_default_options, params);
            var message = params.message;
            if (!params.groupId && !params.clientGroupId) {
                return 'groupId or clientGroupId required';
            }
            if (typeof message === 'undefined' || message === '') {
                return 'message field required';
            }
            if (params.type > 12) {
                return 'invalid message type';
            }
            message = $applozic.trim(message);
            var messagePxy = {
                'type': params.messageType,
                'contentType': params.type,
                'message': message
            };
            if (params.groupId) {
                messagePxy.groupId = $applozic.trim(params.groupId);
            } else if (params.clientGroupId) {
                var group = mckGroupUtils.getGroupByClientGroupId(params.clientGroupId);
                if (typeof group === 'undefined') {
                    return 'group not found';
                }
                messagePxy.clientGroupId = $applozic.trim(params.clientGroupId);
            }
            mckMessageService.sendMessage(messagePxy);
            return 'success';
        } else {
            return 'Unsupported format. Please check format';
        }
    };
		_this.addWelcomeMessage = function(params) {
			if (typeof params === "object") {
				if (typeof params.sender === 'undefined' || params.sender === "") {
					return "Sender Field Required";
				}
				if (typeof params.messageContent === 'undefined' || params.messageContent === "") {
					return "Message Content Required";
				}
				mckMessageService.sendWelcomeMessage(params);
			} else {
				return "Unsupported Format. Please check format";
			}
		};
		_this.createGroup = function(params) {
			if (typeof params === "object") {
				if (typeof params.callback === 'function') {
					var users = params.users;
					if (typeof users === 'undefined' || users.length < 1) {
						params.callback({
							'status' : 'error',
							'errorMessage' : 'Users List Required'
						});
						return;
					}
					if (users.length > MCK_GROUPMAXSIZE) {
						params.callback({
							'status' : 'error',
							'errorMessage' : "Users limit exceeds " + MCK_GROUPMAXSIZE + ". Max number of users allowed is " + MCK_GROUPMAXSIZE + "."
						});
						return;
					}
					if (!params.groupName) {
						params.callback({
							'status' : 'error',
							'errorMessage' : "Group Name Required"
						});
						return;
					}
					if (!params.type) {
						params.callback({
							'status' : 'error',
							'errorMessage' : "Group Type Required"
						});
						return;
					}
					if (GROUP_TYPE_MAP.indexOf(params.type) === -1) {
						params.callback({
							'status' : 'error',
							'errorMessage' : "Invalid Group Type"
						});
						return;
					}
					mckMessageService.getGroup(params);
					return "success";
				} else {
					return 'Callback Function Required';
				}
			} else {
				return "Unsupported Format. Please check format";
			}
		};
		_this.initGroupTab = function(params) {
			if (typeof params === "object") {
				var users = params.users;
				if (typeof users === 'undefined' || users.length < 1) {
					return "Users List Required";
				}
				if (users.length > MCK_GROUPMAXSIZE) {
					return "Users limit exceeds " + MCK_GROUPMAXSIZE + ". Max number of users allowed is " + MCK_GROUPMAXSIZE + ".";
				}
				if (!params.groupName) {
					return "Group Name Required";
				}
				if (!params.type) {
					return "Group Type Required";
				}
				if (GROUP_TYPE_MAP.indexOf(params.type) === -1) {
					return "Invalid Group Type";
				}
				mckMessageService.getGroup(params);
				return "success";
			} else {
				return "Unsupported Format. Please check format";
			}
		};
		_this.subscribeToEvents = function(events) {
			if (typeof events === 'object') {
				if (typeof events.onConnectFailed === 'function') {
					_this.events.onConnectFailed = events.onConnectFailed;
				}
				if (typeof events.onConnect === 'function') {
					_this.events.onConnect = events.onConnect;
				}
				if (typeof events.onMessageDelivered === 'function') {
					_this.events.onMessageDelivered = events.onMessageDelivered;
				}
				if (typeof events.onMessageRead === 'function') {
					_this.events.onMessageRead = events.onMessageRead;
				}
				if (typeof events.onMessageDeleted === 'function') {
					_this.events.onMessageDeleted = events.onMessageDeleted;
				}
				if (typeof events.onConversationDeleted === 'function') {
					_this.events.onConversationDeleted = events.onConversationDeleted;
				}
				if (typeof events.onUserConnect === 'function') {
					_this.events.onUserConnect = events.onUserConnect;
				}
				if (typeof events.onUserDisconnect === 'function') {
					_this.events.onUserDisconnect = events.onUserDisconnect;
				}
				if (typeof events.onConversationReadFromOtherSource === 'function') {
					_this.events.onConversationReadFromOtherSource = events.onConversationReadFromOtherSource;
				}
				if (typeof events.onConversationRead === 'function') {
					_this.events.onConversationRead = events.onConversationRead;
				}
				if (typeof events.onMessageReceived === 'function') {
					_this.events.onMessageReceived = events.onMessageReceived;
				}
				if (typeof events.onMessageSentUpdate === 'function') {
					_this.events.onMessageSentUpdate = events.onMessageSentUpdate;
				}
				if (typeof events.onMessageSent === 'function') {
					_this.events.onMessageSent = events.onMessageSent;
				}
				if (typeof events.onUserBlocked === 'function') {
					_this.events.onUserBlocked = events.onUserBlocked;
				}
				if (typeof events.onUserUnblocked === 'function') {
					_this.events.onUserUnblocked = events.onUserUnblocked;
				}
				if (typeof events.onUserActivated === 'function') {
					_this.events.onUserActivated = events.onUserActivated;
				}
				if (typeof events.onUserDeactivated === 'function') {
					_this.events.onUserDeactivated = events.onUserDeactivated;
				}
			}
			;
		};
		function MckInit() {
			var _this = this;
			var refreshIntervalId;
			var $mck_user_icon = $applozic("#mck-user-icon");
			var $mck_file_menu = $applozic("#mck-file-menu");
			var MCK_IDLE_TIME_COUNTER = MCK_IDLE_TIME_LIMIT;
			var INITIALIZE_APP_URL = "/v2/tab/initialize.page";
			_this.getLauncherHtml = function() {
				return '<div id="mck-msg-preview" class="mck-msg-preview applozic-launcher">' + '<div class="mck-row">' + '<div class="blk-lg-3 mck-preview-icon"></div>' + '<div class="blk-lg-9">' + '<div class="mck-row mck-truncate mck-preview-content">' + '<strong class="mck-preview-cont-name"></strong></div>' + '<div class="mck-row mck-preview-content">' + '<div class="mck-preview-msg-content"></div>' + '<div class="mck-preview-file-content mck-msg-text notranslate blk-lg-12 mck-attachment n-vis"></div>' + '</div></div></div></div>';
			};
			_this.initializeApp = function(optns, isReInit) {
				var userPxy = {
					'applicationId' : optns.appId,
					'userId' : MCK_USER_ID
				};
				if (MCK_USER_NAME !== null) {
					userPxy.displayName = optns.userName;
				}
				if (optns.email !== null) {
					userPxy.email = optns.email;
				}
				if (MCK_CONTACT_NUMBER !== null) {
					userPxy.contactNumber = optns.contactNumber;
				}
				if (optns.imageLink) {
					userPxy.imageLink = optns.imageLink;
				}
				if (optns.appModuleName) {
					userPxy.appModuleName = optns.appModuleName;
				}
				if (MCK_ACCESS_TOKEN) {
					userPxy.password = optns.accessToken;
				}
				if (AUTHENTICATION_TYPE_ID_MAP.indexOf(MCK_AUTHENTICATION_TYPE_ID) === -1) {
					MCK_AUTHENTICATION_TYPE_ID = 0;
				}
				if (MCK_CHECK_USER_BUSY_STATUS) {
					userPxy.resetUserStatus = true;
				}
			    userPxy.appVersionCode = 108;
				userPxy.authenticationTypeId = MCK_AUTHENTICATION_TYPE_ID;
				AUTH_CODE = '';
				USER_DEVICE_KEY = '';
				$applozic.ajax({
					url : MCK_BASE_URL + INITIALIZE_APP_URL,
					type : 'post',
					data : w.JSON.stringify(userPxy),
					contentType : 'application/json',
					headers : {
						'Application-Key' : MCK_APP_ID
					},
					success : function(result) {
						mckStorage.clearMckMessageArray();
						if (result === 'INVALID_PASSWORD') {
							if (typeof MCK_ON_PLUGIN_INIT === 'function') {
								MCK_ON_PLUGIN_INIT({
									'status' : 'error',
									'errorMessage' : 'INVALID PASSWORD'
								});
							}
							return;
						} else if (result === 'INVALID_APPID') {
							if (typeof MCK_ON_PLUGIN_INIT === 'function') {
								MCK_ON_PLUGIN_INIT({
									'status' : 'error',
									'errorMessage' : 'INVALID APPLICATION ID'
								});
							}
							return;
						} else if (result === 'error' || result === 'USER_NOT_FOUND') {
							if (typeof MCK_ON_PLUGIN_INIT === 'function') {
								MCK_ON_PLUGIN_INIT({
									'status' : 'error',
									'errorMessage' : 'USER NOT FOUND'
								});
							}
							return;
						} else if (result === 'APPMODULE_NOT_FOUND') {
							if (typeof MCK_ON_PLUGIN_INIT === 'function') {
								MCK_ON_PLUGIN_INIT({
									'status' : 'error',
									'errorMessage' : 'APPMODULE NOT FOUND'
								});
							}
							return;
						}
						if (typeof result === 'object' && result !== null && result.token) {
							if (optns.imageLink) {
								$mck_user_icon.html('<img src=" ' + optns.imageLink + '" />');
								$mck_user_icon.parents('.mck-box-top').removeClass('mck-wt-user-icon');
							}
							$applozic('.applozic-launcher').each(function() {
								if (!$applozic(this).hasClass("mck-msg-preview")) {
									$applozic(this).show();
								}
							});
							MCK_TOKEN = result.token;
							MCK_USER_ID = result.userId;
							MCK_FILE_URL = result.fileBaseUrl;
							USER_DEVICE_KEY = result.deviceKey;
							USER_COUNTRY_CODE = result.countryCode;
							MCK_WEBSOCKET_URL = result.websocketUrl;
							IS_MCK_USER_DEACTIVATED = result.deactivated;
							MCK_USER_TIMEZONEOFFSET = result.timeZoneOffset;
							MCK_IDLE_TIME_LIMIT = result.websocketIdleTimeLimit;
							AUTH_CODE = btoa(result.userId + ':' + result.deviceKey);
							MCK_CONNECTED_CLIENT_COUNT = result.connectedClientCount;
							mckMessageLayout.createContactWithDetail({
								'userId' : MCK_USER_ID,
								'displayName' : result.displayName,
								'photoLink' : result.imageLink
							});
							$applozic.ajaxPrefilter(function(options) {
								if (options.url.indexOf(MCK_BASE_URL) !== -1) {
									// _this.manageIdleTime();
									options.beforeSend = function(jqXHR) {
										_this.setHeaders(jqXHR);
									};
								}
							});
							_this.appendLauncher();
							if (result.betaPackage) {
								var poweredByUrl = "https://www.applozic.com/?utm_source=" + w.location.href + "&utm_medium=webplugin&utm_campaign=poweredby";
								$applozic(".mck-running-on a").attr('href', poweredByUrl);
								$applozic(".mck-running-on").removeClass('n-vis').addClass('vis');
							}
							if (!IS_MCK_VISITOR && MCK_USER_ID !== 'guest' && MCK_USER_ID !== '0' && MCK_USER_ID !== 'C0') {
								(isReInit) ? mckInitializeChannel.reconnect() : mckInitializeChannel.init();
							// mckGroupService.loadGroups();
							}
							mckMessageLayout.loadTab({
								tabId : '',
								'isGroup' : false
							});
							var mckContactNameArray = mckStorage.getMckContactNameArray();
							if (mckContactNameArray !== null && mckContactNameArray.length > 0) {
								for (var i = 0; i < mckContactNameArray.length; i++) {
									var nameMap = mckContactNameArray[i];
									if (nameMap !== null) {
										MCK_CONTACT_NAME_MAP[nameMap[0]] = nameMap[1];
									}
								}
							}
							mckUserUtils.checkUserConnectedStatus();
							if (typeof MCK_INIT_AUTO_SUGGESTION === 'function') {
								MCK_INIT_AUTO_SUGGESTION();
							}
							if (typeof MCK_ON_PLUGIN_INIT === 'function') {
								MCK_ON_PLUGIN_INIT({
									'status' : 'success'
								});
							}
							mckInit.tabFocused();
							if (IS_LAUNCH_ON_UNREAD_MESSAGE_ENABLED || $mckChatLauncherIcon.length > 0) {
								mckContactService.getUserStatus({
									'callback' : mckMessageLayout.updateUnreadCountonChatIcon
								});
							}
							mckGroupService.loadGroups({
								apzCallback : mckGroupLayout.loadGroups
							});
						// mckUtils.manageIdleTime();
						} else {
							if (typeof MCK_ON_PLUGIN_INIT === 'function') {
								MCK_ON_PLUGIN_INIT({
									'status' : 'error',
									'errorMessage' : 'UNABLE TO PROCESS REQUEST'
								});
							}
						}
					},
					error : function() {
						mckStorage.clearMckMessageArray();
						if (typeof MCK_ON_PLUGIN_INIT === "function") {
							MCK_ON_PLUGIN_INIT({
								'status' : 'error',
								'errorMessage' : 'UNABLE TO PROCESS REQUEST'
							});
						}
					}
				});
				$applozic(w).on('resize', function() {
					var $mck_msg_inner = mckMessageLayout.getMckMessageInner();
					if ($applozic('.chat.active-chat').length > 0) {
						var scrollHeight = $mck_msg_inner.get(0).scrollHeight;
						if ($mck_msg_inner.height() < scrollHeight) {
							$mck_msg_inner.animate({
								scrollTop : $mck_msg_inner.prop("scrollHeight")
							}, 0);
						}
					}
				});
				$applozic(d).on("click", ".fancybox", function(e) {
					var $this = $applozic(this);
					var contentType = $this.data('type');
					if (contentType.indexOf("video") !== -1) {
						var videoTag = $this.find('.mck-video-box').html(),
							video;
						$this.fancybox({
							content : videoTag,
							title : $this.data('name'),
							padding : 0,
							'openEffect' : 'none',
							'closeEffect' : 'none',
							helpers : {
								overlay : {
									locked : false,
									css : {
										'background' : 'rgba(0, 0, 0, 0.8)'
									}
								}
							},
							beforeShow : function() {
								video = $applozic('.fancybox-inner').find('video').get(0);
								video.load();
								video.play();
							}
						});
					} else {
						var href = $this.data('url');
						$applozic(this).fancybox({
							'openEffect' : 'none',
							'closeEffect' : 'none',
							'padding' : 0,
							'href' : href,
							'type' : 'image'
						});
					}
				});
			};
			_this.setHeaders = function(jqXHR) {
				jqXHR.setRequestHeader("UserId-Enabled", true);
				if (AUTH_CODE) {
					jqXHR.setRequestHeader("Authorization", "Basic " + AUTH_CODE);
				}
				jqXHR.setRequestHeader("Application-Key", MCK_APP_ID);
				if (USER_DEVICE_KEY) {
					jqXHR.setRequestHeader("Device-Key", USER_DEVICE_KEY);
				}
				if (MCK_ACCESS_TOKEN) {
					jqXHR.setRequestHeader("Access-Token", MCK_ACCESS_TOKEN);
				}
				if (MCK_APP_MODULE_NAME) {
					jqXHR.setRequestHeader("App-Module-Name", MCK_APP_MODULE_NAME);
				}
			};
			_this.appendLauncher = function() {
				$applozic("#mck-sidebox-launcher").remove();
				$applozic("body").append(_this.getLauncherHtml());
				mckNotificationService.init();
			};
			_this.tabFocused = function() {
				var hidden = "hidden";
				// Standards:
				if (hidden in d)
					d.addEventListener("visibilitychange", onchange);
				else if ((hidden === "mozHidden") in d)
					d.addEventListener("mozvisibilitychange", onchange);
				else if ((hidden === "webkitHidden") in d)
					d.addEventListener("webkitvisibilitychange", onchange);
				else if ((hidden === "msHidden") in d)
					d.addEventListener("msvisibilitychange", onchange);
				// IE 9 and lower:
				else if ("onfocusin" in d)
					d.onfocusin = d.onfocusout = onchange;
				// All others:
				else
					w.onpageshow = w.onpagehide = w.onfocus = w.onblur = onchange;
				function onchange(evt) {
					var v = true,
						h = false,
						evtMap = {
							focus : v,
							focusin : v,
							pageshow : v,
							blur : h,
							focusout : h,
							pagehide : h
						};
					evt = evt || w.event;
					if (evt.type in evtMap) {
						IS_MCK_TAB_FOCUSED = evtMap[evt.type];
					} else {
						IS_MCK_TAB_FOCUSED = this[hidden] ? false : true;
					}
					if (IS_MCK_TAB_FOCUSED) {
						if (MCK_IDLE_TIME_COUNTER < 1 && IS_LOGGED_IN) {
							mckInitializeChannel.checkConnected(true);
						}
						_this.stopIdleTimeCounter();
					} else {
						if (MCK_TYPING_STATUS === 1) {
							mckInitializeChannel.sendTypingStatus(0);
						}
						_this.manageIdleTime();
					}
				}
				// set the initial state (but only if browser supports the Page
				// Visibility API)
				if (d[hidden] !== undefined)
					onchange({
						type : d[hidden] ? "blur" : "focus"
					});
			};
			_this.manageIdleTime = function() {
				MCK_IDLE_TIME_COUNTER = MCK_IDLE_TIME_LIMIT;
				if (refreshIntervalId) {
					clearInterval(refreshIntervalId);
				}
				refreshIntervalId = setInterval(function() {
					if (--MCK_IDLE_TIME_COUNTER < 0) {
						MCK_IDLE_TIME_COUNTER = 0;
						mckInitializeChannel.stopConnectedCheck();
						clearInterval(refreshIntervalId);
						refreshIntervalId = "";
					}
				}, 60000);
			};
			_this.stopIdleTimeCounter = function() {
				MCK_IDLE_TIME_COUNTER = MCK_IDLE_TIME_LIMIT;
				if (refreshIntervalId) {
					clearInterval(refreshIntervalId);
				}
				refreshIntervalId = "";
			};
		}
		function MckMessageService() {
			var _this = this;
			var $mck_search = $applozic("#mck-search");
			var $mck_msg_to = $applozic("#mck-msg-to");
			var $mck_msg_new = $applozic("#mck-msg-new");
			var $mck_sidebox = $applozic("#mck-sidebox");
			var $mck_file_box = $applozic("#mck-file-box");
			var $mck_text_box = $applozic("#mck-text-box");
			var $mck_msg_form = $applozic("#mck-msg-form");
			var $mck_msg_sbmt = $applozic("#mck-msg-sbmt");
			var $mck_write_box = $applozic("#mck-write-box");
			var $mck_msg_error = $applozic("#mck-msg-error");
			var $mck_contact_search = $applozic(".mck-contact-search");
			var $mck_group_search = $applozic(".mck-group-search");
			var $mck_btn_attach = $applozic("#mck-btn-attach");
			var $mck_msg_cell = $applozic("#mck-message-cell");
			var $mck_typing_box = $applozic(".mck-typing-box");
			var $mck_loading = $applozic("#mck-contact-loading");
			var $mck_msg_loading = $applozic("#mck-msg-loading");
			var $mck_group_title = $applozic("#mck-group-title");
			var $mck_group_member_search = $applozic("#mck-group-member-search");
			var $mck_msg_response = $applozic("#mck-msg-response");
			var $mck_form_field = $applozic("#mck-msg-form input");
			var $mck_block_button = $applozic("#mck-block-button");
			var $li_mck_block_user = $applozic("#li-mck-block-user");
			var $mck_response_text = $applozic("#mck_response_text");
			var $mck_contact_search_input = $applozic("#mck-contact-search-input");
			var $mck_group_search_input = $applozic("#mck-group-search-input");
			var $mck_contacts_inner = $applozic(".mck-contacts-inner");
			var $mck_group_info_tab = $applozic("#mck-group-info-tab");
			var $mck_price_text_box = $applozic("#mck-price-text-box");
			var $mck_sidebox_search = $applozic("#mck-sidebox-search");
			var $mck_show_more_icon = $applozic("#mck-show-more-icon");
			var $mck_group_info_btn = $applozic("#mck-group-info-btn");
			var $mck_btn_group_exit = $applozic("#mck-btn-group-exit");
			var $mck_no_contact_text = $applozic("#mck-no-contact-text");
			var $mck_group_back_link = $applozic("#mck-group-back-link");
			var $mck_leave_group_btn = $applozic("#mck-leave-group-btn");
			var $mck_sidebox_content = $applozic(".mck-sidebox-content");
			var $mck_goup_search_box = $applozic("#mck-goup-search-box");
			var $mck_group_add_member = $applozic("#mck-group-add-member");
			var $mck_contacts_content = $applozic("#mck-contacts-content");
			var $mck_tab_option_panel = $applozic("#mck-tab-option-panel");
			var $mck_btn_group_create = $applozic("#mck-btn-group-create");
			var $mck_group_create_close = $applozic("#mck-group-create-close");
			var $mck_group_create_title = $applozic("#mck-group-create-title");
			var $mck_contact_search_box = $applozic("#mck-contact-search-box");
			var $mck_group_menu_options = $applozic(".mck-group-menu-options");
			var $mck_tab_message_option = $applozic(".mck-tab-message-option");
			var $mck_group_admin_options = $applozic(".mck-group-admin-options");
			var $mck_tab_title = $applozic("#mck-tab-individual .mck-tab-title");
			var $mck_tab_status = $applozic("#mck-tab-individual .mck-tab-status");
			var $mck_search_inner = $applozic("#mck-search-cell .mck-message-inner-right");
			var $mck_no_gsm_text = $applozic("#mck-no-gsm-text");
			var $mck_msg_inner;
			var MESSAGE_SEND_URL = "/rest/ws/message/send";
			var GROUP_CREATE_URL = "/rest/ws/group/create";
			var MESSAGE_LIST_URL = "/rest/ws/message/list";
			var TOPIC_ID_URL = "/rest/ws/conversation/topicId";
			var MESSAGE_DELETE_URL = "/rest/ws/message/delete";
			var CONVERSATION_ID_URL = "/rest/ws/conversation/id";
			var MESSAGE_READ_UPDATE_URL = "/rest/ws/message/read";
			var MESSAGE_ADD_INBOX_URL = "/rest/ws/message/add/inbox";
			var CONVERSATION_FETCH_URL = "/rest/ws/conversation/get";
			var MESSAGE_DELIVERY_UPDATE_URL = "/rest/ws/message/delivered";
			var CONVERSATION_CLOSE_UPDATE_URL = "/rest/ws/conversation/close";
			var CONVERSATION_DELETE_URL = "/rest/ws/message/delete/conversation";
			var CONVERSATION_READ_UPDATE_URL = "/rest/ws/message/read/conversation";
			var offlineblk = '<div id="mck-ofl-blk" class="mck-m-b"><div class="mck-clear"><div class="blk-lg-12 mck-text-light mck-text-muted mck-test-center">${userIdExpr} is offline now</div></div></div>';
			$applozic.template("oflTemplate", offlineblk);
			$applozic(d).on("click", ".mck-message-delete", function() {
				_this.deleteMessage($applozic(this).parents('.mck-m-b').data("msgkey"));
			});
			$applozic(".mck-minimize-icon").click(function() {
				$applozic(".mck-box-md,.mck-box-ft").animate({
					height : "toggle"
				});
				if ($mck_sidebox_content.hasClass("minimized")) {
					$mck_sidebox_content.css('height', '100%');
					$mck_sidebox_content.removeClass("minimized");
				} else {
					$mck_sidebox_content.css('height', '0%');
					$mck_sidebox_content.addClass("minimized");
				}
			});
			_this.initSearch = function() {
				$mck_contacts_content.removeClass('vis').addClass('n-vis');
				$mck_sidebox_content.removeClass('vis').addClass('n-vis');
				$mck_group_info_tab.removeClass('vis').addClass('n-vis');
				$mck_sidebox_search.removeClass('n-vis').addClass('vis');
				$mck_search_inner.html('<ul id="mck-search-list" class="mck-search-list mck-contact-list mck-nav mck-nav-tabs mck-nav-stacked"></ul>');
				if (MCK_CONTACT_ARRAY.length !== 0) {
					mckMessageLayout.addContactsToSearchList();
				} else if (!IS_MCK_OWN_CONTACTS) {
					mckContactService.loadContacts();
				} else {
					$mck_search_inner.html('<div class="mck-no-data-text mck-text-muted">No contacts yet!</div>');
				}
				$mck_search.focus();
			};
			_this.init = function() {
				mckMessageLayout.initSearchAutoType();
				mckStorage.clearMckMessageArray();
				$applozic(d).on("click", "." + MCK_LAUNCHER, function() {
					if ($applozic(this).hasClass('mck-msg-preview')) {
						$applozic(this).hide();
					}
				});
				$mck_msg_sbmt.click(function() {
					$mck_msg_form.submit();
				});
				$mck_contact_search.click(function() {
					mckMessageLayout.addContactsToContactSearchList();
				});
				$mck_group_search.click(function() {
					mckMessageLayout.addGroupsToGroupSearchList();
				});
				$applozic(d).on("click", ".mck-contact-search-tab", function(e) {
					e.preventDefault();
					var $this = $applozic(this);
					var tabId = $this.data("mck-id");
					var isGroup = $this.data("isgroup");
					tabId = (typeof tabId !== "undefined" && tabId !== "") ? tabId.toString() : "";
					if (tabId) {
						mckMessageLayout.loadTab({
							'tabId' : tabId,
							'isGroup' : isGroup,
						});
					}
					$mck_contact_search_box.mckModal('hide');
				});
				$mck_text_box.keydown(function(e) {
					if ($mck_write_box.hasClass('mck-text-req')) {
						$mck_write_box.removeClass('mck-text-req');
					}
					if (e.keyCode === 13 && (e.shiftKey || e.ctrlKey)) {
						e.preventDefault();
						if (w.getSelection) {
							var selection = w.getSelection(),
								range = selection.getRangeAt(0),
								br = d.createElement("br"),
								textNode = d.createTextNode("\u00a0");
							range.deleteContents(); // required or not?
							range.insertNode(br);
							range.collapse(false);
							range.insertNode(textNode);
							range.selectNodeContents(textNode);
							selection.removeAllRanges();
							selection.addRange(range);
							return false;
						}
					} else if (e.keyCode === 13) {
						if (typeof MCK_INIT_AUTO_SUGGESTION === "function" && $applozic(".atwho-view:visible").length > 0) {
							return;
						}
						e.preventDefault();
						if (MCK_TYPING_STATUS === 1) {
							mckInitializeChannel.sendTypingStatus(0, mckMessageLayout.getMckMessageInner().data('mck-id'));
						}
						($mck_msg_sbmt.is(':disabled') && $mck_file_box.hasClass('vis')) ? alert('Please wait file is uploading.') : $mck_msg_form.submit();
					} else if (MCK_TYPING_STATUS === 0) {
						mckInitializeChannel.sendTypingStatus(1, mckMessageLayout.getMckMessageInner().data('mck-id'));
					}
				});
				$applozic(d).on("click", ".mck-delete-button", function() {
					if (confirm("Are you sure want to delete all the conversation!")) {
						mckMessageService.deleteConversation();
					}
				});
				$applozic(d).on("click", ".applozic-tm-launcher", function(e) {
					e.preventDefault();
					var tabId = $applozic(this).data("mck-id");
					tabId = (typeof tabId !== "undefined" && tabId !== "") ? tabId.toString() : "";
					var userName = $applozic(this).data("mck-name");
					userName = (typeof userName !== "undefined" && userName !== "") ? userName.toString() : "";
					var supportId = $applozic(this).data("mck-supportid");
					supportId = (typeof supportId !== "undefined" && supportId !== "") ? supportId.toString() : "";
					var topicId = $applozic(this).data("mck-topicid");
					topicId = (typeof topicId !== "undefined" && topicId !== "") ? topicId.toString() : "";
					var msgText = $applozic(this).data("mck-msg");
					msgText = (typeof msgText !== "undefined" && msgText !== "") ? msgText.toString() : "";
					if (typeof (MCK_GETTOPICDETAIL) === "function" && topicId) {
						var topicDetail = MCK_GETTOPICDETAIL(topicId);
						if (typeof topicDetail === 'object' && topicDetail.title !== 'undefined') {
							MCK_TOPIC_DETAIL_MAP[topicId] = topicDetail;
						}
					}
					var params = {
						'topicId' : topicId,
						'tabId' : tabId,
						'userName' : userName,
						'isMessage' : true
					};
					var messagePxy = {
						"type" : 5,
						"contentType" : 0,
						"message" : msgText
					};
					params.messagePxy = messagePxy;
					if (supportId) {
						params.isGroup = true;
						params.supportId = supportId;
						mckMessageService.getConversationId(params);
					} else {
						params.isGroup = false;
						mckMessageLayout.loadTab(params, mckMessageService.dispatchMessage);
					}
				});
				$applozic(d).on("click", ".applozic-wt-launcher", function(e) {
					e.preventDefault();
					var tabId = $applozic(this).data("mck-id");
					tabId = (typeof tabId !== "undefined" && tabId !== "") ? tabId.toString() : "";
					var userName = $applozic(this).data("mck-name");
					userName = (typeof userName !== "undefined" && userName !== "") ? userName.toString() : "";
					var topicId = $applozic(this).data("mck-topicid");
					topicId = (typeof topicId !== "undefined" && topicId !== "") ? topicId.toString() : "";
					var topicStatus = $applozic(this).data("mck-topic-status");
					if (topicStatus) {
						topicStatus = (CONVERSATION_STATUS_MAP.indexOf(topicStatus) === -1) ? CONVERSATION_STATUS_MAP[0] : topicStatus.toString();
					} else {
						topicStatus = CONVERSATION_STATUS_MAP[0];
					}
					if (typeof (MCK_GETTOPICDETAIL) === "function") {
						var topicDetail = MCK_GETTOPICDETAIL(topicId);
						if (typeof topicDetail === 'object' && topicDetail.title !== 'undefined') {
							MCK_TOPIC_DETAIL_MAP[topicId] = topicDetail;
						}
					}
					mckMessageService.getConversationId({
						'tabId' : tabId,
						'isGroup' : false,
						'userName' : userName,
						'topicId' : topicId,
						'topicStatus' : topicStatus,
						'isMessage' : false
					});
				});
				$applozic(d).on("click", ".applozic-ct-launcher", function(e) {
					e.preventDefault();
					var tabId = $applozic(this).data("mck-id");
					tabId = (typeof tabId !== "undefined" && tabId !== "") ? tabId.toString() : "";
					var userName = $applozic(this).data("mck-name");
					userName = (typeof userName !== "undefined" && userName !== "") ? userName.toString() : "";
					var topicId = $applozic(this).data("mck-topicid");
					topicId = (typeof topicId !== "undefined" && topicId !== "") ? topicId.toString() : "";
					var topicStatus = $applozic(this).data("mck-topic-status");
					if (topicStatus) {
						topicStatus = (CONVERSATION_STATUS_MAP.indexOf(topicStatus) === -1) ? CONVERSATION_STATUS_MAP[0] : topicStatus.toString();
					} else {
						topicStatus = CONVERSATION_STATUS_MAP[0];
					}
					var params = {
						'tabId' : tabId,
						'isGroup' : false,
						'userName' : userName,
						'topicId' : topicId,
						'topicStatus' : topicStatus,
						'isMessage' : false
					};
					if (typeof (MCK_GETCONVERSATIONDETAIL) === "function") {
						var conversationDetail = MCK_GETCONVERSATIONDETAIL(topicId);
						if (typeof conversationDetail === 'object') {
							if (conversationDetail.topicDetail && typeof (conversationDetail.topicDetail) === 'object' && conversationDetail.topicDetail.title !== 'undefined') {
								MCK_TOPIC_DETAIL_MAP[topicId] = conversationDetail.topicDetail;
							}
							if (conversationDetail.fallBackTemplatesList && conversationDetail.fallBackTemplatesList.length > 0) {
								params.fallBackTemplatesList = conversationDetail.fallBackTemplatesList;
							}
						}
					}
					mckMessageService.getConversationId(params);
				});
				$applozic(d).on("click", ".left .person,." + MCK_LAUNCHER + ",.mck-conversation-tab-link, .mck-contact-list ." + MCK_LAUNCHER, function(e) {
					e.preventDefault();
					var $this = $applozic(this);
					var tabId = $this.data("mck-id");
					tabId = (typeof tabId !== "undefined" && tabId !== "") ? tabId.toString() : "";
					var userName = $this.data("mck-name");
					userName = (typeof userName !== "undefined" && userName !== "") ? userName.toString() : "";
					var topicId = $this.data("mck-topicid");
					topicId = (typeof topicId !== "undefined" && topicId !== "") ? topicId.toString() : "";
					var isGroup = ($this.data("isgroup") === true);
					var conversationId = $this.data("mck-conversationid");
					conversationId = (typeof conversationId !== "undefined" && conversationId !== "") ? conversationId.toString() : "";
					// Todo: if contact is not present
					// in the list then add it first.
					/*
					 * var personName = $applozic(this).find('.name').text(); $applozic('.right .top .name').html(personName); $applozic('.chat').removeClass('active-chat'); $applozic('.left .person').removeClass('active'); $applozic(this).addClass('active'); $applozic('.chat[data-mck-id ="'+tabId+'"]').addClass('active-chat');
					 */
					if (topicId && !conversationId) {
						var topicStatus = $applozic(this).data("mck-topic-status");
						if (topicStatus) {
							topicStatus = (CONVERSATION_STATUS_MAP.indexOf(topicStatus) === -1) ? CONVERSATION_STATUS_MAP[0] : topicStatus.toString();
						} else {
							topicStatus = CONVERSATION_STATUS_MAP[0];
						}
						mckMessageService.getConversationId({
							'tabId' : tabId,
							'isGroup' : isGroup,
							'userName' : userName,
							'topicId' : topicId,
							'topicStatus' : topicStatus,
							'isMessage' : false
						});
					} else {
						mckMessageLayout.loadTab({
							'tabId' : tabId,
							'isGroup' : isGroup,
							'userName' : userName,
							'conversationId' : conversationId,
							'topicId' : topicId
						});
					}
					$mck_search.val("");
				});
				$applozic(d).on("click", ".mck-close-sidebox", function(e) {
					e.preventDefault();
					$mck_sidebox.mckModal('hide');
					$mck_msg_inner = mckMessageLayout.getMckMessageInner();
					var conversationId = $mck_msg_inner.data('mck-conversationid');
					$mck_msg_inner.data("mck-id", "");
					$mck_msg_inner.data("mck-topicid", "");
					$mck_msg_inner.data("mck-name", "");
					$mck_msg_inner.data('mck-conversationid', "");
					if (conversationId) {
						var conversationPxy = MCK_CONVERSATION_MAP[conversationId];
						if (typeof conversationPxy === 'object') {
							var topicId = conversationPxy.topicId;
							if (typeof MCK_ON_PLUGIN_CLOSE === "function") {
								MCK_ON_PLUGIN_CLOSE(MCK_USER_ID, topicId);
							}
						}
					}
					mckInitializeChannel.unsubscibeToTypingChannel();
				});
				$applozic(d).on("click", ".mck-price-submit", function(e) {
					e.preventDefault();
					_this.sendPriceMessage();
				});
				$mck_price_text_box.keydown(function(event) {
					if (event.keyCode === 13) {
						_this.sendPriceMessage();
					}
				});
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				$mck_contacts_inner.bind('scroll', function() {
					if ($mck_contacts_inner.scrollTop() + $mck_contacts_inner.innerHeight() >= $mck_contacts_inner[0].scrollHeight) {
						var startTime = $mck_contacts_inner.data('datetime');
						if (startTime > 0 && !CONTACT_SYNCING) {
							mckMessageService.loadMessageList({
								'tabId' : '',
								'isGroup' : false,
								'startTime' : startTime
							});
						}
					}
				});
				$mck_price_text_box.on('click', function(e) {
					e.preventDefault();
					$mck_price_text_box.removeClass('mck-text-req');
				});
				$mck_block_button.on('click', function(e) {
					e.preventDefault();
					$mck_msg_inner = mckMessageLayout.getMckMessageInner();
					var tabId = $mck_msg_inner.data('mck-id');
					var isGroup = $mck_msg_inner.data('isgroup');
					var isBlock = !$mck_msg_inner.data('blocked');
					if (isGroup) {
						$li_mck_block_user.removeClass('vis').addClass('n-vis');
						return;
					}
					var blockText = (isBlock) ? 'Are you sure want to block this user!' : 'Are you sure want to unblock this user!';
					if (confirm(blockText)) {
						mckContactService.blockUser(tabId, isBlock);
					}
				});
				$mck_leave_group_btn.on('click', function(e) {
					e.preventDefault();
					$mck_msg_inner = mckMessageLayout.getMckMessageInner();
					var tabId = $mck_msg_inner.data('mck-id');
					var isGroup = $mck_msg_inner.data('isgroup');
					if (!isGroup) {
						$mck_group_menu_options.removeClass('vis').addClass('n-vis');
						return;
					}
					if (confirm('Are you sure want to exit this group!')) {
						mckGroupService.leaveGroup({
							'groupId' : tabId,
							'apzCallback' : mckGroupLayout.onGroupLeft
						});
					}
				});
				$applozic(d).on('click', '.mck-add-to-group', function(e) {
					e.preventDefault();
					var userId = $applozic(this).data('mck-id');
					if (typeof userId !== 'undefined') {
						mckGroupLayout.addGroupMemberFromSearch(userId);
					}
					$mck_goup_search_box.mckModal('hide');
				});
				$applozic(d).on('click', '.mck-btn-remove-member', function(e) {
					e.preventDefault();
					var userId = $applozic(this).parents('.mck-li-group-member').data('mck-id');
					var groupId = $mck_group_info_tab.data('mck-id');
					if (typeof groupId !== 'undefined' && typeof userId !== 'undefined') {
						var group = mckGroupUtils.getGroup(groupId);
						if (typeof group === 'object' && MCK_USER_ID === group.adminName) {
							if (confirm('Are you sure want to remove this member!')) {
								mckGroupService.removeGroupMember({
									'groupId' : groupId,
									'userId' : userId,
									'apzCallback' : mckGroupLayout.onRemovedGroupMember
								});
							}
						} else {
							$mck_group_admin_options.removeClass('vis').addClass('n-vis');
						}
					}
				});
				$mck_btn_group_exit.on('click', function(e) {
					e.preventDefault();
					var groupId = $mck_group_info_tab.data('mck-id');
					if (!groupId) {
						mckMessageLayout.loadTab({
							'tabId' : "",
							'isGroup' : false
						});
						return;
					}
					if (confirm('Are you sure want to exit this group!')) {
						mckGroupService.leaveGroup({
							'groupId' : groupId,
							'apzCallback' : mckGroupLayout.onGroupLeft
						});
					}
				});
				$applozic(d).on('click', '.mck-group-info-btn', function(e) {
					e.preventDefault();
					$mck_msg_inner = mckMessageLayout.getMckMessageInner();
					var tabId = $mck_msg_inner.data('mck-id');
					var isGroup = $mck_msg_inner.data('isgroup');
					if (!isGroup) {
						$mck_group_menu_options.removeClass('vis').addClass('n-vis');
						return;
					}
					var params = {
						'groupId' : tabId
					};
					var conversationId = $mck_msg_inner.data('mck-conversationid');
					if (conversationId) {
						params.conversationId = conversationId;
					}
					mckGroupLayout.loadGroupInfo(params);
					// setting emaji width
					var width = $applozic('#mck-write-box').css('width');
					$applozic(".emoji-menu").css('width',width);
				});
				$mck_group_add_member.on('click', function(e) {
					e.preventDefault();
					var groupId = $mck_group_info_tab.data('mck-id');
					if (groupId) {
						var group = mckGroupUtils.getGroup(groupId);
						if (group && group.adminName === MCK_USER_ID) {
							if (MCK_GROUP_SEARCH_ARRAY.length > 0) {
								mckGroupLayout.addMembersToGroupSearchList();
							} else if (IS_MCK_OWN_CONTACTS && MCK_CONTACT_ARRAY.length > 0) {
								$applozic.each(MCK_CONTACT_ARRAY, function(i, contact) {
									MCK_GROUP_SEARCH_ARRAY.push(contact.contactId);
								});
								mckGroupLayout.addMembersToGroupSearchList();
							} else {
								$mck_no_gsm_text.removeClass('n-vis').addClass('vis');
								mckContactService.getUserStatus({
									'callback' : mckGroupLayout.addMembersToGroupSearchList
								});
							}
							$mck_goup_search_box.mckModal();
						} else {
							$mck_group_admin_options.removeClass('vis').addClass('n-vis');
							return;
						}
					}
				});
				$mck_group_member_search.keypress(function(e) {
					if (e.which === 13) {
						var userId = $mck_group_member_search.val();
						if (userId !== '') {
							mckGroupLayout.addGroupMemberFromSearch(userId);
						}
						$mck_group_member_search.val('');
						return true;
					}
				});
				$applozic(d).on("click", ".mck-group-member-search-link", function(e) {
					e.preventDefault();
					var userId = $mck_group_member_search.val();
					if (userId !== '') {
						mckGroupLayout.addGroupMemberFromSearch(userId);
					}
					$mck_group_member_search.val('');
				});
				$applozic(d).on("click", ".mck-show-more", function(e) {
					e.preventDefault();
					$mck_msg_inner = mckMessageLayout.getMckMessageInner();
					var $this = $applozic(this);
					var tabId = $this.data("tabId");
					var isGroup = $mck_msg_inner.data('isgroup');
					var conversationId = $mck_msg_inner.data('mck-conversationid');
					conversationId = (conversationId) ? conversationId.toString() : '';
					var startTime = $this.data('datetime');
					mckMessageService.loadMessageList({
						'tabId' : tabId,
						'isGroup' : isGroup,
						'conversationId' : conversationId,
						'startTime' : startTime
					});
				});
				$applozic(d).on("click", ".mck-accept", function(e) {
					var conversationId = $applozic(this).data('mck-conversationid');
					var priceText = $applozic(this).data('mck-topic-price');
					if (typeof (MCK_PRICE_DETAIL) === 'function' && priceText && conversationId) {
						var conversationPxy = MCK_CONVERSATION_MAP[conversationId];
						var groupId = $mck_msg_to.val();
						var supplierId = mckGroupLayout.getGroupDisplayName(groupId);
						if (typeof conversationPxy === 'object') {
							MCK_PRICE_DETAIL({
								custId : MCK_USER_ID,
								suppId : supplierId,
								productId : conversationPxy.topicId,
								price : priceText
							});
							mckMessageService.sendConversationCloseUpdate(conversationId);
						} else {
							mckMessageService.getTopicId({
								'conversationId' : conversationId,
								'suppId' : supplierId,
								'priceText' : priceText
							});
						}
					}
				});
				$mck_msg_form.submit(function(e) {
					e.preventDefault();
					$mck_msg_inner = mckMessageLayout.getMckMessageInner();
					if (MCK_TYPING_STATUS === 1) {
						mckInitializeChannel.sendTypingStatus(0, $mck_msg_inner.data('mck-id'));
					}
					var message = $applozic.trim(mckUtils.textVal($mck_text_box[0]));
					if ($mck_file_box.hasClass('n-vis') && FILE_META.length > 0) {
						FILE_META = [];
					}
					if (message.length === 0 && FILE_META.length === 0) {
						$mck_write_box.addClass("mck-text-req");
						return false;
					}
					if (typeof (MCK_MSG_VALIDATION) === 'function' && !MCK_MSG_VALIDATION(message)) {
						return false;
					}
					var messagePxy = {
						"type" : 5,
						"contentType" : 0,
						"message" : message
					};
					var conversationId = $mck_msg_inner.data('mck-conversationid');
					var topicId = $mck_msg_inner.data('mck-topicid');
					if (conversationId) {
						messagePxy.conversationId = conversationId;
					} else if (topicId) {
						var conversationPxy = {
							'topicId' : topicId
						};
						var topicDetail = MCK_TOPIC_DETAIL_MAP[topicId];
						if (typeof topicDetail === "object") {
							conversationPxy.topicDetail = w.JSON.stringify(topicDetail);
						}
						messagePxy.conversationPxy = conversationPxy;
					}
					if ($mck_msg_inner.data("isgroup") === true) {
						messagePxy.groupId = $mck_msg_to.val();
					} else {
						messagePxy.to = $mck_msg_to.val();
					}
					$mck_msg_sbmt.attr('disabled', true);
					$mck_msg_error.removeClass('vis').addClass('n-vis');
					$mck_msg_error.html("");
					$mck_response_text.html("");
					$mck_msg_response.removeClass('vis').addClass('n-vis');
					_this.sendMessage(messagePxy);
					return false;
				});
				$mck_form_field.on('click', function() {
					$applozic(this).val("");
					$mck_msg_error.removeClass('vis').addClass('n-vis');
					$mck_msg_response.removeClass('vis').addClass('n-vis');
				});
				$applozic(d).bind("click", function(e) {
					$applozic(".mck-context-menu").removeClass("vis").addClass("n-vis");
					if (d.activeElement.id !== "mck-msg-sbmt") {
						$mck_write_box.removeClass('mck-text-req');
					}
					$mck_msg_inner = mckMessageLayout.getMckMessageInner();
					if (d.activeElement !== $mck_text_box) {
						if (MCK_TYPING_STATUS === 1) {
							mckInitializeChannel.sendTypingStatus(0, $mck_msg_inner.data('mck-id'));
						}
					}
					if (d.activeElement && d.activeElement.id !== 'mck-group-name-save') {
						$mck_group_title.removeClass('mck-req-border');
					}
					if (d.activeElement && d.activeElement.id !== 'mck-btn-group-create') {
						$mck_group_create_title.removeClass('mck-req-border');
					}
					$applozic('.mcktypeahead.mck-dropdown-menu').hide();
				});
			};
			_this.sendMessage = function(messagePxy) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				if (typeof messagePxy !== 'object') {
					return;
				}
				if (messagePxy.message.length === 0 && FILE_META.length === 0) {
					$mck_write_box.addClass("mck-text-req");
					return;
				}
				if (messagePxy.conversationId) {
					var conversationPxy = MCK_CONVERSATION_MAP[messagePxy.conversationId];
					if (conversationPxy !== 'undefined' && conversationPxy.closed) {
						mckMessageLayout.closeConversation();
						$mck_msg_sbmt.attr('disabled', false);
						return;
					}
				}
				var isBlocked = $mck_msg_inner.data('blocked');
				if (isBlocked) {
					mckUserUtils.toggleBlockUser(tabId, true);
					$mck_msg_sbmt.attr('disabled', false);
					return;
				}
				var contact = '';
				if (messagePxy.groupId) {
					contact = mckGroupUtils.getGroup(messagePxy.groupId);
					if (typeof contact === "undefined") {
						contact = mckGroupUtils.createGroup(messagePxy.groupId);
					}
				} else {
					contact = mckMessageLayout.fetchContact(messagePxy.to);
				}
				if ($applozic("#mck-message-cell .mck-no-data-text").length > 0) {
					$applozic(".mck-no-data-text").remove();
				}
				if (messagePxy.message && FILE_META.length === 0) {
					var isTopPanelAdded = ($mck_tab_message_option.hasClass('n-vis'));
					var tabId = $mck_msg_inner.data('mck-id');
					var randomId = mckUtils.randomId();
					messagePxy.key = randomId;
					if (messagePxy.contentType !== 12 && tabId && tabId.toString() === contact.contactId) {
						_this.addMessageToTab(messagePxy, contact);
					}
					var optns = {
						tabId : contact.contactId,
						isTopPanelAdded : isTopPanelAdded
					};
					_this.submitMessage(messagePxy, optns);
				} else if (FILE_META.length > 0) {
					$applozic.each(FILE_META, function(i, fileMeta) {
						var isTopPanelAdded = ($mck_tab_message_option.hasClass('n-vis'));
						var tabId = $mck_msg_inner.data('mck-id');
						var randomId = mckUtils.randomId();
						messagePxy.key = randomId;
						messagePxy.fileMeta = fileMeta;
						messagePxy.contentType = 1;
						if (messagePxy.contentType !== 12 && tabId && tabId.toString() === contact.contactId) {
							_this.addMessageToTab(messagePxy, contact);
						}
						var optns = {
							tabId : contact.contactId,
							isTopPanelAdded : isTopPanelAdded
						};
						_this.submitMessage(messagePxy, optns);
					});
				}
				$mck_write_box.removeClass("mck-text-req");
				$mck_msg_sbmt.attr('disabled', false);
				$applozic("." + randomId + " .mck-message-status").removeClass('mck-icon-sent').addClass('mck-icon-time');
				mckMessageLayout.addTooltip(randomId);
				mckMessageLayout.clearMessageField();
				FILE_META = [];
				delete TAB_MESSAGE_DRAFT[contact.contactId];
			};
			_this.addMessageToTab = function(messagePxy, contact) {
				var message = {
					'to' : messagePxy.to,
					'groupId' : messagePxy.groupId,
					'deviceKey' : messagePxy.deviceKey,
					'contentType' : messagePxy.contentType,
					'message' : messagePxy.message,
					'conversationId' : messagePxy.conversationId,
					'topicId' : messagePxy.topicId,
					'sendToDevice' : true,
					'createdAtTime' : new Date().getTime(),
					'key' : messagePxy.key,
					'storeOnDevice' : true,
					'sent' : false,
					'shared' : false,
					'read' : true
				};
				message.type = (messagePxy.type) ? messagePxy.type : 5;
				if (messagePxy.fileMeta) {
					message.fileMeta = messagePxy.fileMeta;
				}
				mckMessageLayout.addMessage(message, contact, true, true, false);
			};
			_this.sendWelcomeMessage = function(params) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var randomId = mckUtils.randomId();
				var tabId = $mck_msg_inner.data('mck-id');
				var isGroup = $mck_msg_inner.data('isgroup');
				var messagePxy = {
					'key' : randomId,
					'type' : 4,
					'contentType' : 0,
					'to' : params.sender,
					'message' : params.messageContent
				};
				if (tabId && tabId.toString() === params.sender && !isGroup) {
					var contact = mckMessageLayout.fetchContact(tabId);
					_this.addMessageToTab(messagePxy, contact);
				}
				$applozic.ajax({
					type : "GET",
					url : MCK_BASE_URL + MESSAGE_ADD_INBOX_URL,
					global : false,
					data : "sender=" + encodeURIComponent(params.sender) + "&messageContent=" + encodeURIComponent(params.messageContent),
					contentType : 'text/plain',
					success : function(data) {}
				});
			};
			_this.submitMessage = function(messagePxy, optns) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var randomId = messagePxy.key;
				if (MCK_CHECK_USER_BUSY_STATUS) {
					messagePxy.metadata = {
						userStatus : 4
					};
				}
				messagePxy.source = MCK_SOURCE;
				var $mck_msg_div = $applozic("#mck-message-cell div[name='message']." + randomId);
				$applozic.ajax({
					type : "POST",
					url : MCK_BASE_URL + MESSAGE_SEND_URL,
					global : false,
					data : w.JSON.stringify(messagePxy),
					contentType : 'application/json',
					success : function(data) {
						var currentTabId = $mck_msg_inner.data('mck-id');
						if (typeof data === 'object') {
							var messageKey = data.messageKey;
							if (currentTabId && (currentTabId.toString() === optns.tabId)) {
								var conversationId = data.conversationId;
								$mck_msg_inner.data('mck-conversationid', conversationId);
								$mck_msg_div.removeClass(randomId).addClass(messageKey);
								$mck_msg_div.data('msgkey', messageKey);
								$applozic("." + messageKey + " .mck-message-status").removeClass('mck-icon-time').addClass('mck-icon-sent').attr('title', 'sent');
								mckMessageLayout.addTooltip(messageKey);
								if (optns.isTopPanelAdded) {
									$mck_tab_option_panel.data('datetime', data.createdAt);
								}
								mckMessageLayout.messageContextMenu(messageKey);
							}
							if (messagePxy.conversationPxy) {
								var conversationPxy = messagePxy.conversationPxy;
								if (messagePxy.topicId) {
									MCK_TOPIC_CONVERSATION_MAP[messagePxy.topicId] = [ conversationId ];
								}
								MCK_CONVERSATION_MAP[conversationId] = conversationPxy;
							}
						} else if (data === "CONVERSATION_CLOSED" || data === "BUSY_WITH_OTHER") {
							$mck_msg_sbmt.attr('disabled', false);
							mckMessageLayout.closeConversation(data);
							$mck_msg_div.remove();
							if (optns.isTopPanelAdded) {
								$mck_tab_message_option.removeClass('vis').addClass('n-vis');
							}
						} else if (data === 'error') {
							$mck_msg_sbmt.attr('disabled', false);
							$mck_msg_error.html("Unable to process your request. Please try again");
							$mck_msg_error.removeClass('n-vis').addClass('vis');
							$mck_msg_div.remove();
							if (optns.isTopPanelAdded) {
								$mck_tab_message_option.removeClass('vis').addClass('n-vis');
							}
						}
					// mckInitializeChannel.checkConnected(true);
					},
					error : function() {
						$mck_msg_error.html('Unable to process your request. Please try again.');
						$mck_msg_error.removeClass('n-vis').addClass('vis');
						if ($mck_msg_div) {
							$mck_msg_div.remove();
						}
						if (optns.isTopPanelAdded) {
							$mck_tab_message_option.removeClass('vis').addClass('n-vis');
						}
					}
				});
			};
			_this.deleteMessage = function(msgKey) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var tabId = $mck_msg_inner.data('mck-id');
				var isGroup = $mck_msg_inner.data("isgroup");
				if (typeof tabId !== 'undefined') {
					$applozic.ajax({
						url : MCK_BASE_URL + MESSAGE_DELETE_URL + "?key=" + msgKey,
						type : 'get',
						success : function(data) {
							if (data === 'success') {
								var currentTabId = $mck_msg_inner.data('mck-id');
								if (currentTabId === tabId) {
									$applozic("." + msgKey).remove();
									if ($mck_msg_inner.is(":empty")) {
										$mck_tab_message_option.removeClass('vis').addClass('n-vis');
									}
									var $latestMessageDiv = $mck_msg_inner.children("div[name='message']:last");
									if ($latestMessageDiv.length > 0) {
										mckMessageService.updateContactList(tabId, isGroup);
									} else {
										var contact = (isGroup) ? mckGroupUtils.getGroup(tabId) : mckMessageLayout.getContact(tabId);
										var contHtmlExpr = (contact.isGroup) ? 'group-' + contact.htmlId : 'user-' + contact.htmlId;
										$applozic("#li-" + contHtmlExpr + " .mck-cont-msg-wrapper").html('');
										$applozic("#li-" + contHtmlExpr + " .time").html('');
									}
								}
								mckStorage.clearMckMessageArray();
							} else {
								w.console.log('Unable to delete message. Please reload page.');
							}
						}
					});
				}
			};
			_this.deleteConversation = function() {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var tabId = $mck_msg_inner.data('mck-id');
				var isGroup = $mck_msg_inner.data("isgroup");
				var conversationId = $mck_msg_inner.data('mck-conversationid');
				if (typeof tabId !== 'undefined') {
					var data = (isGroup) ? "groupId=" + tabId : "userId=" + encodeURIComponent(tabId);
					if (conversationId) {
						data += "&conversationId=" + conversationId;
					}
					$applozic.ajax({
						type : "get",
						url : MCK_BASE_URL + CONVERSATION_DELETE_URL,
						global : false,
						data : data,
						success : function() {
							var currentTabId = $mck_msg_inner.data('mck-id');
							if (currentTabId === tabId) {
								$mck_msg_inner.html("");
								$mck_msg_cell.removeClass('n-vis').addClass('vis');
								$mck_msg_inner.html('<div class="mck-no-data-text mck-text-muted">No messages yet!</div>');
								$mck_tab_message_option.removeClass('vis').addClass('n-vis');
							}
							var contact = (isGroup) ? mckGroupUtils.getGroup(tabId) : mckMessageLayout.getContact(tabId);
							var contHtmlExpr = (contact.isGroup) ? 'group-' + contact.htmlId : 'user-' + contact.htmlId;
							$applozic("#li-" + contHtmlExpr + " .mck-cont-msg-wrapper").html('');
							$applozic("#li-" + contHtmlExpr + " .time").html('');
							mckStorage.clearMckMessageArray();
						},
						error : function() {}
					});
				}
			};
			_this.getMessages = function(params) {
				var reqData = "";
				if (typeof params.userId !== "undefined" && params.userId !== "") {
					reqData = (params.isGroup) ? "&groupId=" + params.userId : "&userId=" + encodeURIComponent(params.userId);
					if (params.startTime) {
						reqData += "&endTime=" + params.startTime;
					}
					reqData += "&pageSize=30";
					if ((IS_MCK_TOPIC_HEADER || IS_MCK_TOPIC_BOX) && params.conversationId) {
						reqData += "&conversationId=" + params.conversationId;
						if (typeof MCK_TAB_CONVERSATION_MAP[params.userId] === 'undefined') {
							reqData += "&conversationReq=true";
						}
					}
				} else {
					if (params.startTime) {
						reqData += "&endTime=" + params.startTime;
					}
					reqData += "&mainPageSize=100";
				}
				var response = new Object();
				$applozic.ajax({
					url : MCK_BASE_URL + MESSAGE_LIST_URL + "?startIndex=0" + reqData,
					type : 'get',
					success : function(data) {
						response.status = "success";
						response.data = data;
						if (params.callback) {
							params.callback(response);
						}
						return;
					},
					error : function() {
						response.status = "error";
						if (params.callback) {
							params.callback(response);
						}
					}
				});
			};
			_this.getMessageList = function(params) {
				var tabId = params.id;
				if (typeof params.clientGroupId !== "undefined" && params.clientGroupId !== "") {
					var reqdata = (params.pageSize) ? "&pageSize=" + params.pageSize : "&pageSize=50";
					reqdata += "&clientGroupId=" + params.clientGroupId;
					if (params.startTime) {
						reqdata += "&endTime=" + params.startTime;
					}
					var resp = {
						'clientGroupId' : params.clientGroupId
					};
				} else if (typeof tabId !== "undefined" && tabId !== "") {
					var reqdata = (params.pageSize) ? "&pageSize=" + params.pageSize : "&pageSize=50";
					reqdata += ('' + params.isGroup === 'true') ? "&groupId=" + tabId : "&userId=" + tabId;
					if (params.startTime) {
						reqdata += "&endTime=" + params.startTime;
					}
					var resp = {
						'id' : tabId
					};
				} else {
					var reqdata = (params.pageSize) ? "&mainPageSize=" + params.pageSize : "&mainPageSize=50";
					if (params.startTime) {
						reqdata += "&endTime=" + params.startTime;
					}
					var resp = {
						'id' : ""
					};
				}
				if (params.topicId && (tabId || params.clientGroupId)) {
					if (params.conversationId) {
						reqdata += "&conversationId=" + params.conversationId;
					}
					if (params.topicId) {
						resp['topicId'] = params.topicId;
					}
				}
				$applozic.ajax({
					url : MCK_BASE_URL + MESSAGE_LIST_URL + "?startIndex=0" + reqdata,
					type : 'get',
					global : false,
					success : function(data) {
						resp.status = "success";
						if (typeof data.message === "undefined" || data.message.length === 0) {
							resp.messages = [];
						} else {
							var messages = data.message;
							var messageFeeds = new Array();
							$applozic.each(messages, function(i, message) {
								if (typeof message.to !== "undefined" || typeof message.groupId !== "undefined") {
									var messageFeed = mckMessageLayout.getMessageFeed(message);
									messageFeeds.push(messageFeed);
								}
							});
							resp.messages = messageFeeds;
						}
						if (data.groupFeeds.length > 0) {
							resp.id = data.groupFeeds[0].id;
						}
						params.callback(resp);
					},
					error : function() {
						resp.status = "error";
						params.callback(resp);
					}
				});
			};
			_this.loadMessageList = function(params, callback) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var individual = false;
				var isConvReq = false;
				var reqData = '';
				if (typeof params.tabId !== 'undefined' && params.tabId !== '') {
					MESSAGE_SYNCING = true;
					reqData = (params.isGroup) ? "&groupId=" + params.tabId : "&userId=" + encodeURIComponent(params.tabId);
					individual = true;
					if (params.startTime) {
						reqData += "&endTime=" + params.startTime;
					}
					reqData += "&pageSize=30";
					if ((IS_MCK_TOPIC_HEADER || IS_MCK_TOPIC_BOX) && params.conversationId) {
						reqData += "&conversationId=" + params.conversationId;
						if (typeof MCK_TAB_CONVERSATION_MAP[params.tabId] === 'undefined') {
							isConvReq = true;
							reqData += "&conversationReq=true";
						} else {
							mckMessageLayout.addConversationMenu(params.tabId, params.isGroup);
						}
					}
					$mck_msg_loading.removeClass('n-vis').addClass('vis');
				} else {
					CONTACT_SYNCING = true;
					if (params.startTime) {
						reqData += "&endTime=" + params.startTime;
					}
					reqData += '&mainPageSize=60';
					$mck_loading.removeClass('n-vis').addClass('vis');
				}
				if (!params.startTime) {
					$mck_msg_inner.html('');
				}
				$applozic.ajax({
					url : MCK_BASE_URL + MESSAGE_LIST_URL + "?startIndex=0" + reqData,
					type : 'get',
					global : false,
					success : function(data) {
						var isMessages = true;
						var currTabId = $mck_msg_inner.data('mck-id');
						var isGroupTab = $mck_msg_inner.data('isgroup');
						if (CONTACT_SYNCING && !params.startTime) {
							_this.initSearch();
						}
						CONTACT_SYNCING = false;
						MESSAGE_SYNCING = false;
						if (individual) {
							if (typeof currTabId === "undefined" || (params.tabId === currTabId && ('' + isGroupTab === '' + params.isGroup))) {
								if (data + '' === "null" || typeof data.message === "undefined" || data.message.length === 0) {
									isMessages = false;
									if (individual) {
										if (params.startTime) {
											$applozic("#mck-no-more-messages").removeClass('n-vis').addClass('vis');
											$applozic("#mck-no-more-messages").fadeOut(3000, function() {
												$mck_show_more_icon.removeClass('vis').addClass('n-vis');
											});
											$applozic(".mck-message-inner[data-mck-id='" + params.tabId + "']").data('datetime', "");
										} else if ($applozic("#mck-message-cell .mck-message-inner-right div[name='message']").length === 0) {
											$mck_tab_message_option.removeClass('vis').addClass('n-vis');
											$applozic(".mck-message-inner[data-mck-id='" + params.tabId + "']").html('<div class="mck-no-data-text mck-text-muted">No messages yet!</div>');
										}
									} else {
									}
								}
								if (data + '' !== "null" && data.status !== 'error') {
									if (isMessages) {
										if (params.startTime > 0) {
											mckMessageLayout.processMessageList(data, false);
										} else {
											mckMessageLayout.processMessageList(data, true);
											$mck_tab_message_option.removeClass('n-vis').addClass('vis');
											if (typeof (MCK_CALLBACK) === "function") {
												MCK_CALLBACK(params.tabId);
											}
										}
									}
									if (data.userDetails.length > 0) {
										$applozic.each(data.userDetails, function(i, userDetail) {
											MCK_USER_DETAIL_MAP[userDetail.userId] = userDetail;
											if (!params.isGroup) {
												if (userDetail.connected) {
													w.MCK_OL_MAP[userDetail.userId] = true;
												} else {
													w.MCK_OL_MAP[userDetail.userId] = false;
													if (typeof userDetail.lastSeenAtTime !== "undefined") {
														MCK_LAST_SEEN_AT_MAP[userDetail.userId] = userDetail.lastSeenAtTime;
													}
												}
												if (!IS_MCK_USER_DEACTIVATED) {
													if (!params.isGroup) {
														if (userDetail.blockedByThis) {
															MCK_BLOCKED_TO_MAP[userDetail.userId] = true;
															mckUserUtils.toggleBlockUser(params.tabId, true);
														} else if (userDetail.blockedByOther) {
															MCK_BLOCKED_BY_MAP[userDetail.userId] = true;
															$mck_tab_title.removeClass('mck-tab-title-w-status');
															$mck_tab_status.removeClass('vis').addClass('n-vis');
															$mck_typing_box.removeClass('vis').addClass('n-vis');
															$mck_msg_inner.data('blocked', false);
														} else {
															mckUserUtils.toggleBlockUser(params.tabId, false);
														}
													}
												}
											}
										});
									}
									if (data.groupFeeds.length > 0) {
										$applozic.each(data.groupFeeds, function(i, groupFeed) {
											mckGroupUtils.addGroup(groupFeed);
										});
									}
									if (data.conversationPxys.length > 0) {
										var tabConvArray = new Array();
										$applozic.each(data.conversationPxys, function(i, conversationPxy) {
											if (typeof conversationPxy === 'object') {
												tabConvArray.push(conversationPxy);
												MCK_CONVERSATION_MAP[conversationPxy.id] = conversationPxy;
												MCK_TOPIC_CONVERSATION_MAP[conversationPxy.topicId] = [ conversationPxy.id ];
												if (conversationPxy.topicDetail) {
													try {
														MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId] = $applozic.parseJSON(conversationPxy.topicDetail);
													} catch (ex) {
														w.console.log('Incorect Topic Detail!');
													}
												}
											}
										});
										if (isConvReq) {
											MCK_TAB_CONVERSATION_MAP[params.tabId] = tabConvArray;
											mckMessageLayout.addConversationMenu(params.tabId, params.isGroup);
										}
									}
									if (params.conversationId) {
										var conversationPxy = MCK_CONVERSATION_MAP[params.conversationId];
										if (typeof conversationPxy === 'object' && conversationPxy.closed) {
											mckMessageLayout.closeConversation();
										}
									}
									if (!params.startTime) {
										if (params.isGroup) {
											mckGroupLayout.addGroupStatus(mckGroupUtils.getGroup(params.tabId));
											mckMessageLayout.updateUnreadCount('group_' + params.tabId, 0, true);
										} else {
											mckMessageLayout.updateUnreadCount('user_' + params.tabId, 0, true);
										}
										if (typeof callback === 'function') {
											callback(params);
										}
									}
								}
							}
						} else {
							if (data + '' === "null" || typeof data.message === "undefined" || data.message.length === 0) {
								if (params.startTime) {
									$mck_show_more_icon.removeClass('n-vis').addClass('vis');
									$mck_show_more_icon.fadeOut(3000, function() {
										$mck_show_more_icon.removeClass('vis').addClass('n-vis');
									});
								} else {
									$mck_no_contact_text.removeClass('n-vis').addClass('vis');
								}
								$mck_contacts_inner.data('datetime', '');
							}
							if (data + '' !== "null" && data.status !== 'error') {
								w.MCK_OL_MAP = [];
								if (data.userDetails.length > 0) {
									$applozic.each(data.userDetails, function(i, userDetail) {
										MCK_USER_DETAIL_MAP[userDetail.userId] = userDetail;
										if (userDetail.connected) {
											w.MCK_OL_MAP[userDetail.userId] = true;
										} else {
											w.MCK_OL_MAP[userDetail.userId] = false;
											if (typeof userDetail.lastSeenAtTime !== "undefined") {
												MCK_LAST_SEEN_AT_MAP[userDetail.userId] = userDetail.lastSeenAtTime;
											}
										}
										mckMessageLayout.updateUnreadCount('user_' + userDetail.userId, userDetail.unreadCount, false);
										var contact = mckMessageLayout.getContact('' + userDetail.userId);
										(typeof contact === 'undefined') ? mckMessageLayout.createContactWithDetail(userDetail) : mckMessageLayout.updateContactDetail(contact, userDetail);
									});
								}
								if (data.groupFeeds.length > 0) {
									$applozic.each(data.groupFeeds, function(i, groupFeed) {
										mckMessageLayout.updateUnreadCount('group_' + groupFeed.id, groupFeed.unreadCount, false);
										mckGroupUtils.addGroup(groupFeed);
									});
								}
								if (data.blockedUserPxyList.blockedToUserList.length > 0) {
									$applozic.each(data.blockedUserPxyList.blockedToUserList, function(i, blockedToUser) {
										if (blockedToUser.userBlocked) {
											MCK_BLOCKED_TO_MAP[blockedToUser.blockedTo] = true;
										}
									});
								}
								if (data.blockedUserPxyList.blockedByUserList.length > 0) {
									$applozic.each(data.blockedUserPxyList.blockedByUserList, function(i, blockedByUser) {
										if (blockedByUser.userBlocked) {
											MCK_BLOCKED_BY_MAP[blockedByUser.blockedBy] = true;
										}
									});
								}
								if (data.conversationPxys.length > 0) {
									$applozic.each(data.conversationPxys, function(i, conversationPxy) {
										MCK_CONVERSATION_MAP[conversationPxy.id] = conversationPxy;
										MCK_TOPIC_CONVERSATION_MAP[conversationPxy.topicId] = [ conversationPxy.id ];
										if (conversationPxy.topicDetail) {
											try {
												MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId] = $applozic.parseJSON(conversationPxy.topicDetail);
											} catch (ex) {
												w.console.log('Incorect Topic Detail!');
											}
										}
									});
								}
								if (isMessages) {
									if (params.startTime) {
										mckMessageLayout.addContactsFromMessageList(data, false);
										mckStorage.updateMckMessageArray(data.message);
									} else {
										mckMessageLayout.addContactsFromMessageList(data, true);
										mckStorage.setMckMessageArray(data.message);
										$mck_contacts_inner.animate({
											scrollTop : 0
										}, 0);
									}
								} else {
									$mck_contacts_inner.data('datetime', '');
								}
							}
						}
						$mck_loading.removeClass('vis').addClass('n-vis');
						$mck_msg_loading.removeClass('vis').addClass('n-vis');
					},
					error : function() {
						CONTACT_SYNCING = false;
						MESSAGE_SYNCING = false;
						$mck_loading.removeClass('vis').addClass('n-vis');
						$mck_msg_loading.removeClass('vis').addClass('n-vis');
						w.console.log('Unable to load messages. Please reload page.');
					}
				});
			};
			_this.updateContactList = function(tabId, isGroup) {
				var tabExpr = (isGroup) ? "groupId=" + tabId : "userId=" + encodeURIComponent(tabId);
				var paramData = "startIndex=0&pageSize=1&" + tabExpr;
				$applozic.ajax({
					url : MCK_BASE_URL + MESSAGE_LIST_URL,
					data : paramData,
					global : false,
					type : 'get',
					success : function(data) {
						if (data + '' === "null" || typeof data.message === "undefined" || data.message.length === 0) {
							mckMessageLayout.clearContactMessageData(tabId, isGroup);
						} else {
							var message = data.message[0];
							if (typeof message !== 'undefined') {
								(message.groupId) ? mckMessageLayout.addGroupFromMessage(message, true) : mckMessageLayout.addContactsFromMessage(message, true);
							}
						}
					},
					error : function() {
						mckMessageLayout.clearContactMessageData(tabId, isGroup);
					}
				});
			};
			_this.sendDeliveryUpdate = function(message) {
				var data = "key=" + message.pairedMessageKey;
				$applozic.ajax({
					url : MCK_BASE_URL + MESSAGE_DELIVERY_UPDATE_URL,
					data : data,
					global : false,
					type : 'get',
					success : function() {},
					error : function() {}
				});
			};
			_this.sendReadUpdate = function(key) {
				if (typeof key !== "undefined" && key !== "") {
					var data = "key=" + key;
					$applozic.ajax({
						url : MCK_BASE_URL + MESSAGE_READ_UPDATE_URL,
						data : data,
						global : false,
						type : 'get',
						success : function() {},
						error : function() {}
					});
				}
			};
			_this.conversationReadUpdate = function(tabId, isGroup) {
				var ucTabId = (isGroup) ? 'group_' + tabId : 'user_' + tabId;
				if (tabId && (mckMessageLayout.getUnreadCount(ucTabId) > 0)) {
					var data = (isGroup) ? "groupId=" + tabId : "userId=" + encodeURIComponent(tabId);
					$applozic.ajax({
						url : MCK_BASE_URL + CONVERSATION_READ_UPDATE_URL,
						data : data,
						global : false,
						type : 'get',
						success : function() {
							mckMessageLayout.updateUnreadCount(ucTabId, 0, true);
						},
						error : function() {}
					});
				}
			};
			_this.getConversationId = function(params) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				if (!params.isGroup && !params.isMessage && (params.topicStatus !== CONVERSATION_STATUS_MAP[1])) {
					var conversationId = MCK_TOPIC_CONVERSATION_MAP[params.topicId];
					if (conversationId) {
						conversationPxy = MCK_CONVERSATION_MAP[conversationId];
						if (typeof conversationPxy === 'object') {
							$mck_msg_inner.data('mck-conversationid', conversationPxy.id);
							params.conversationId = conversationPxy.id;
							if (typeof MCK_TAB_CONVERSATION_MAP[params.tabId] !== 'undefined') {
								var tabConvArray = MCK_TAB_CONVERSATION_MAP[params.tabId];
								tabConvArray.push(conversationPxy);
								MCK_TAB_CONVERSATION_MAP[params.tabId] = tabConvArray;
							}
							mckMessageLayout.loadTab(params);
							return;
						}
					}
				}
				if (params.topicId) {
					var conversationPxy = {
						'topicId' : params.topicId,
						'userId' : params.tabId,
						'status' : params.topicStatus
					};
					if (params.isGroup) {
						conversationPxy.supportIds = [];
						conversationPxy.supportIds.push(params.supportId);
					}
					var topicDetail = MCK_TOPIC_DETAIL_MAP[params.topicId];
					if (typeof topicDetail === 'object') {
						conversationPxy.topicDetail = w.JSON.stringify(topicDetail);
					}
					if (params.fallBackTemplatesList && params.fallBackTemplatesList.length > 0) {
						conversationPxy.fallBackTemplatesList = params.fallBackTemplatesList;
					}
					$applozic.ajax({
						url : MCK_BASE_URL + CONVERSATION_ID_URL,
						global : false,
						data : w.JSON.stringify(conversationPxy),
						type : 'post',
						contentType : 'application/json',
						success : function(data) {
							if (typeof data === 'object' && data.status === "success") {
								var groupPxy = data.response;
								if (typeof groupPxy === 'object' && groupPxy.conversationPxy !== 'undefined') {
									var conversationPxy = groupPxy.conversationPxy;
									MCK_CONVERSATION_MAP[conversationPxy.id] = conversationPxy;
									MCK_TOPIC_CONVERSATION_MAP[conversationPxy.topicId] = [ conversationPxy.id ];
									if (conversationPxy.topicDetail) {
										try {
											MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId] = $applozic.parseJSON(conversationPxy.topicDetail);
										} catch (ex) {
											w.console.log('Incorect Topic Detail!');
										}
									}
									$mck_msg_inner.data('mck-conversationid', conversationPxy.id);
									params.conversationId = conversationPxy.id;
									if (typeof MCK_TAB_CONVERSATION_MAP[params.tabId] !== 'undefined') {
										var tabConvArray = MCK_TAB_CONVERSATION_MAP[params.tabId];
										tabConvArray.push(conversationPxy);
										MCK_TAB_CONVERSATION_MAP[params.tabId] = tabConvArray;
									}
									if (params.isGroup) {
										var group = mckGroupUtils.addGroup(groupPxy);
										params.tabId = group.contactId;
									}
									(params.isMessage && conversationPxy.created) ? mckMessageLayout.loadTab(params, _this.dispatchMessage) : mckMessageLayout.loadTab(params);
								}
							}
						},
						error : function() {}
					});
				}
			};
			_this.fetchConversationByTopicId = function(params) {
				var reqdata = 'topic=' + params.topicId;
				if (params.tabId) {
					reqdata += ('' + params.isGroup === 'true') ? '&groupId=' + params.tabId : '&userId=' + encodeURIComponent(params.tabId);
				} else if (params.clientGroupId) {
					reqdata += '&clientGroupId=' + params.clientGroupId;
				} else {
					return false;
				}
				if (params.pageSize) {
					reqdata += '&pageSize=' + params.pageSize;
				}
				$applozic.ajax({
					url : MCK_BASE_URL + CONVERSATION_FETCH_URL,
					data : reqdata,
					type : 'get',
					success : function(data) {
						if (typeof data === 'object' && data.status === "success") {
							var conversationList = data.response;
							if (conversationList.length > 0) {
								$applozic.each(conversationList, function(i, conversationPxy) {
									MCK_CONVERSATION_MAP[conversationPxy.id] = conversationPxy;
									MCK_TOPIC_CONVERSATION_MAP[conversationPxy.topicId] = [ conversationPxy.id ];
									if (conversationPxy.topicDetail) {
										try {
											MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId] = $applozic.parseJSON(conversationPxy.topicDetail);
										} catch (ex) {
											w.console.log('Incorect Topic Detail!');
										}
									}
									if (params.tabId && typeof MCK_TAB_CONVERSATION_MAP[params.tabId] !== 'undefined') {
										var tabConvArray = MCK_TAB_CONVERSATION_MAP[params.tabId];
										tabConvArray.push(conversationPxy);
										MCK_TAB_CONVERSATION_MAP[params.tabId] = tabConvArray;
									}
								})
							}
							if (params.isExtMessageList) {
								if (conversationList.length > 0) {
									params.conversationId = conversationList[0].id;
									params.pageSize = 50;
									mckMessageService.getMessageList(params);
								} else {
									if (typeof params.callback === 'function') {
										var resp = {};
										if (params.tabId) {
											resp.id = params.tabId;
											resp.isGroup = params.isGroup;
										} else if (params.clientGroupId) {
											resp.clientGroupId = params.clientGroupId;
										}
										resp.topicId = params.topicId;
										resp.status = "success";
										resp.messages = [];
										params.callback(resp);
									}
								}
							}
						} else {
							if (params.isExtMessageList && typeof params.callback === 'function') {
								var resp = {};
								if (params.tabId) {
									resp.id = params.tabId;
								} else if (params.clientGroupId) {
									resp.clientGroupId = params.clientGroupId;
								}
								resp.topicId = params.topicId;
								resp.status = "error";
								resp.errorMessage = 'Unable to process request. Please try again.';
								params.callback(resp);
							}
						}
					},
					error : function() {
						if (typeof params.callback === 'function') {
							var resp = {};
							if (params.tabId) {
								resp.id = params.tabId;
							} else if (params.clientGroupId) {
								resp.clientGroupId = params.clientGroupId;
							}
							resp.topicId = params.topicId;
							resp.status = "error";
							resp.errorMessage = 'Unable to process request. Please try again.';
							params.callback(resp);
						}
					}
				});
			};
			_this.getTopicId = function(params) {
				if (params.conversationId) {
					var data = 'id=' + params.conversationId;
					$applozic.ajax({
						url : MCK_BASE_URL + TOPIC_ID_URL,
						data : data,
						global : false,
						type : 'get',
						async: (typeof params.async !== 'undefined') ? params.async : true,
						success : function(data) {
							if (typeof data === 'object' && data.status === 'success') {
								var conversationPxy = data.response;
								if (typeof conversationPxy === 'object') {
									MCK_TOPIC_CONVERSATION_MAP[conversationPxy.topicId] = [ params.conversationId ];
									MCK_CONVERSATION_MAP[params.conversationId] = conversationPxy;
									if (conversationPxy.topicDetail) {
										try {
											MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId] = $applozic.parseJSON(conversationPxy.topicDetail);
										} catch (ex) {
											w.console.log('Incorect Topic Detail!');
										}
									}
									if (typeof (MCK_PRICE_DETAIL) === "function" && params.priceText) {
										MCK_PRICE_DETAIL({
											'custId' : MCK_USER_ID,
											'suppId' : params.suppId,
											'productId' : conversationPxy.topicId,
											'price' : params.priceText
										});
										_this.sendConversationCloseUpdate(params.conversationId);
									}
									if (params.messageType && typeof params.message === 'object') {
										var tabId = (params.message.groupId) ? params.message.groupId : params.message.to;
										if (typeof MCK_TAB_CONVERSATION_MAP[tabId] !== 'undefined') {
											var tabConvArray = MCK_TAB_CONVERSATION_MAP[tabId];
											tabConvArray.push(conversationPxy);
											MCK_TAB_CONVERSATION_MAP[tabId] = tabConvArray;
										}
									    if (typeof params.populate !== 'undefined' ? params.populate : true) {
										     mckMessageLayout.populateMessage(params.messageType, params.message, params.notifyUser);
									    }
									}
								}
							}
						},
						error : function() {}
					});
				}
			};
			_this.sendConversationCloseUpdate = function(conversationId) {
				if (conversationId) {
					var data = "id=" + conversationId;
					$applozic.ajax({
						url : MCK_BASE_URL + CONVERSATION_CLOSE_UPDATE_URL,
						data : data,
						global : false,
						type : 'get',
						success : function() {},
						error : function() {}
					});
				}
			};
			_this.sendPriceMessage = function() {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var priceText = $mck_price_text_box.val();
				if (priceText === "") {
					$mck_price_text_box.addClass('mck-text-req');
					return;
				}
				priceText = $applozic.trim(priceText);
				var tabId = $mck_msg_to.val();
				var conversationId = $mck_msg_inner.data('mck-conversationid', conversationId);
				var messagePxy = {
					"type" : 5,
					"contentType" : 4,
					"message" : priceText
				};
				if ($mck_msg_inner.data("isgroup") === true) {
					messagePxy.groupId = tabId;
				} else {
					messagePxy.to = tabId;
				}
				if ($mck_msg_inner.data('mck-conversationid')) {
					var conversationId = $mck_msg_inner.data('mck-conversationid');
					messagePxy.conversationId = conversationId;
					var conversationPxy = MCK_CONVERSATION_MAP[conversationId];
					if (conversationPxy !== 'object') {
						_this.getTopicId({
							'conversationId' : conversationId,
							'suppId' : tabId,
							'priceText' : priceText
						});
					} else if (typeof (MCK_PRICE_DETAIL) === "function") {
						MCK_PRICE_DETAIL({
							'custId' : MCK_USER_ID,
							'suppId' : tabId,
							'productId' : conversationPxy.topicId,
							'price' : priceText
						});
					}
					$mck_price_text_box.val("");
				}
				_this.sendMessage(messagePxy);
			};
			_this.dispatchMessage = function(params) {
				if (params.messagePxy === 'object') {
					var messagePxy = params.messagePxy;
					if (params.topicId) {
						var topicDetail = MCK_TOPIC_DETAIL_MAP[params.topicId];
						if (typeof topicDetail === 'object' && topicDetail.title !== 'undefined') {
							if (!messagePxy.message) {
								messagePxy.message = $applozic.trim(topicDetail.title);
							}
							if (params.conversationId) {
								messagePxy.conversationId = params.conversationId;
							} else if (params.topicId) {
								var conversationPxy = {
									'topicId' : params.topicId
								};
								if (typeof topicDetail === "object") {
									conversationPxy.topicDetail = w.JSON.stringify(topicDetail);
								}
								messagePxy.conversationPxy = conversationPxy;
							}
						}
						if (!messagePxy.message && topicDetail.link) {
							var fileMeta = {
								"blobKey" : $applozic.trim(topicDetail.link),
								"contentType" : "image/png"
							};
							messagePxy.fileMeta = fileMeta;
							messagePxy.contentType = 5;
							FILE_META = [];
							FILE_META.push(fileMeta);
						}
					}
					if (params.isGroup) {
						messagePxy.groupId = params.tabId;
					} else {
						messagePxy.to = params.tabId;
					}
					_this.sendMessage(messagePxy);
				}
			};
			_this.getGroup = function(params) {
				var usersArray = [];
				$applozic.each(params.users, function(i, user) {
					if (typeof user.userId !== "undefined") {
						usersArray.push(user);
					}
				});
				var groupInfo = {
					'groupName' : $applozic.trim(params.groupName),
					'users' : usersArray,
					'type' : params.type
				};
				if (params.clientGroupId) {
					groupInfo.clientGroupId = params.clientGroupId;
				}
				if (params.groupIcon) {
					groupInfo.imageUrl = params.groupIcon;
				}
				var response = new Object();
				$applozic.ajax({
					url : MCK_BASE_URL + GROUP_CREATE_URL,
					global : false,
					data : w.JSON.stringify(groupInfo),
					type : 'post',
					contentType : 'application/json',
					success : function(data) {
						if (params.isInternal) {
							$mck_btn_group_create.attr('disabled', false);
							$mck_btn_group_create.html('Create Group');
						}
						if (typeof data === 'object' && data.status === "success") {
							var groupPxy = data.response;
							if (typeof groupPxy === 'object') {
								var group = mckGroupUtils.addGroup(groupPxy);
								if (groupPxy.users.length > 0) {
									$applozic.each(groupPxy.users, function(i, userDetail) {
										MCK_USER_DETAIL_MAP[userDetail.userId] = userDetail;
										if (userDetail.connected) {
											w.MCK_OL_MAP[userDetail.userId] = true;
										} else {
											w.MCK_OL_MAP[userDetail.userId] = false;
											if (typeof userDetail.lastSeenAtTime !== "undefined") {
												MCK_LAST_SEEN_AT_MAP[userDetail.userId] = userDetail.lastSeenAtTime;
											}
										}
										mckMessageLayout.updateUnreadCount('user_' + userDetail.userId, userDetail.unreadCount, false);
										var contact = mckMessageLayout.getContact('' + userDetail.userId);
										(typeof contact === 'undefined') ? mckMessageLayout.createContactWithDetail(userDetail) : mckMessageLayout.updateContactDetail(contact, userDetail);
									});
								}
								params.tabId = group.contactId;
								params.isGroup = true;
								params.prepend = true;
								if (params.isMessage) {
									mckMessageLayout.loadTab(params, _this.dispatchMessage);
								} else {
									mckMessageLayout.loadTab(params);
									if (params.isInternal) {
										setTimeout(function() {
											$mck_group_info_btn.trigger('click');
										}, 100);
									}
								}
								if (typeof params.callback === 'function') {
									response.status = 'success';
									response.data = group;
									params.callback(response);
								}
							}
							mckStorage.clearMckMessageArray();
						} else if (data.status === "error") {
							if (typeof params.callback === 'function') {
								response.status = 'error';
								response.errorMessage = data.errorResponse[0].description;
								params.callback(response);
							}
						}
					},
					error : function() {
						if (params.isInternal) {
							$mck_btn_group_create.attr('disabled', false);
							$mck_btn_group_create.html('Create Group');
						}
						if (typeof params.callback === 'function') {
							response.status = 'error';
							response.errorMessage = 'Unable to process request.';
							params.callback(response);
						}
					}
				});
			};
		}

		function MckMessageLayout() {
			var _this = this;
			var emojiTimeoutId = '';
			var $mck_search = $applozic("#mck-search");
			var $mck_msg_to = $applozic("#mck-msg-to");
			var $file_name = $applozic(".mck-file-lb");
			var $file_size = $applozic(".mck-file-sz");
			var $mck_sidebox = $applozic("#mck-sidebox");
			var $mck_file_box = $applozic("#mck-file-box");
			var $mck_msg_sbmt = $applozic("#mck-msg-sbmt");
			var $mck_msg_form = $applozic("#mck-msg-form");
			var $mck_text_box = $applozic("#mck-text-box");
			var $mck_tab_info = $applozic("#mck-tab-info");
			var $mck_write_box = $applozic("#mck-write-box");
			var $mck_msg_error = $applozic("#mck-msg-error");
			var $mck_show_more = $applozic("#mck-show-more");
			var $mck_msg_cell = $applozic("#mck-message-cell");
			var $mck_typing_box = $applozic(".mck-typing-box");
			var $mck_product_box = $applozic("#mck-product-box");
			var $mck_search_list = $applozic("#mck-search-list");
			var $mck_loading = $applozic("#mck-contact-loading");
			var $mck_attachfile_box = $applozic("#mck-file-up2");
			var $mck_contact_list = $applozic("#mck-contact-list");
			var $mck_price_widget = $applozic("#mck-price-widget");
			var $mck_msg_response = $applozic("#mck-msg-response");
			var $mck_product_icon = $applozic(".mck-product-icon");
			var $mck_atttachmenu_box = $applozic("#mck-btn-attach");
			var $mck_product_title = $applozic(".mck-product-title");
			var $mck_response_text = $applozic("#mck_response_text");
			var $li_mck_block_user = $applozic("#li-mck-block-user");
			var $mck_delete_button = $applozic("#mck-delete-button");
			var $mck_tab_header = $applozic("#mck-tab-header");
			var $li_mck_leave_group = $applozic("#li-mck-leave-group");
			var $mck_sidebox_search = $applozic("#mck-sidebox-search");
			var $mck_group_info_tab = $applozic("#mck-group-info-tab");
			var $mck_group_create_tab = $applozic("#mck-group-create-tab");
			var $mck_search_tab_link = $applozic("#mck-search-tab-box li a");
			var $mck_contact_search_tab = $applozic("#mck-contact-search-tab");
			var $mck_search_loading = $applozic("#mck-search-loading");
			var $mck_group_search_tab = $applozic("#mck-group-search-tab");
			var $mck_contacts_inner = $applozic(".mck-contacts-inner");
			var $mck_contact_search_input = $applozic("#mck-contact-search-input");
			var $mck_contact_search_input_box = $applozic("#mck-contact-search-input-box");
			var $mck_group_search_input_box = $applozic("#mck-group-search-input-box");
			var $mck_group_search_input = $applozic("#mck-group-search-input");
			var $mck_group_tab_title = $applozic("#mck-group-tab-title");
			var $mck_no_contact_text = $applozic("#mck-no-contact-text");
			var $mck_sidebox_content = $applozic("#mck-sidebox-content");
			var $mck_group_info_close = $applozic("#mck-group-info-close");
			var $mck_tab_option_panel = $applozic("#mck-tab-option-panel");
			var $mck_contacts_content = $applozic("#mck-contacts-content");
			var $mck_tab_conversation = $applozic("#mck-tab-conversation");
			var $mck_product_subtitle = $applozic(".mck-product-subtitle");
			var $mck_conversation_list = $applozic("#mck-conversation-list");
			var $product_box_caret = $applozic("#mck-product-box .mck-caret");
			var $mck_tab_message_option = $applozic(".mck-tab-message-option");
			var $modal_footer_content = $applozic(".mck-box-ft .mck-box-form");
			var $mck_typing_box_text = $applozic(".mck-typing-box .name-text");
			var $mck_group_menu_options = $applozic(".mck-group-menu-options");
			var $mck_contact_search_box = $applozic("#mck-contact-search-box");
			var $mck_no_search_contacts = $applozic("#mck-no-search-contacts");
			var $mck_no_search_groups = $applozic("#mck-no-search-groups");
			var $mck_contact_search_list = $applozic("#mck-contact-search-list");
			var $mck_group_search_list = $applozic("#mck-group-search-list");
			var $mck_conversation_header = $applozic("#mck-conversation-header");
			var $mck_tab_title = $applozic("#mck-tab-individual .mck-tab-title");
			var $mck_tab_status = $applozic("#mck-tab-individual .mck-tab-status");
			var $mck_individual_tab_title = $applozic("#mck-individual-tab-title");
			var $mck_product_up_key = $applozic(".mck-product-rt-up .mck-product-key");
			var $mck_product_up_value = $applozic(".mck-product-rt-up .mck-product-value");
			var $mck_product_down_key = $applozic(".mck-product-rt-down .mck-product-key");
			var $mck_product_down_value = $applozic(".mck-product-rt-down .mck-product-value");
			var FILE_PREVIEW_URL = "/rest/ws/aws/file/";
			var LINK_EXPRESSION = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
			var LINK_MATCHER = new RegExp(LINK_EXPRESSION);
			var markup = '<div name="message" class="bubble mck-m-b ${msgKeyExpr} ${msgFloatExpr} ${msgAvatorClassExpr}" data-msgdelivered="${msgDeliveredExpr}" data-msgsent="${msgSentExpr}" data-msgtype="${msgTypeExpr}" data-msgtime="${msgCreatedAtTime}" data-msgcontent="${replyIdExpr}" data-msgkey="${msgKeyExpr}" data-contact="${toExpr}"><div class="mck-clear"><div class="blk-lg-12"><div class="mck-msg-avator blk-lg-3">{{html msgImgExpr}}</div><div class="mck-msg-box ${msgClassExpr}">' + '<div class="${nameTextExpr} ${showNameExpr}">${msgNameExpr}</div><div class="mck-file-text notranslate mck-attachment n-vis" data-filemetakey="${fileMetaKeyExpr}" data-filename="${fileNameExpr}" data-filesize="${fileSizeExpr}">{{html fileExpr}}</div>' + '<div class="mck-msg-text mck-msg-content"></div>' + '</div></div>' + '<div class="${msgFloatExpr}-muted mck-text-light mck-text-muted mck-text-xs mck-t-xs">${createdAtTimeExpr} <span class="${statusIconExpr} mck-message-status"></span></div>' + '</div><div class="n-vis mck-context-menu">' + '<ul><li><a class="mck-message-delete">Delete</a></li></ul></div></div>';
			var searchContactbox = '<li id="li-${contHtmlExpr}" class="${contIdExpr}"><span class="mck-contact-search-tab" href="#" data-mck-id="${contIdExpr}" data-isgroup="${contTabExpr}"><div class="mck-row" title="${contNameExpr}">' + '<div class="blk-lg-3">{{html contImgExpr}}</div><div class="blk-lg-9"><div class="mck-row"><div class="blk-lg-12 mck-cont-name mck-truncate"><strong>${contNameExpr}</strong></div><div class="blk-lg-12 mck-text-muted">${contLastSeenExpr}</div></div></div></div></span></li>';
			var contactbox = '<li id="li-${contHtmlExpr}" class="person ${contIdExpr}" data-mck-id="${contIdExpr}" data-isgroup="${contTabExpr}" data-mck-conversationid="${conversationExpr}" data-msg-time="${msgCreatedAtTimeExpr}"><div class="mck-row">' + '<div class="blk-lg-3"><span class="icon">{{html contImgExpr}}</span></div>' + '<div class="blk-lg-9"><div class="mck-row"><div class="blk-lg-8 name">${contNameExpr}</div>' + '<div class="blk-lg-4 time mck-truncate">${msgCreatedDateExpr}</div></div>' + '<div class="mck-row"><div class="blk-lg-8 mck-cont-msg-wrapper preview msgTextExpr"></div>' + '<div class="blk-lg-4 mck-unread-count-box unreadcount ${contUnreadExpr}"><span class="mck-unread-count-text text">{{html contUnreadCount}}</span></div></div></div></div></div>' + '</li>';
			var conversationbox = '<div class="chat mck-message-inner ${contIdExpr}" data-mck-id="${contIdExpr}" data-isgroup="${contTabExpr}" data-mck-conversationid="${conversationExpr}"></div>';
			var convbox = '<li id="li-${convIdExpr}" class="${convIdExpr}">' + '<a class="${mckLauncherExpr}" href="#" data-mck-conversationid="${convIdExpr}" data-mck-id="${tabIdExpr}" data-isgroup="${isGroupExpr}" data-mck-topicid="${topicIdExpr}" data-isconvtab="true">' + '<div class="mck-row mck-truncate" title="${convTitleExpr}">${convTitleExpr}</div>' + '</a></li>';
			$applozic.template("messageTemplate", markup);
			$applozic.template("contactTemplate", contactbox);
			$applozic.template("convTemplate", convbox);
			$applozic.template("searchContactbox", searchContactbox);
			$applozic.template("conversationTemplate", conversationbox);
			var $mck_msg_inner = $applozic("#mck-message-inner");
			_this.getMckMessageInner = function() {
				return $mck_msg_inner;
			}
			_this.openConversation = function() {
				if ($mck_sidebox.css('display') === 'none') {
					$applozic('.mckModal').mckModal('hide');
					$mck_sidebox.mckModal();
				}
				$mck_msg_to.focus();
			};
			_this.initEmojis = function() {
				try {
					$applozic("#mck-text-box").emojiarea({
						button : "#mck-btn-smiley",
						wysiwyg : true,
						menuPosition : 'top'
					});
				} catch (ex) {
					if (!emojiTimeoutId) {
						emojiTimeoutId = setTimeout(function() {
							_this.initEmojis();
						}, 30000);
					}
				}
			};
			_this.loadTab = function(params, callback) {
				$applozic('.mck-user-info-tab').removeClass('vis').addClass("n-vis");
				$applozic('.chat').removeClass('active-chat');
				$applozic('.left .person').removeClass('active');
				if (params.tabId) {
					if ($applozic('.person[data-mck-id ="' + params.tabId + '"][data-isgroup ="' + params.isGroup + '"]').length == 0) {
						_this.updateRecentConversationList(params.isGroup ? mckGroupUtils.getGroup(params.tabId) : _this.fetchContact(params.tabId), undefined, true, params.prepend);
					}
					$applozic('.person[data-mck-id ="' + params.tabId + '"][data-isgroup ="' + params.isGroup + '"]').addClass('active');
					var displayName = params.isGroup ? mckGroupLayout.getGroupDisplayName(params.tabId) : _this.fetchContact(params.tabId).displayName;
					$applozic('.right .top .name').html(displayName);
					$applozic('.chat[data-mck-id ="' + params.tabId + '"][data-isgroup ="' + params.isGroup + '"]').addClass('active-chat');
				}
				if ($applozic(".left .person.active").length > 0) {
					$mck_msg_inner = $applozic(".mck-message-inner[data-mck-id='" + params.tabId + "'][data-isgroup ='" + params.isGroup + "']");
				}
				if (params.tabId && params.isSearch) {
					$applozic(".mck-contacts-inner").scrollTop($applozic(".left .person.active").offset().top - $applozic(".mck-contacts-inner").offset().top + $applozic(".mck-contacts-inner").scrollTop());
				}
				var currTabId;
				if ($mck_msg_inner) {
					currTabId = $mck_msg_inner.data('mck-id');
				}
				if (currTabId) {
					if ($mck_text_box.html().length > 1 || $mck_file_box.hasClass('vis')) {
						var text = $mck_text_box.html();
						var tab_draft = {
							'text' : text,
							'files' : []
						};
						if ($mck_file_box.hasClass('vis')) {
							$applozic(".mck-file-box").each(function() {
								var $fileBox = $applozic(this);
								var file = {
									filelb : $fileBox.find('.mck-file-lb').html(),
									filesize : $fileBox.find('.mck-file-sz').html()
								};
								var fileMeta = $fileBox.data('mckfile');
								if (typeof fileMeta === 'object') {
									file.fileMeta = fileMeta;
								}
								tab_draft.files.push(file);
							});
						}
						TAB_MESSAGE_DRAFT[currTabId] = tab_draft;
					} else {
						delete TAB_MESSAGE_DRAFT[currTabId];
					}
				}
				_this.clearMessageField();
				_this.addDraftMessage(params.tabId);
				$mck_msg_error.html("");
				$mck_msg_error.removeClass('vis').addClass('n-vis');
				$mck_response_text.html("");
				$mck_msg_response.removeClass('vis').addClass('n-vis');
				$mck_msg_form[0].reset();
				$mck_msg_form.removeClass('n-vis').addClass('vis');
				$mck_write_box.removeClass('n-vis').addClass('vis');
				$mck_msg_inner.html("");
				$mck_msg_error.removeClass('mck-no-mb');
				$mck_group_info_close.trigger('click');
				$mck_group_create_tab.removeClass('vis').addClass('n-vis');
				$mck_contacts_content.removeClass('n-vis').addClass('vis');
				$modal_footer_content.removeClass('vis').addClass('n-vis');
				$mck_sidebox_search.removeClass('vis').addClass('n-vis');
				$mck_sidebox_content.removeClass('n-vis').addClass('vis');
				$mck_product_box.removeClass('vis').addClass('n-vis');
				$mck_conversation_header.addClass('n-vis');
				$mck_loading.removeClass('vis').addClass('n-vis');
				$mck_msg_inner.removeClass('mck-group-inner');
				$mck_tab_info.removeClass('mck-group-info-btn');
				$mck_tab_status.removeClass('vis').addClass('n-vis');
				$mck_tab_title.removeClass("mck-tab-title-w-status");
				$mck_tab_title.removeClass("mck-tab-title-w-typing");
				$mck_typing_box.removeClass('vis').addClass('n-vis');
				$mck_typing_box_text.html("");
				$mck_msg_inner.data('isgroup', params.isGroup);
				$mck_msg_inner.data('datetime', "");
				if (params.tabId) {
					$mck_msg_to.val(params.tabId);
					$mck_msg_inner.data('mck-id', params.tabId);
					$mck_msg_inner.data('mck-conversationid', params.conversationId);
					$mck_msg_inner.data('mck-topicid', params.topicId);
					$mck_tab_option_panel.data('tabId', params.tabId);
					$mck_tab_option_panel.removeClass('n-vis').addClass('vis');
					$mck_contacts_content.removeClass('vis').addClass('n-vis');
					$modal_footer_content.removeClass('n-vis').addClass('vis');
					$mck_delete_button.removeClass('n-vis').addClass('vis');
					$mck_group_menu_options.removeClass('vis').addClass('n-vis');
					if (params.isGroup) {
						$mck_msg_inner.addClass('mck-group-inner');
						$li_mck_block_user.removeClass('vis').addClass('n-vis');
						$mck_individual_tab_title.removeClass('vis').addClass('n-vis');
						$mck_group_tab_title.removeClass('n-vis').addClass('vis');
					} else {
						$li_mck_block_user.removeClass('n-vis').addClass('vis');
						$mck_group_tab_title.removeClass('vis').addClass('n-vis');
						$mck_individual_tab_title.removeClass('n-vis').addClass('vis');
					}
					if (!params.topicId && params.conversationId) {
						var conversationPxy = MCK_CONVERSATION_MAP[params.conversationId];
						if (typeof conversationPxy === 'object') {
							params.topicId = conversationPxy.topicId;
						}
					}
					if (params.topicId) {
						var topicDetail = MCK_TOPIC_DETAIL_MAP[params.topicId];
						if (typeof topicDetail === "object") {
							if (IS_MCK_TOPIC_HEADER) {
								$mck_msg_inner.data('mck-title', topicDetail.title);
								$mck_conversation_header.html(topicDetail.title);
								$mck_conversation_header.removeClass('n-vis');
							} else if (IS_MCK_TOPIC_BOX) {
								_this.setProductProperties(topicDetail);
								$product_box_caret.addClass('n-vis');
								$mck_product_box.addClass('mck-product-box-wc');
								$mck_conversation_list.addClass('n-vis');
								$mck_product_box.removeClass('n-vis').addClass('vis');
							}
						}
					}
					if (IS_MCK_LOCSHARE && w.google && typeof (w.google.maps) === 'object') {
						$mck_attachfile_box.removeClass("vis").addClass('n-vis');
						$mck_atttachmenu_box.removeClass("n-vis").addClass("vis");
					} else {
						$mck_atttachmenu_box.removeClass("vis").addClass("n-vis");
						$mck_attachfile_box.removeClass("n-vis").addClass('vis');
					}
					var name = _this.getTabDisplayName(params.tabId, params.isGroup, params.userName);
					$mck_tab_title.html(name);
					$mck_tab_title.attr('title', name);
					$mck_tab_conversation.removeClass('vis').addClass('n-vis');
					$mck_tab_header.removeClass('n-vis').addClass('vis');
					if (MCK_MODE === 'support') {
						$applozic('.mck-tab-link').removeClass('vis').addClass('n-vis');
					}
					if (MCK_PRICE_WIDGET_ENABLED) {
						$mck_price_widget.removeClass('n-vis').addClass('vis');
						$mck_msg_inner.addClass('mck-msg-w-panel');
					}
					if (IS_MCK_USER_DEACTIVATED) {
						$mck_msg_error.html("Deactivated");
						$mck_msg_error.removeClass('n-vis').addClass('vis').addClass('mck-no-mb');
						$mck_write_box.removeClass('vis').addClass('n-vis');
					}

					mckInitializeChannel.subscibeToTypingChannel(params.tabId, params.isGroup);
					if (typeof MCK_ON_TAB_CLICKED === 'function') {
							MCK_ON_TAB_CLICKED({
                  tabId: params.tabId,
                  isGroup: params.isGroup
              });
          }
					var contact = (params.isGroup) ? mckGroupUtils.getGroup(params.tabId) : mckMessageLayout.getContact(params.tabId);
					var contactHtmlExpr = (contact.isGroup) ? 'group-' + contact.htmlId : 'user-' + contact.htmlId;
					$applozic("#li-" + contactHtmlExpr + " .mck-unread-count-box").removeClass("vis").addClass("n-vis");
					$mck_msg_inner.bind('scroll', function() {
						if ($mck_msg_inner.scrollTop() === 0) {
							var tabId = $mck_msg_inner.data("mck-id");
							if (typeof tabId === "undefined" || tabId === "") {
								return;
							}
							var isGroup = $mck_msg_inner.data('isgroup');
							var conversationId = $mck_msg_inner.data('mck-conversationid');
							conversationId = (conversationId) ? conversationId.toString() : "";
							var startTime = $mck_msg_inner.data('datetime');
							if (startTime > 0 && !MESSAGE_SYNCING) {
								mckMessageService.loadMessageList({
									'tabId' : tabId,
									'isGroup' : isGroup,
									'conversationId' : conversationId,
									'startTime' : startTime
								});
							}
						}
					});
					$mck_text_box.focus();
				} else {
					params.tabId = "";
					$mck_tab_header.removeClass('vis').addClass('n-vis');
					$mck_tab_conversation.removeClass('n-vis').addClass('vis');
					$mck_product_box.removeClass('vis').addClass('n-vis');
					$mck_msg_inner.data('mck-id', "");
					$mck_msg_inner.data('mck-conversationid', "");
					$mck_msg_inner.data('mck-topicid', "");
					$mck_price_widget.removeClass('vis').addClass('n-vis');
					$mck_msg_inner.removeClass('mck-msg-w-panel');
					$mck_tab_option_panel.removeClass('vis').addClass('n-vis');
					$mck_delete_button.removeClass('vis').addClass('n-vis');
					$mck_msg_to.val('');
					var mckMessageArray = mckStorage.getMckMessageArray();
					mckInitializeChannel.unsubscibeToTypingChannel();
					if (mckMessageArray !== null && mckMessageArray.length > 0) {
						mckMessageLayout.addContactsFromMessageList({
							message : mckMessageArray
						}, true);
						$mck_contacts_inner.animate({
							scrollTop : 0
						}, 0);
						_this.openConversation();
						return;
					}
				}
				mckMessageService.loadMessageList(params, callback);
				_this.openConversation();
			};
			_this.setProductProperties = function(topicDetail) {
				$mck_product_title.html(topicDetail.title);
				$mck_product_icon.html(_this.getTopicLink(topicDetail.link));
				var subtitle = (topicDetail.subtitle) ? topicDetail.subtitle : "";
				$mck_product_subtitle.html(subtitle);
				var key1 = (topicDetail.key1) ? topicDetail.key1 : "";
				var value1 = (topicDetail.value1) ? topicDetail.value1 : "";
				$mck_product_up_key.html(key1);
				$mck_product_up_value.html(value1);
				var key2 = (topicDetail.key2) ? topicDetail.key2 : "";
				var value2 = (topicDetail.value2) ? topicDetail.value2 : "";
				$mck_product_down_key.html(key2);
				$mck_product_down_value.html(value2);
			};
			_this.getTopicLink = function(topicLink) {
				return (topicLink) ? '<img src="' + topicLink + '">' : '<span class="mck-icon-no-image"></span>';
			};
			_this.processMessageList = function(data, scroll) {
				var showMoreDateTime;
				var $scrollToDiv = $mck_msg_inner.children("div[name='message']:first");
				var tabId = $mck_msg_inner.data('mck-id');
				var isGroup = $mck_msg_inner.data('isgroup');
				var contact = (isGroup) ? mckGroupUtils.getGroup(tabId) : mckMessageLayout.fetchContact(tabId);
				if (typeof data.message.length === "undefined") {
					_this.addMessage(data.message, contact, false, false, true);
					showMoreDateTime = data.createdAtTime;
				} else {
					$applozic.each(data.message, function(i, message) {
						if (typeof message.to !== "undefined") {
							_this.addMessage(message, contact, false, false, true);
							showMoreDateTime = message.createdAtTime;
						}
					});
				}
				$applozic(".mck-message-inner.active-chat").data('datetime', showMoreDateTime);
				if (!scroll && $scrollToDiv.length > 0) {
					$applozic(".mck-message-inner.active-chat").scrollTop($scrollToDiv.offset().top - $mck_msg_inner.offset().top + $mck_msg_inner.scrollTop());
				} else if (scroll) {
					$mck_msg_inner.animate({
						scrollTop : $mck_msg_inner.prop("scrollHeight")
					}, 'fast');
				}
			};
			_this.closeConversation = function(data) {
				if (typeof MCK_DISPLAY_TEXT === 'function') {
					var displayText = MCK_DISPLAY_TEXT();
					if (typeof displayText === 'object') {
						var text = (data === "BUSY_WITH_OTHER") ? displayText.onBusyWithOtherUser : displayText.onConversationClose;
					}
				}
				if (!text) {
					text = 'Chat disabled with user';
				}
				$mck_msg_error.html(text);
				$mck_msg_error.removeClass('n-vis').addClass('vis').addClass('mck-no-mb');
				$applozic("#mck-write-box").removeClass('vis').addClass('n-vis');
			};
			_this.addTooltip = function(msgKey) {
				$applozic("." + msgKey + " .mck-icon-time").attr('title', 'pending');
				$applozic("." + msgKey + " .mck-btn-trash").attr('title', 'delete');
				$applozic("." + msgKey + " .mck-icon-sent").attr('title', 'sent');
				$applozic("." + msgKey + " .mck-btn-forward").attr('title', 'forward message');
				$applozic("." + msgKey + " .mck-icon-delivered").attr('title', 'delivered');
				$applozic("." + msgKey + " .mck-icon-read").attr('title', 'delivered and read');
				$applozic("." + msgKey + " .msgtype-outbox-cr").attr('title', 'sent via Carrier');
				$applozic("." + msgKey + " .msgtype-outbox-mck").attr('title', 'sent');
				$applozic("." + msgKey + " .msgtype-inbox-cr").attr('title', 'received via Carrier');
				$applozic("." + msgKey + " .msgtype-inbox-mck").attr('title', 'recieved');
			};
			_this.fetchContact = function(contactId) {
				var contact = _this.getContact(contactId);
				if (typeof contact === 'undefined') {
					contact = _this.createContact(contactId);
				}
				return contact;
			};
			_this.getContact = function(contactId) {
				if (typeof MCK_CONTACT_MAP[contactId] === 'object') {
					return MCK_CONTACT_MAP[contactId];
				} else {
					return;
				}
			};
			_this.getContactDisplayName = function(userId) {
				if (typeof MCK_CONTACT_NAME_MAP[userId] === 'string') {
					return MCK_CONTACT_NAME_MAP[userId];
				} else {
					return;
				}
			};
			_this.addMessage = function(msg, contact, append, scroll, appendContextMenu) {
				if (msg.type === 6 || msg.type === 7) {
					return;
				}if(msg.contentType === 10 && msg.metadata.hide==="true"){
					return;
				}
				if ($applozic("#mck-message-cell .mck-no-data-text").length > 0) {
					$applozic(".mck-no-data-text").remove();
				}
				var messageClass = '';
				var floatWhere = "mck-msg-right";
				var statusIcon = "mck-icon-time";
				var contactExpr = "vis";
				if (msg.type === 0 || msg.type === 4 || msg.type === 6) {
					floatWhere = "mck-msg-left";
				}
				if (msg.contentType === 4 || msg.contentType === 10) {
					floatWhere = "mck-msg-center";
				}
				statusIcon = _this.getStatusIconName(msg);
				var replyId = msg.key;
				var replyMessageParameters = "'" + msg.deviceKey + "'," + "'" + msg.to + "'" + ",'" + msg.to + "'" + ",'" + replyId + "'";
				var displayName = "";
				var imgsrctag = "";
				var nameTextExpr = "";
				var showNameExpr = "n-vis";
				var msgAvatorClassExpr = "";
				if (msg.groupId && msg.contentType !== 4 && (msg.type === 0 || msg.type === 4 || msg.type === 6)) {
					showNameExpr = "vis";
					nameTextExpr = _this.getNameTextClassByAlphabet(displayName);
				}
				displayName = _this.getTabDisplayName(msg.to, false);
				if (MESSAGE_BUBBLE_AVATOR_ENABLED) {
					msgAvatorClassExpr = "mck-msg-avator-bubble";
					var fromContact = "";
					var fromDisplayName = displayName;
					if (floatWhere === "mck-msg-right") {
						fromContact = mckMessageLayout.fetchContact(MCK_USER_ID);
						fromDisplayName = _this.getTabDisplayName(fromContact.displayName, false);
					} else if (floatWhere === "mck-msg-left") {
						fromContact = (msg.groupId) ? mckMessageLayout.fetchContact(msg.to) : contact;
					}
					if (fromContact) {
						imgsrctag = _this.getContactImageLink(fromContact, fromDisplayName);
					}
				}
				if (msg.groupId && msg.contentType === 10) {
					displayName = "";
					imgsrctag = "";
					nameTextExpr = "";
				}
				if (!msg.groupId) {
					displayName = "";
				}
				if ($applozic(".mck-message-inner[data-mck-id='" + contact.contactId + "'][data-isgroup='" + contact.isGroup + "'] ." + msg.key).length > 0) {
					return;
				}
				var msgFeatExpr = "n-vis";
				var fileName = "";
				var fileSize = "";
				var frwdMsgExpr = msg.message;
				if (typeof msg.fileMeta === "object") {
					fileName = msg.fileMeta.name;
					fileSize = msg.fileMeta.size;
				}
				var msgList = [ {
					msgKeyExpr : msg.key,
					msgDeliveredExpr : msg.delivered,
					msgSentExpr : msg.sent,
					msgCreatedAtTime : msg.createdAtTime,
					msgTypeExpr : msg.type,
					msgSourceExpr : msg.source,
					statusIconExpr : statusIcon,
					contactExpr : contactExpr,
					toExpr : msg.to,
					msgAvatorClassExpr : msgAvatorClassExpr,
					showNameExpr : showNameExpr,
					msgNameExpr : displayName,
					msgImgExpr : imgsrctag,
					nameTextExpr : nameTextExpr,
					msgFloatExpr : floatWhere,
					replyIdExpr : replyId,
					createdAtTimeExpr : mckDateUtils.getDate(msg.createdAtTime),
					msgFeatExpr : msgFeatExpr,
					replyMessageParametersExpr : replyMessageParameters,
					msgClassExpr : messageClass,
					msgExpr : frwdMsgExpr,
					selfDestructTimeExpr : msg.timeToLive,
					fileMetaKeyExpr : msg.fileMetaKey,
					fileExpr : _this.getFilePath(msg),
					fileNameExpr : fileName,
					fileSizeExpr : fileSize
				} ];
				append ? $applozic.tmpl("messageTemplate", msgList).appendTo("#mck-message-cell .mck-message-inner-right") : $applozic.tmpl("messageTemplate", msgList).prependTo("#mck-message-cell .mck-message-inner-right");
				append ? $applozic.tmpl("messageTemplate", msgList).appendTo(".mck-message-inner[data-mck-id='" + contact.contactId + "'][data-isgroup='" + contact.isGroup + "']") : $applozic.tmpl("messageTemplate", msgList).prependTo(".mck-message-inner[data-mck-id='" + contact.contactId + "'][data-isgroup='" + contact.isGroup + "']");
				var emoji_template = "";
				if (msg.message) {
					var msg_text = msg.message.replace(/\n/g, '<br/>');
					if (w.emoji !== null && typeof w.emoji !== 'undefined') {
						emoji_template = w.emoji.replace_unified(msg_text);
						emoji_template = w.emoji.replace_colons(emoji_template);
					} else {
						emoji_template = msg_text;
					}
				}
				if (msg.conversationId) {
					var conversationPxy = MCK_CONVERSATION_MAP[msg.conversationId];
					if (typeof conversationPxy !== 'object') {
						mckMessageService.getTopicId({
							'conversationId' : msg.conversationId
						});
					}
					if (append) {
						$mck_msg_inner.data('mck-conversationid', msg.conversationId);
						if (conversationPxy) {
							var topicDetail = MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId];
							if (typeof topicDetail === "object") {
								if (IS_MCK_TOPIC_BOX) {
									_this.setProductProperties(topicDetail);
								} else if (IS_MCK_TOPIC_HEADER) {
									$mck_conversation_header.html(topicDetail.title);
								}
							}
						}
					}
				}
				if (msg.contentType === 4) {
					var priceText = emoji_template;
					emoji_template = "Final agreed price: " + emoji_template;
					if (!MCK_PRICE_WIDGET_ENABLED)
						emoji_template += '<br/><button class="mck-accept" data-mck-topic-price="' + priceText + '" data-mck-conversationid="' + msg.conversationId + '">Accept</button>';
				}
				var $textMessage = $applozic("." + replyId + " .mck-msg-content");
				if (emoji_template.indexOf('emoji-inner') === -1 && msg.contentType === 0) {
					var nodes = emoji_template.split("<br/>");
					for (var i = 0; i < nodes.length; i++) {
						var x = d.createElement('div');
						x.appendChild(d.createTextNode(nodes[i]));
						if (nodes[i] && nodes[i].match(LINK_MATCHER)) {
							x = $applozic(x).linkify({
								target : '_blank'
							});
						}
						$textMessage.append(x);
					}
				} else {
					$textMessage.html(emoji_template);
					$textMessage.linkify({
						target : '_blank'
					});
				}
				if (msg.fileMeta) {
					$applozic("." + replyId + " .mck-file-text a").trigger('click');
					$applozic("." + replyId + " .mck-file-text").removeClass('n-vis').addClass('vis');
					if ($textMessage.html() === "") {
						$textMessage.removeClass('vis').addClass('n-vis');
					}
				}
				if (msg.contentType === 2) {
					$textMessage.removeClass('vis').addClass('n-vis');
					$applozic("." + replyId + " .mck-file-text").removeClass('n-vis').addClass('vis');
				}
				if (scroll) {
					$mck_msg_inner.animate({
						scrollTop : $mck_msg_inner.prop("scrollHeight")
					}, 'fast');
				}
				if ($mck_tab_message_option.hasClass('n-vis')) {
					$mck_tab_message_option.removeClass('n-vis').addClass('vis');
				}
				_this.addTooltip(msg.key);
				if (msg.contentType !== 4 && msg.contentType !== 10 && appendContextMenu) {
					_this.messageContextMenu(msg.key);
				}
				if (msg.contentType === 10 && append) {
					if (msg.type === 5 && msg.source === 1) {
						return;
					}
					mckGroupService.getGroupFeed({
						'groupId' : msg.groupId,
						'isReloadTab' : true,
						'apzCallback' : mckGroupLayout.onGroupFeed
					});
				}
			};
			_this.getFilePath = function(msg) {
				if (msg.contentType === 2) {
					try {
						var geoLoc = $applozic.parseJSON(msg.message);
						if (geoLoc.lat && geoLoc.lon) {
							return '<a href="http://maps.google.com/maps?z=17&t=m&q=loc:' + geoLoc.lat + "," + geoLoc.lon + '" target="_blank"><img src="https://maps.googleapis.com/maps/api/staticmap?zoom=17&size=200x150&center=' + geoLoc.lat + "," + geoLoc.lon + '&maptype=roadmap&markers=color:red|' + geoLoc.lat + "," + geoLoc.lon + '"/></a>';
						}
					} catch (ex) {
						if (msg.message.indexOf(",") !== -1) {
							return '<a href="http://maps.google.com/maps?z=17&t=m&q=loc:' + msg.message + '" target="_blank"><img src="https://maps.googleapis.com/maps/api/staticmap?zoom=17&size=200x150&center=' + msg.message + '&maptype=roadmap&markers=color:red|' + msg.message + '" /></a>';
						}
					}
				}
				if (typeof msg.fileMeta === "object") {
					if (msg.fileMeta.contentType.indexOf("image") !== -1) {
						if (msg.fileMeta.contentType.indexOf("svg") !== -1) {
							return '<a href="#" role="link" class="file-preview-link fancybox-media fancybox" data-type="' + msg.fileMeta.contentType + '" data-url="' + MCK_FILE_URL + FILE_PREVIEW_URL + msg.fileMeta.blobKey + '" data-name="' + msg.fileMeta.name + '"><img src="' + MCK_FILE_URL + FILE_PREVIEW_URL + msg.fileMeta.blobKey + '" area-hidden="true"></img></a>';
						} else if (msg.contentType === 5) {
							return '<a href="#" role="link" class="file-preview-link fancybox-media fancybox" data-type="' + msg.fileMeta.contentType + '" data-url="' + msg.fileMeta.blobKey + '" data-name="' + msg.fileMeta.name + '"><img src="' + msg.fileMeta.blobKey + '" area-hidden="true"></img></a>';
						} else {
							return '<a href="#" role="link" class="file-preview-link fancybox-media fancybox" data-type="' + msg.fileMeta.contentType + '" data-url="' + MCK_FILE_URL + FILE_PREVIEW_URL + msg.fileMeta.blobKey + '" data-name="' + msg.fileMeta.name + '"><img src="' + msg.fileMeta.thumbnailUrl + '" area-hidden="true" ></img></a>';
						}
					} else if (msg.fileMeta.contentType.indexOf("video") !== -1) {
					    return '<video controls class="mck-video-player">' + '<source src="' + MCK_FILE_URL + FILE_PREVIEW_URL + msg.fileMeta.blobKey + '" type="video/mp4">' + '<source src="' + MCK_FILE_URL + FILE_PREVIEW_URL + msg.fileMeta.blobKey + '" type="video/ogg">Your browser does not support the video tag.</video>';
					} else if (msg.fileMeta.contentType.indexOf("audio") !== -1) {
						return '<audio controls class="mck-audio-player">' + '<source src="' + MCK_FILE_URL + FILE_PREVIEW_URL + msg.fileMeta.blobKey + '" type="audio/ogg">' + '<source src="' + MCK_FILE_URL + FILE_PREVIEW_URL + msg.fileMeta.blobKey + '" type="audio/mpeg">Audio element not supported.</audio>' + '<p class="mck-file-tag"><span class="file-name">' + msg.fileMeta.name + '</span>&nbsp;<span class="file-size">' + mckFileService.getFilePreviewSize(msg.fileMeta.size) + '</span></p>';
					} else {
						return '<a href="' + MCK_FILE_URL + FILE_PREVIEW_URL + msg.fileMeta.blobKey + '" role="link" class="file-preview-link" target="_blank"><span class="file-detail"><span class="mck-file-name"><span class="mck-icon-attachment"></span>&nbsp;' + msg.fileMeta.name + '</span>&nbsp;<span class="file-size">' + mckFileService.getFilePreviewSize(msg.fileMeta.size) + '</span></span></a>';
					}
				}
				return "";
			};
			_this.getFileIcon = function(msg) {
				if (msg.fileMetaKey && typeof msg.fileMeta === 'object') {
					if (msg.fileMeta.contentType.indexOf('image') !== -1) {
						return '<span class="mck-icon-camera"></span>&nbsp;<span>Image</span>'
					} else if (msg.fileMeta.contentType.indexOf('audio') !== -1) {
						return '<span class="mck-icon-attachment"></span>&nbsp;<span>Audio</span>';
					} else if(msg.fileMeta.contentType.indexOf('video') !== -1) {
                        return '<span class="mck-icon-attachment"></span>&nbsp;<span>Video</span>';
                    } else {
						return '<span class="mck-icon-attachment"></span>&nbsp;<span>File</span>';
					}
				} else {
					return '';
				}
			};
			_this.getContactImageLink = function(contact, displayName) {
				var imgsrctag = '';
				if (contact.isGroup) {
					imgsrctag = mckGroupLayout.getGroupImage(contact.imageUrl);
				} else {
					if (typeof (MCK_GETUSERIMAGE) === "function") {
						var imgsrc = MCK_GETUSERIMAGE(contact.contactId);
						if (imgsrc && typeof imgsrc !== 'undefined') {
							imgsrctag = '<img src="' + imgsrc + '"/>';
						}
					}
					if (!imgsrctag) {
						if (contact.photoSrc) {
							imgsrctag = '<img src="' + contact.photoSrc + '"/>';
						} else if (contact.photoData) {
							imgsrctag = '<img src="data:image/jpeg;base64,' + contact.photoData + '"/>';
						} else if (contact.photoLink) {
							imgsrctag = '<img src="' + MCK_BASE_URL + '/contact.image?photoLink=' + contact.photoLink + '"/>';
						} else {
							if (!displayName) {
								displayName = contact.displayName;
							}
							imgsrctag = _this.getContactImageByAlphabet(displayName);
						}
					}
				}
				return imgsrctag;
			};
			_this.getContactImageByAlphabet = function(name) {
				if (typeof name === 'undefined' || name === "") {
					return '<div class="mck-alpha-contact-image mck-alpha-user"><span class="mck-icon-user"></span></div>';
				}
				var first_alpha = name.charAt(0);
				var letters = /^[a-zA-Z]+$/;
				if (first_alpha.match(letters)) {
					first_alpha = first_alpha.toUpperCase();
					return '<div class="mck-alpha-contact-image alpha_' + first_alpha + '"><span class="mck-contact-icon">' + first_alpha + '</span></div>';
				} else {
					return '<div class="mck-alpha-contact-image alpha_user"><span class="mck-icon-user"></span></div>';
				}
			};
			_this.getNameTextClassByAlphabet = function(name) {
				if (typeof name === 'undefined' || name === "") {
					return 'mck-text-user';
				}
				name = name.toString();
				var first_alpha = name.charAt(0);
				var letters = /^[a-zA-Z]+$/;
				if (first_alpha.match(letters)) {
					first_alpha = first_alpha.toLowerCase();
					return 'mck-text-' + first_alpha;
				} else {
					return 'mck-text-user';
				}
			};
			_this.addContactsFromMessageList = function(data, isReloaded) {
				var showMoreDateTime;
				if (data + '' === 'null') {
					showMoreDateTime = '';
					return;
				} else {
					if (isReloaded) {
						$mck_contact_list.html('');
					}
					if (typeof data.message.length === 'undefined') {
						if (data.message.groupId) {
							_this.addGroupFromMessage(data.message);
						} else {
							_this.addContactsFromMessage(data.message);
						}
						showMoreDateTime = data.message.createdAtTime;
					} else {
						$applozic.each(data.message, function(i, message) {
							if (!(typeof message.to === 'undefined')) {
								if (message.groupId) {
								   _this.addGroupFromMessage(message, true);
								} else {
									_this.addContactsFromMessage(message, true);
								}
								showMoreDateTime = message.createdAtTime;
							}
						});
					}
					$mck_contacts_inner.data('datetime', showMoreDateTime);
				}
			};
			_this.addGroupFromMessageList = function(data, isReloaded) {
				if (data + '' === 'null') {
					return;
				} else {
					if (isReloaded) {
						$mck_contacts_inner.html('<ul id="mck-group-list" class="mck-contact-list mck-nav mck-nav-tabs mck-nav-stacked"></ul>');
					}
					if (typeof data.message.length === "undefined") {
						_this.addGroupFromMessage(data.message);
					} else {
						$applozic.each(data.message, function(i, message) {
							if (!(typeof message.to === "undefined")) {
								_this.addGroupFromMessage(message, true);
							}
						});
					}
				}
			};
			_this.createContact = function(contactId) {
				var displayName = _this.getContactDisplayName(contactId);
				if (typeof displayName === 'undefined') {
					displayName = contactId;
				}
				var contact = {
					'contactId' : contactId,
					'htmlId' : mckContactUtils.formatContactId(contactId),
					'displayName' : displayName,
					'name' : displayName + " <" + contactId + ">" + " [" + "Main" + "]",
					'value' : contactId,
					'photoLink' : '',
					'photoSrc' : '',
					'photoData' : '',
					'email' : '',
					'unsaved' : true,
					'isGroup' : false
				};
				MCK_CONTACT_MAP[contactId] = contact;
				return contact;
			};
			_this.createContactWithDetail = function(data) {
				var displayName = data.displayName;
				var contactId = data.userId;
				if (!displayName) {
					displayName = _this.getContactDisplayName(contactId);
				}
				if (typeof displayName === 'undefined') {
					displayName = contactId;
				} else {
					MCK_CONTACT_NAME_MAP[contactId] = displayName;
				}
				var photoLink = (data.photoLink) ? data.photoLink : '';
				if (!photoLink) {
					photoLink = (data.imageLink) ? data.imageLink : '';
				}
				var photoData = (data.imageData) ? data.imageData : '';
				var contact = {
					'contactId' : contactId,
					'htmlId' : mckContactUtils.formatContactId(contactId),
					'displayName' : displayName,
					'name' : displayName + " <" + contactId + ">" + " [" + "Main" + "]",
					'value' : contactId,
					'photoLink' : '',
					'photoSrc' : photoLink,
					'photoData' : photoData,
					'email' : '',
					'unsaved' : true,
					'isGroup' : false
				};
				MCK_CONTACT_MAP[contactId] = contact;
				return contact;
			};
			_this.updateContactDetail = function(contact, data) {
				var displayName = data.displayName;
				var contactId = data.userId;
				if (!displayName) {
					displayName = _this.getContactDisplayName(contactId);
				}
				if (typeof displayName === 'undefined') {
					displayName = contactId;
				} else {
					MCK_CONTACT_NAME_MAP[contactId] = displayName;
				}
				contact.displayName = displayName;
				var photoLink = data.photoLink;
				if (!photoLink) {
					photoLink = (data.imageLink) ? data.imageLink : "";
				}
				if (photoLink) {
					contact.photoSrc = photoLink;
				}
				var photoData = (data.imageData) ? data.imageData : "";
				if (photoData) {
					contact.photoData = photoData;
				}
				MCK_CONTACT_MAP[contactId] = contact;
				return contact;
			};
			_this.addContactsFromMessage = function(message, update) {
				var contactIdsArray = _this.getUserIdFromMessage(message);
				if (contactIdsArray.length > 0 && contactIdsArray[0]) {
					for (var i = 0; i < contactIdsArray.length; i++) {
						var contact = _this.fetchContact('' + contactIdsArray[i]);
						_this.updateRecentConversationList(contact, message, update, false);
					}
				}
			};
			_this.addGroupFromMessage = function(message, update) {
				var groupId = message.groupId;
				var group = mckGroupUtils.getGroup('' + groupId);
				if (typeof group === 'undefined') {
					group = mckGroupUtils.createGroup(groupId);
					mckGroupService.loadGroups({
						apzCallback : mckGroupLayout.loadGroups
					});
				}
				_this.updateRecentConversationList(group, message, update, false);
			};
			_this.updateRecentConversationList = function(contact, message, update, prepend) {
				var $listId = 'mck-contact-list';
				var contactHtmlExpr = (contact.isGroup) ? 'group-' + contact.htmlId : 'user-' + contact.htmlId;
				if ($applozic('#' + $listId + ' #li-' + contactHtmlExpr).length > 0) {
					var $mck_msg_part = $applozic("#" + $listId + " #li-" + contact.htmlId + " .mck-cont-msg-wrapper");
					if (($mck_msg_part.is(":empty") || update) && message !== undefined) {
						_this.updateContact(contact, message, $listId, update);
					}
				} else {
					_this.addContact(contact, $listId, message, prepend);
				}
			};
			_this.addContactsToSearchList = function() {
				if (MCK_CONTACT_ARRAY.length === 0 && MCK_CHAT_CONTACT_ARRAY.length === 0) {
					return;
				}
				var contactsArray = [],
					userIdArray = [],
					groupIdArray = [];
				$applozic.each(MCK_CONTACT_ARRAY, function(i, contact) {
					userIdArray.push(contact.contactId);
				});
				$applozic.each(MCK_CHAT_CONTACT_ARRAY, function(i, contact) {
					(contact.isGroup) ? groupIdArray.push(contact.contactId) : userIdArray.push(contact.contactId);
				});
				var uniqueUserIdArray = userIdArray.filter(function(item, pos) {
					return userIdArray.indexOf(item) === pos;
				});
				var uniqueGroupIdArray = groupIdArray.filter(function(item, pos) {
					return groupIdArray.indexOf(item) === pos;
				});
				for (var j = 0; j < uniqueUserIdArray.length; j++) {
					var userId = uniqueUserIdArray[j];
					if (userId) {
						var contact = _this.fetchContact('' + userId);
						contactsArray.push(contact);
					}
				}
				for (var j = 0; j < uniqueGroupIdArray.length; j++) {
					var groupId = uniqueGroupIdArray[j];
					if (groupId) {
						var contact = mckGroupUtils.getGroup('' + groupId);
						contactsArray.push(contact);
					}
				}
				_this.initAutoSuggest({
					'contactsArray' : contactsArray,
					'$searchId' : $mck_search,
					'isContactSearch' : true
				});
			};
			_this.addContactsToContactSearchList = function() {
				var contactsArray = [],
					userIdArray = [];
				$mck_no_search_contacts.removeClass('vis').addClass('n-vis');
				$mck_no_search_groups.removeClass('vis').addClass('n-vis');
				if (!$mck_contact_search_tab.hasClass('active')) {
					$mck_search_tab_link.removeClass('active');
					$mck_contact_search_tab.addClass('active');
				}
				$mck_group_search_list.removeClass('vis').addClass('n-vis');
				$mck_contact_search_list.removeClass('n-vis').addClass('vis');
				$mck_group_search_input_box.removeClass('vis').addClass('n-vis');
				$mck_contact_search_input_box.removeClass('n-vis').addClass('vis');
				$mck_search_loading.removeClass('n-vis').addClass('vis');
				$applozic.each(MCK_CONTACT_ARRAY, function(i, contact) {
					userIdArray.push(contact.contactId);
				});
				var uniqueUserIdArray = userIdArray.filter(function(item, pos) {
					return userIdArray.indexOf(item) === pos;
				});
				uniqueUserIdArray.sort();
				$mck_contact_search_list.html('');
				$mck_search_loading.removeClass('vis').addClass('n-vis');
				if (uniqueUserIdArray.length > 0) {
					$applozic.each(uniqueUserIdArray, function(i, userId) {
						if (userId) {
							var contact = _this.fetchContact('' + userId);
							contactsArray.push(contact);
							if ($applozic("#li-cs-user-" + contact.htmlId).length === 0) {
								_this.addContactForSearchList(contact, "mck-contact-search-list");
							}
						}
					});
				} else {
					$mck_no_search_contacts.removeClass('n-vis').addClass('vis');
				}
				_this.initAutoSuggest({
					'contactsArray' : contactsArray,
					'$searchId' : $mck_contact_search_input,
					'isContactSearch' : true
				});
				$mck_contact_search_box.mckModal();
			};
			_this.addGroupsToGroupSearchList = function() {
				var groupsArray = [],
					groupIdArray = [];
				$mck_no_search_contacts.removeClass('vis').addClass('n-vis');
				$mck_no_search_groups.removeClass('vis').addClass('n-vis');
				if (!$mck_group_search_tab.hasClass('active')) {
					$mck_search_tab_link.removeClass('active');
					$mck_group_search_tab.addClass('active');
				}
				$mck_contact_search_list.removeClass('vis').addClass('n-vis');
				$mck_group_search_list.removeClass('n-vis').addClass('vis');
				$mck_contact_search_input_box.removeClass('vis').addClass('n-vis');
				$mck_group_search_input_box.removeClass('n-vis').addClass('vis');
				if (MCK_GROUP_ARRAY.length > 0) {
					$applozic.each(MCK_GROUP_ARRAY, function(i, group) {
						groupIdArray.push(group.contactId);
					});
					var uniqueGroupIdArray = groupIdArray.filter(function(item, pos) {
						return groupIdArray.indexOf(item) === pos;
					});
					uniqueGroupIdArray.sort();
					$mck_group_search_list.html('');
					$applozic.each(uniqueGroupIdArray, function(i, groupId) {
						if (groupId) {
							var group = mckGroupUtils.getGroup('' + groupId);
							groupsArray.push(group);
							if ($applozic("#li-gs-group-" + group.htmlId).length === 0) {
								_this.addContactForSearchList(group, "mck-group-search-list");
							}
						}
					});
				} else {
					$mck_no_search_groups.removeClass('n-vis').addClass('vis');
				}
				_this.initAutoSuggest({
					'contactsArray' : groupsArray,
					'$searchId' : $mck_group_search_input,
					'isContactSearch' : true
				});
				$mck_contact_search_box.mckModal();
			};
			_this.initAutoSuggest = function(params) {
				var contactsArray = params.contactsArray;
				var $searchId = params.$searchId;
				var typeaheadArray = [];
				var typeaheadEntry;
				var typeaheadMap = {};
				var contactSuggestionsArray = [];
				for (var j = 0; j < contactsArray.length; j++) {
					var contact = contactsArray[j];
					contact.displayName = _this.getTabDisplayName(contact.contactId, contact.isGroup);
					typeaheadEntry = (contact.displayName) ? $applozic.trim(contact.displayName) : $applozic.trim(contact.contactId);
					typeaheadMap[typeaheadEntry] = contact;
					typeaheadArray.push(typeaheadEntry);
					contactSuggestionsArray.push(typeaheadEntry);
				}
				$searchId.mcktypeahead({
					source : typeaheadArray,
					matcher : function(item) {
						var contact = typeaheadMap[item];
						var contactNameArray = contact.displayName.split(' ');
						var contactNameLength = contactNameArray.length;
						var contactFName = contactNameArray[0];
						var contactMName = '';
						var contactLName = '';
						if (contactNameLength === 2) {
							contactLName = contactNameArray[1];
						} else if (contactNameLength >= 3) {
							contactLName = contactNameArray[contactNameLength - 1];
							contactMName = contactNameArray[contactNameLength - 2];
						}
						var matcher = new RegExp(this.query, 'i');
						return matcher.test(contact.displayName) || matcher.test(contact.contactId) || matcher.test(contactMName) || matcher.test(contactLName) || matcher.test(contact.email) || matcher.test(contactFName + " " + contactLName);
					},
					highlighter : function(item) {
						var contact = typeaheadMap[item];
						return contact.displayName;
					},
					updater : function(item) {
						var contact = typeaheadMap[item];
						if (params.isContactSearch) {
							mckMessageLayout.loadTab({
								tabId : contact.contactId,
								isGroup : contact.isGroup,
								isSearch : true
							});
							$modal_footer_content.removeClass('n-vis').addClass('vis');
							$mck_contact_search_box.mckModal('hide');
						} else {
							mckGroupLayout.addGroupMemberFromSearch(contact.contactId);
						}
					}
				});
			};
			_this.initSearchAutoType = function() {
				if (IS_AUTO_TYPE_SEARCH_ENABLED) {
					$mck_search.keypress(function(e) {
						if (e.which === 13) {
							var tabId = $mck_search.val();
							if (tabId !== "") {
								mckMessageLayout.loadTab({
									'tabId' : tabId,
									'isGroup' : false,
									'isSearch' : true
								});
								$modal_footer_content.removeClass('n-vis').addClass('vis');
							}
							$applozic(this).val("");
							return true;
						}
					});
					$applozic(d).on("click", ".mck-tab-search", function(e) {
						e.preventDefault();
						var tabId = $mck_search.val();
						if (tabId !== "") {
							mckMessageLayout.loadTab({
								tabId : tabId,
								isGroup : false,
								'isSearch' : true
							});
							$modal_footer_content.removeClass('n-vis').addClass('vis');
						}
						$mck_search.val("");
					});
					$mck_contact_search_input.keypress(function(e) {
						if (e.which === 13) {
							var userId = $mck_contact_search_input.val();
							if (userId) {
								userId = (typeof userId !== "undefined" && userId !== "") ? userId.toString() : "";
								if (userId) {
									mckMessageLayout.loadTab({
										'tabId' : userId,
										'isGroup' : false,
										'isSearch' : true
									});
								}
							}
							$mck_contact_search_input.val("");
							$mck_contact_search_box.mckModal('hide');
						}
					});
					$mck_group_search_input.keypress(function(e) {
						if (e.which === 13) {
							return true;
						}
					});
					$applozic(d).on("click", ".mck-group-search-link", function(e) {
						e.preventDefault();
						return true;
					});
					$applozic(d).on("click", ".mck-contact-search-link", function(e) {
						e.preventDefault();
						var tabId = $mck_contact_search_input.val();
						if (tabId !== "") {
							mckMessageLayout.loadTab({
								tabId : tabId,
								isGroup : false,
								'isSearch' : true
							});
							$modal_footer_content.removeClass('n-vis').addClass('vis');
						}
						$mck_contact_search_input.val("");
						$mck_contact_search_box.mckModal('hide');
					});
				}
			};
			_this.removeContact = function(contact) {
				var contactHtmlExpr = (contact.isGroup) ? 'group-' + contact.htmlId : 'user-' + contact.htmlId;
				$applozic("#li-" + contactHtmlExpr).remove();
			};
			_this.updateContact = function(contact, message, $listId, update) {
				var contHtmlExpr = (contact.isGroup) ? 'group-' + contact.htmlId : 'user-' + contact.htmlId;
				var $contactElem = $applozic("#li-" + contHtmlExpr);
				var currentMessageTime = $contactElem.data('msg-time');
				if (message && message.createdAtTime > currentMessageTime || update) {
					var ucTabId = (message.groupId) ? 'group_' + contact.contactId : 'user_' + contact.contactId;
					var unreadCount = _this.getUnreadCount(ucTabId);
					var emoji_template = _this.getMessageTextForContactPreview(message, contact, 15);
					$applozic("#li-" + contHtmlExpr + " .time").html(typeof message.createdAtTime === 'undefined' ? "" : mckDateUtils.getTimeOrDate(message ? message.createdAtTime : "", true));
					var $messageText = $applozic("#li-" + contHtmlExpr + " .mck-cont-msg-wrapper");
					$messageText.html("");
					(typeof emoji_template === 'object') ? $messageText.append(emoji_template) : $messageText.html(emoji_template);
					if (message.conversationId) {
						var conversationId = message.conversationId;
						var conversationPxy = MCK_CONVERSATION_MAP[conversationId];
						if (typeof conversationPxy === 'object') {
							var topicId = conversationPxy.topicId;
							if (topicId && IS_MCK_TOPIC_HEADER) {
								var topicDetail = MCK_TOPIC_DETAIL_MAP[topicId];
								if (typeof topicDetail === "object") {
									$applozic("#li-" + contHtmlExpr + " .mck-conversation-topic").html(topicDetail.title);
								}
							}
						}
						$applozic("#li-" + contHtmlExpr + " a").data('mck-conversationid', conversationId);
					}
					if (unreadCount > 0) {
						$applozic("#li-" + contHtmlExpr + " .mck-unread-count-text").html(unreadCount);
						$applozic("#li-" + contHtmlExpr + " .mck-unread-count-box").removeClass('n-vis').addClass('vis');
					}
					var latestCreatedAtTime = $applozic('#' + $listId + ' li:nth-child(1)').data('msg-time');
					$contactElem.data('msg-time', message.createdAtTime);
					if ((typeof latestCreatedAtTime === "undefined" || (message ? message.createdAtTime : "") >= latestCreatedAtTime) && $applozic("#mck-contact-list li").index($contactElem) !== 0) {
						$applozic('#' + $listId + ' li:nth-child(1)').before($contactElem);
					}
				}
			};
			_this.clearContactMessageData = function(tabId, isGroup) {
				var htmlId = mckContactUtils.formatContactId(tabId);
				var contactIdExpr = (isGroup) ? 'group-' + htmlId : 'user-' + htmlId;
				$applozic("#li-" + contactIdExpr + " .mck-cont-msg-date").html("");
				$applozic("#li-" + contactIdExpr + " .mck-cont-msg-wrapper").html("");
			};
			_this.addContact = function(contact, $listId, message, prepend) {
				var emoji_template = "";
				var conversationId = "";
				var isGroupTab = contact.isGroup;
				MCK_CHAT_CONTACT_ARRAY.push(contact);
				if (typeof message === "object") {
					emoji_template = _this.getMessageTextForContactPreview(message, contact, 100)
					if (message.conversationId) {
						conversationId = message.conversationId;
						var conversationPxy = MCK_CONVERSATION_MAP[conversationId];
					}
				}
				var displayName = _this.getTabDisplayName(contact.contactId, isGroupTab);
				var imgsrctag = _this.getContactImageLink(contact, displayName);
				if (!prepend) {
					prepend = false;
				}
				var ucTabId = (isGroupTab) ? 'group_' + contact.contactId : 'user_' + contact.contactId;
				var unreadCount = _this.getUnreadCount(ucTabId);
				var unreadCountStatus = (unreadCount > 0 && $listId !== "mck-contact-search-list") ? "vis" : "n-vis";
				var olStatus = "n-vis";
				if (!isGroupTab && !MCK_BLOCKED_TO_MAP[contact.contactId] && !MCK_BLOCKED_BY_MAP[contact.contactId] && IS_MCK_OL_STATUS && w.MCK_OL_MAP[contact.contactId]) {
					olStatus = "vis";
					if ($listId.indexOf("search") !== -1) {
						prepend = true;
					}
				}
				var isContHeader = "n-vis";
				if (typeof conversationPxy === 'object' && IS_MCK_TOPIC_HEADER) {
					var topicDetail = MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId];
					if (typeof topicDetail === "object") {
						isContHeader = "vis";
						var title = topicDetail.title;
					}
				}
				var contHtmlExpr = (isGroupTab) ? 'group-' + contact.htmlId : 'user-' + contact.htmlId;
				if ($listId === "mck-contact-search-list") {
					contHtmlExpr = 'cs-' + contHtmlExpr;
				}
				var contactList = [ {
					contHtmlExpr : contHtmlExpr,
					contIdExpr : contact.contactId,
					contTabExpr : isGroupTab,
					msgCreatedAtTimeExpr : message ? message.createdAtTime : "",
					mckLauncherExpr : MCK_LAUNCHER,
					contImgExpr : imgsrctag,
					contOlExpr : olStatus,
					contUnreadExpr : unreadCountStatus,
					contUnreadCount : unreadCount,
					contNameExpr : displayName,
					conversationExpr : conversationId,
					contHeaderExpr : isContHeader,
					titleExpr : title,
					msgCreatedDateExpr : message ? mckDateUtils.getTimeOrDate(message.createdAtTime, true) : ""
				} ];
				if ($listId === "mck-contact-search-list") {
					$applozic.tmpl("contactTemplate", contactList).prependTo('#' + $listId);
				} else {
					var latestCreatedAtTime = $applozic('#' + $listId + ' li:nth-child(1)').data('msg-time');
					if (typeof latestCreatedAtTime === "undefined" || (message ? message.createdAtTime : "") > latestCreatedAtTime || prepend) {
						$applozic.tmpl("contactTemplate", contactList).prependTo('#' + $listId);
						$applozic.tmpl("conversationTemplate", contactList).prependTo('#conversation-section');
					} else {
						$applozic.tmpl("contactTemplate", contactList).appendTo('#' + $listId);
						$applozic.tmpl("conversationTemplate", contactList).appendTo('#conversation-section');
					}
					var $textMessage = $applozic("#li-" + contHtmlExpr + " .msgTextExpr");
					(typeof emoji_template === 'object') ? $textMessage.append(emoji_template) : $textMessage.html(emoji_template);
					if (!$applozic(".left .person").length) {
						_this.loadTab({
							tabId : isGroupTab ? message.groupId : contact.contactId,
							'isGroup' : isGroupTab
						});
					} else if ($mck_no_contact_text.hasClass('vis')) {
						$mck_no_contact_text.removeClass('vis').addClass('n-vis');
					}
				}
			};
			_this.addContactForSearchList = function(contact, $listId) {
				var isGroupTab = contact.isGroup;
				var displayName = _this.getTabDisplayName(contact.contactId, isGroupTab);
				var imgsrctag = _this.getContactImageLink(contact, displayName);
				var ucTabId = (isGroupTab) ? 'group_' + contact.contactId : 'user_' + contact.contactId;
				var contHtmlExpr = (isGroupTab) ? 'gs-group-' + contact.htmlId : 'cs-user-' + contact.htmlId;
				var lastSeenStatus = "";
				if (!isGroupTab && !MCK_BLOCKED_TO_MAP[contact.contactId]) {
					if (w.MCK_OL_MAP[contact.contactId]) {
						lastSeenStatus = "online";
					} else if (MCK_LAST_SEEN_AT_MAP[contact.contactId]) {
						lastSeenStatus = mckDateUtils.getLastSeenAtStatus(MCK_LAST_SEEN_AT_MAP[contact.contactId]);
					}
				}
				var contactList = [ {
					contHtmlExpr : contHtmlExpr,
					contIdExpr : contact.contactId,
					contImgExpr : imgsrctag,
					contLastSeenExpr : lastSeenStatus,
					contNameExpr : displayName,
					contTabExpr : isGroupTab
				} ];
				$applozic.tmpl("searchContactbox", contactList).prependTo('#' + $listId);
			};
			_this.addConversationMenu = function(tabId, isGroup) {
				var currTabId = $mck_msg_inner.data('mck-id');
				$mck_conversation_list.html("");
				if (tabId !== currTabId) {
					return;
				}
				var tabConvArray = MCK_TAB_CONVERSATION_MAP[tabId];
				if (typeof tabConvArray === 'undefined' || tabConvArray.length === 0 || tabConvArray.length === 1) {
					$product_box_caret.addClass('n-vis');
					$mck_product_box.addClass('mck-product-box-wc');
					$mck_conversation_list.addClass('n-vis');
					return;
				}
				$mck_conversation_list.removeClass('n-vis');
				$product_box_caret.removeClass('n-vis');
				$mck_product_box.removeClass('mck-product-box-wc');
				$applozic.each(tabConvArray, function(i, convPxy) {
					if ($applozic("#mck-conversation-list #li-" + convPxy.id).length === 0) {
						var title = "";
						if (convPxy.topicDetail) {
							var topicDetail = $applozic.parseJSON(convPxy.topicDetail);
							title = (typeof topicDetail === 'object') ? topicDetail.title : convPxy.topicDetail;
						}
						if (!title) {
							title = convPxy.topicId;
						}
						var convList = [ {
							convIdExpr : convPxy.id,
							tabIdExpr : tabId,
							isGroupExpr : isGroup,
							topicIdExpr : convPxy.topicId,
							convTitleExpr : title,
							mckLauncherExpr : MCK_LAUNCHER
						} ];
						$applozic.tmpl("convTemplate", convList).appendTo($mck_conversation_list);
					}
				});
				if ($applozic("#mck-conversation-list li").length < 2) {
					$product_box_caret.addClass('n-vis');
					$mck_product_box.addClass('mck-product-box-wc');
					$mck_conversation_list.addClass('n-vis');
				}
			};
			_this.loadContacts = function(data) {
				if (data + '' === "null" || typeof data === "undefined" || typeof data.contacts === "undefined" || data.contacts.length === 0) {
					return;
				}
				MCK_CONTACT_ARRAY.length = 0;
				MCK_GROUP_SEARCH_ARRAY.length = 0;
				$applozic.each(data.contacts, function(i, data) {
					if ( (typeof data.userId !== "undefined") ) {
						var contact = _this.getContact('' + data.userId);
						contact = (typeof contact === 'undefined') ? _this.createContactWithDetail(data) : _this.updateContactDetail(contact, data);
						MCK_CONTACT_ARRAY.push(contact);
						MCK_GROUP_SEARCH_ARRAY.push(contact.contactId);
					}
				});
				mckMessageService.initSearch();
			};
			_this.getStatusIcon = function(msg) {
				return '<span class="' + _this.getStatusIconName(msg) + ' move-right ' + msg.key + '_status status-icon"></span>';
			};
			_this.getStatusIconName = function(msg) {
				if (msg.type === 7 || msg.type === 6 || msg.type === 4 || msg.type === 0) {
					return "";
				}
				if (msg.status === 5) {
					return 'mck-icon-read';
				}
				if (msg.status === 4) {
					return 'mck-icon-delivered';
				}
				if (msg.type === 3 || msg.type === 5 || (msg.type === 1 && (msg.source === 0 || msg.source === 1))) {
					return 'mck-icon-sent';
				}
				return "";
			};
			_this.clearMessageField = function() {
				$mck_text_box.html("");
				$mck_msg_sbmt.attr('disabled', false);
				$mck_file_box.removeClass('vis').removeClass('mck-text-req').addClass('n-vis').attr("required", "").html("");
			};
			_this.addDraftMessage = function(tabId) {
				FILE_META = [];
				if (tabId && typeof TAB_MESSAGE_DRAFT[tabId] === 'object') {
					var draftMessage = TAB_MESSAGE_DRAFT[tabId];
					$mck_text_box.html(draftMessage.text);
					if (draftMessage.files.length > 0) {
						$applozic.each(draftMessage.files, function(i, file) {
							mckFileService.addFileBox(file);
						});
						$file_name.html(draftMessage.filelb);
						$file_size.html(draftMessage.filesize);
						$mck_file_box.removeClass('n-vis').removeClass('mck-text-req').addClass('vis').removeAttr('required');
					}
				} else {
					FILE_META = [];
				}
			};
			_this.removeConversationThread = function(tabId, isGroup) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				mckStorage.clearMckMessageArray();
				var contact = (isGroup) ? mckGroupUtils.getGroup(tabId) : mckMessageLayout.getContact(tabId);
				var currentTabId = $mck_msg_inner.data('mck-id');
				var htmlId = (typeof contact !== 'undefined') ? contact.htmlId : mckContactUtils.formatContactId(tabId);
				var contactIdExpr = (isGroup) ? 'group-' + htmlId : 'user-' + htmlId;
				$applozic("#li-" + contactIdExpr + " .mck-cont-msg-wrapper").html('');
				$applozic("#li-" + contactIdExpr + " .time").html('');
				if (currentTabId === tabId) {
					$mck_msg_inner.html("");
					$mck_msg_cell.removeClass('n-vis').addClass('vis');
					$mck_tab_message_option.removeClass('vis').addClass('n-vis');
				}
			};
			_this.removedDeletedMessage = function(key, tabId, isGroup) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				mckStorage.clearMckMessageArray();
				var $divMessage = $applozic("." + key);
				if ($divMessage.length > 0) {
					$divMessage.remove();
					if ($mck_msg_inner.is(":empty")) {
						$mck_msg_cell.removeClass('n-vis').addClass('vis');
						$mck_tab_message_option.removeClass('vis').addClass('n-vis');
					}
				}
				if (typeof tabId !== "undefined") {
					mckMessageService.updateContactList(tabId, isGroup);
				}
			};
			_this.getMessageTextForContactPreview = function(message, contact, size) {
				var emoji_template = "";
				if (typeof message !== 'undefined') {
					if (message.message) {
						if (message.contentType === 2) {
							emoji_template = '<span class="mck-icon-marker"></span>';
						} else {
							var msg = message.message;
							if (mckUtils.startsWith(msg, "<img")) {
								return '<span class="mck-icon-camera"></span>&nbsp;<span>image</span>';
							} else {
								emoji_template = w.emoji.replace_unified(msg);
								emoji_template = w.emoji.replace_colons(emoji_template);
								emoji_template = (emoji_template.indexOf('</span>') !== -1) ? emoji_template.substring(0, emoji_template.lastIndexOf('</span>')) : emoji_template.substring(0, size);
							}
							if (!contact.isGroup) {
								if (emoji_template.indexOf('emoji-inner') === -1 && message.contentType === 0) {
									var x = d.createElement('p');
									x.appendChild(d.createTextNode(emoji_template));
									emoji_template = x;
								}
							}
						}
					} else if (message.fileMetaKey && typeof message.fileMeta === "object") {
						emoji_template = mckMessageLayout.getFileIcon(message);
					}
					if (contact.isGroup && contact.type !== 3) {
						var msgFrom = (message.to.split(",")[0] === MCK_USER_ID) ? "Me" : mckMessageLayout.getTabDisplayName(message.to.split(",")[0], false);
						if (message.contentType !== 10) {
							emoji_template = msgFrom + ": " + emoji_template;
						}
						if (emoji_template.indexOf('emoji-inner') === -1 && message && message.message && message.contentType === 0) {
							var x = d.createElement('p');
							x.appendChild(d.createTextNode(emoji_template));
							emoji_template = x;
						}
					}
				}
				return emoji_template;
			};
			_this.getTextForMessagePreview = function(message, contact) {
				var emoji_template = "";
				if (typeof message !== 'undefined') {
					if (message.contentType === 2) {
						emoji_template = 'Shared location';
					} else if (message.message) {
						var msg = message.message;
						if (mckUtils.startsWith(msg, "<img")) {
							emoji_template = 'Image attachment';
						} else {
							var x = d.createElement('div');
							x.innerHTML = msg;
							msg = $applozic.trim(mckUtils.textVal(x));
							emoji_template = msg.substring(0, 50);
						}
					} else if (message.fileMetaKey && typeof message.fileMeta === "object") {
						emoji_template = (message.fileMeta.contentType.indexOf("image") !== -1) ? 'Image attachment' : 'File attachment';
					}
					if (contact.isGroup && contact.type !== 3) {
						var msgFrom = (message.to.split(",")[0] === MCK_USER_ID) ? "Me" : mckMessageLayout.getTabDisplayName(message.to.split(",")[0], false);
						emoji_template = msgFrom + ": " + emoji_template;
					}
				}
				return emoji_template;
			};
			_this.getUserIdFromMessage = function(message) {
				var tos = message.to;
				if (tos.lastIndexOf(",") === tos.length - 1) {
					tos = tos.substring(0, tos.length - 1);
				}
				return tos.split(",");
			};
			_this.getUserIdArrayFromMessageList = function(messages) {
				var userIdArray = new Array();
				if (typeof messages.length === "undefined") {
					userIdArray.concat(_this.getUserIdFromMessage(messages));
				} else {
					$applozic.each(messages, function(i, message) {
						if (!(typeof message.to === "undefined")) {
							userIdArray = userIdArray.concat(_this.getUserIdFromMessage(message));
						}
					});
				}
				return userIdArray;
			};
			_this.messageContextMenu = function(messageKey) {
				var $messageBox = $applozic("." + messageKey + " .mck-msg-box");
				if ($messageBox.addEventListener) {
					$messageBox.addEventListener('contextmenu', function(e) {
						e.preventDefault();
					}, false);
				} else {
					$messageBox.bind('contextmenu', function(e) {
						e.preventDefault();
						$applozic(".mck-context-menu").removeClass("vis").addClass("n-vis");
						$applozic("." + messageKey + " .mck-context-menu").removeClass("n-vis").addClass("vis");
						w.event.returnValue = false;
					});
				}
			};
			_this.isValidMetaData = function(message) {
				if (!message.metadata) {
					return true;
				} else if (message.metadata.category === 'HIDDEN' || message.metadata.category === 'ARCHIVE') {
					return false;
				} else {
					return true;
				}
			}
			_this.updateDraftMessage = function(tabId, fileMeta) {
				if (typeof fileMeta === 'object') {
					var tab_draft = {
						'text' : "",
						files : []
					};
					var file = {
						fileMeta : fileMeta,
						filelb : mckFileService.getFilePreviewPath(fileMeta),
						filesize : mckFileService.getFilePreviewSize(fileMeta.size)
					};
					if ((typeof tabId !== 'undefined') && (typeof TAB_MESSAGE_DRAFT[tabId] === 'object')) {
						tab_draft = TAB_MESSAGE_DRAFT[tabId];
						$applozic.each(tab_draft.files, function(i, oldFile) {
							if (oldFile.filelb === file.filelb) {
								tab_draft.files.splice(i, 1);
							}
						});
					}
					tab_draft.files.push(file);
				}
				TAB_MESSAGE_DRAFT[tabId] = tab_draft;
			};
			_this.updateUnreadCount = function(tabId, count, isTotalUpdate) {
				var previousCount = _this.getUnreadCount(tabId);
				MCK_UNREAD_COUNT_MAP[tabId] = count;
				if (isTotalUpdate && $mckChatLauncherIcon.length > 0) {
					MCK_TOTAL_UNREAD_COUNT += count - previousCount;
					(MCK_TOTAL_UNREAD_COUNT > 0) ? $mckChatLauncherIcon.html(MCK_TOTAL_UNREAD_COUNT) : $mckChatLauncherIcon.html("");
				}
			};
			_this.incrementUnreadCount = function(tabId) {
				MCK_TOTAL_UNREAD_COUNT += 1;
				MCK_UNREAD_COUNT_MAP[tabId] = (typeof (MCK_UNREAD_COUNT_MAP[tabId]) === 'undefined') ? 1 : MCK_UNREAD_COUNT_MAP[tabId] + 1;
				if ($mckChatLauncherIcon.length > 0) {
					$mckChatLauncherIcon.html(MCK_TOTAL_UNREAD_COUNT);
				}
			};
			_this.getUnreadCount = function(tabId) {
				if (typeof (MCK_UNREAD_COUNT_MAP[tabId]) === 'undefined') {
					MCK_UNREAD_COUNT_MAP[tabId] = 0;
					return 0;
				} else {
					return MCK_UNREAD_COUNT_MAP[tabId];
				}
			};
			_this.getTabDisplayName = function(tabId, isGroup, userName) {
				var displayName = "";
				if (isGroup) {
					return mckGroupLayout.getGroupDisplayName(tabId);
				} else {
					if (typeof (MCK_GETUSERNAME) === "function") {
						displayName = MCK_GETUSERNAME(tabId);
					}
					if (typeof userName !== 'undefined' && userName) {
						displayName = userName;
						MCK_CONTACT_NAME_MAP[tabId] = userName;
					}
					if (!displayName) {
						displayName = _this.getContactDisplayName(tabId);
					}
					if (!displayName) {
						var contact = _this.fetchContact('' + tabId);
						if (typeof contact.displayName !== "undefined") {
							displayName = contact.displayName;
						}
					}
					if (!displayName) {
						displayName = tabId;
					}
					return displayName;
				}
			};
			_this.populateMessage = function(messageType, message, notifyUser) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var tabId = $mck_msg_inner.data('mck-id');
				var isGroupTab = $mck_msg_inner.data('isgroup');
				var isValidMeta = mckMessageLayout.isValidMetaData(message);
				var contact = (message.groupId) ? mckGroupUtils.getGroup(message.groupId) : mckMessageLayout.getContact(message.to);
				if (!message.metadata || isValidMeta) {
					(message.groupId) ? mckMessageLayout.addGroupFromMessage(message, true) : mckMessageLayout.addContactsFromMessage(message, true);
				}
				if (typeof tabId !== 'undefined' && tabId === contact.contactId && isGroupTab === contact.isGroup) {
					if (messageType === "APPLOZIC_01" || messageType === "MESSAGE_RECEIVED") {
						if (typeof contact !== 'undefined') {
							if (message.conversationId && (IS_MCK_TOPIC_HEADER || IS_MCK_TOPIC_BOX)) {
								var currConvId = $mck_msg_inner.data('mck-conversationid');
								if (currConvId && currConvId.toString() === message.conversationId.toString()) {
									if (!message.metadata || message.metadata.category !== 'HIDDEN') {
										mckMessageLayout.addMessage(message, contact, true, true, true);
									}
									mckMessageService.sendReadUpdate(message.pairedMessageKey);
								}
							} else {
								if (!message.metadata || message.metadata.category !== 'HIDDEN') {
									mckMessageLayout.addMessage(message, contact, true, true, true);
								}
								mckMessageService.sendReadUpdate(message.pairedMessageKey);
							}
							if (!message.groupId) {
								$applozic("#mck-tab-individual .mck-tab-status").html("Online");
								mckUserUtils.updateUserStatus({
									'userId' : message.to,
									'status' : 1
								});
							}
							// Todo: use contactNumber instead of contactId
							// for Google Contacts API.
							if (notifyUser && isValidMeta) {
								mckNotificationService.notifyUser(message);
							}
						}
					} else if (messageType === "APPLOZIC_02") {
						if (($applozic("." + message.oldKey).length === 0 && $applozic("." + message.key).length === 0) || message.contentType === 10) {
							if (typeof contact !== 'undefined') {
								if (typeof tabId !== 'undefined' && tabId === contact.contactId && isGroupTab === contact.isGroup) {
									if (!message.metadata || message.metadata.category !== 'HIDDEN') {
										mckMessageLayout.addMessage(message, contact, true, true, true);
										if (message.type === 3) {
											$applozic("." + message.key + " .mck-message-status").removeClass('mck-icon-time').addClass('mck-icon-sent');
											mckMessageLayout.addTooltip(message.key);
										}
									}
								}
							}
						}
					}
				} else {
					if (messageType === "APPLOZIC_01" || messageType === "MESSAGE_RECEIVED") {
						var ucTabId = (message.groupId) ? 'group_' + contact.contactId : 'user_' + contact.contactId;
						if (isValidMeta) {
							if (message.contentType !== 10) {
								mckMessageLayout.incrementUnreadCount(ucTabId);
							}
							mckNotificationService.notifyUser(message);
						}
						var contactHtmlExpr = (message.groupId) ? 'group-' + contact.htmlId : 'user-' + contact.htmlId;
						$applozic("#li-" + contactHtmlExpr + " .mck-unread-count-text").html(mckMessageLayout.getUnreadCount(ucTabId));
						if (mckMessageLayout.getUnreadCount(ucTabId) > 0) {
							$applozic("#li-" + contactHtmlExpr + " .mck-unread-count-box").removeClass("n-vis").addClass("vis");
						}
						mckMessageService.sendDeliveryUpdate(message);
					}
				}
				/*
				 * if ((typeof tabId === "undefined") || tabId === "") { if (messageType === "APPLOZIC_01" || messageType === "MESSAGE_RECEIVED") { if (typeof contact === 'undefined') { contact = (message.groupId) ? mckGroupLayout .createGroup(message.groupId) : mckMessageLayout .createContact(message.to); } var ucTabId = (message.groupId) ? 'group_' + contact.contactId : 'user_' + contact.contactId; if (message.contentType !== 10) { mckMessageLayout.incrementUnreadCount(ucTabId); } mckNotificationService.notifyUser(message); var contactHtmlExpr = (message.groupId) ? 'group-' + contact.htmlId : 'user-' + contact.htmlId; $applozic( "#li-" + contactHtmlExpr + " .mck-unread-count-text").html( mckMessageLayout.getUnreadCount(ucTabId)); if (mckMessageLayout.getUnreadCount(ucTabId) > 0) { $applozic( "#li-" + contactHtmlExpr + " .mck-unread-count-box") .removeClass("n-vis").addClass("vis"); } mckMessageService.sendDeliveryUpdate(message); } } else { if (typeof contact === 'undefined') {
				 * contact = (message.groupId) ? mckGroupLayout .createGroup(message.groupId) : mckMessageLayout.createContact(message.to); } if (messageType === "APPLOZIC_01" || messageType === "MESSAGE_RECEIVED") { if (typeof contact !== 'undefined') { var isGroupTab = $mck_msg_inner.data('isgroup'); if (typeof tabId !== 'undefined' && tabId === contact.contactId && isGroupTab === contact.isGroup) { if (message.conversationId && (IS_MCK_TOPIC_HEADER || IS_MCK_TOPIC_BOX)) { var currConvId = $mck_msg_inner .data('mck-conversationid'); if (currConvId && currConvId.toString() === message.conversationId .toString()) { mckMessageLayout.addMessage(message, true, true, true); mckMessageService .sendReadUpdate(message.pairedMessageKey); } } else { mckMessageLayout.addMessage(message, true, true, true); mckMessageService .sendReadUpdate(message.pairedMessageKey); } if (!message.groupId) { $applozic("#mck-tab-status").html("Online"); mckUserUtils.updateUserStatus({ 'userId' : message.to,
				 * 'status' : 1 }); } // Todo: use contactNumber instead of contactId // for Google Contacts API. } else { if (message.contentType !== 10) { var ucTabId = (message.groupId) ? 'group_' + contact.contactId : 'user_' + contact.contactId; mckMessageLayout .incrementUnreadCount(ucTabId); } mckMessageService.sendDeliveryUpdate(message); } if (notifyUser) { mckNotificationService.notifyUser(message); } } } else if (messageType === "APPLOZIC_02") { if (($applozic("." + message.oldKey).length === 0 && $applozic("." + message.key).length === 0) || message.contentType === 10) { if (mckContactListLength > 0) { mckMessageLayout.addContactsFromMessage( message, true); } else { if (typeof contact !== 'undefined') { var isGroupTab = $mck_msg_inner .data('isgroup'); if (typeof tabId !== 'undefined' && tabId === contact.contactId && isGroupTab === contact.isGroup) { mckMessageLayout.addMessage(message, true, true, true); if (message.type === 3) { $applozic( "." + message.key + "
				 * .mck-message-status") .removeClass( 'mck-icon-time') .addClass('mck-icon-sent'); mckMessageLayout .addTooltip(message.key); } } } } } } }
				 */
				$mck_loading.removeClass('vis').addClass('n-vis');
			};
			_this.getMessageFeed = function(message) {
				var messageFeed = {};
				messageFeed.key = message.key;
				messageFeed.timeStamp = message.createdAtTime;
				messageFeed.message = message.message;
				messageFeed.from = (message.type === 4) ? message.to : MCK_USER_ID;
				if (message.groupId) {
					messageFeed.to = message.groupId;
				} else {
					messageFeed.to = (message.type === 5) ? message.to : MCK_USER_ID;
				}
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
					var file = $applozic.extend({}, message.fileMeta);
					file.url = MCK_FILE_URL + '/rest/ws/aws/file/' + message.fileMeta.blobKey;
					delete file.blobKey;
					messageFeed.file = file;
				}
				messageFeed.source = message.source;
				return messageFeed;
			};
			_this.updateUnreadCountonChatIcon = function(response) {
				var data = response.data;
				MCK_TOTAL_UNREAD_COUNT = data.totalUnreadCount;
				if ($mckChatLauncherIcon.length > 0 && MCK_TOTAL_UNREAD_COUNT > 0) {
					$mckChatLauncherIcon.html(MCK_TOTAL_UNREAD_COUNT);
				}
				if (IS_LAUNCH_ON_UNREAD_MESSAGE_ENABLED) {
					var contactIdWithUnreadMessage = null;
					var unreadCountForUser = 0;
					if (data.users.length > 0) {
						$applozic.each(data.users, function(i, userDetail) {
							if (userDetail.unreadCount > 0 && contactIdWithUnreadMessage !== null) {
								return;
							}
							if (userDetail.unreadCount > 0) {
								contactIdWithUnreadMessage = userDetail.userId;
								unreadCountForUser = userDetail.unreadCount;
							}
						});
						if (MCK_TOTAL_UNREAD_COUNT > 0 && ($mck_sidebox.css('display') === 'none')) {
							if (contactIdWithUnreadMessage !== null && unreadCountForUser === MCK_TOTAL_UNREAD_COUNT) {
								mckMessageLayout.loadTab({
									tabId : contactIdWithUnreadMessage,
									'isGroup' : false
								});
							} else {
								mckMessageLayout.loadTab({
									tabId : '',
									'isGroup' : false
								});
							}
						}
					}
				}
			};
		}
		function MckUserUtils() {
			var _this = this;
			var $mck_msg_form = $applozic("#mck-msg-form");
			var $mck_msg_error = $applozic("#mck-msg-error");
			var $mck_tab_title = $applozic("#mck-tab-individual .mck-tab-title");
			var $mck_tab_status = $applozic("#mck-tab-individual .mck-tab-status");
			var $mck_typing_box = $applozic(".mck-typing-box");
			var $mck_block_button = $applozic("#mck-block-button");
			var $mck_message_inner = $applozic("#mck-message-cell .mck-message-inner-right");
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
					var userIdArray = new Array();
					userIdArray.push(params.userId);
					mckContactService.getUsersDetail(userIdArray);
				}
			};
			_this.getUserDetail = function(userId) {
				if (typeof MCK_USER_DETAIL_MAP[userId] === 'object') {
					return MCK_USER_DETAIL_MAP[userId];
				} else {
					return;
				}
			};
			_this.checkUserConnectedStatus = function() {
				var userIdArray = new Array();
				var otherUserIdArray = new Array();
				$applozic(".mck-user-ol-status").each(function() {
					var tabId = $applozic(this).data('mck-id');
					if (typeof tabId !== "undefined" && tabId !== "") {
						userIdArray.push(tabId);
						var htmlId = mckContactUtils.formatContactId('' + tabId);
						$applozic(this).addClass(htmlId);
						$applozic(this).next().addClass(htmlId);
					}
				});
				if (userIdArray.length > 0) {
					$applozic.each(userIdArray, function(i, userId) {
						if (typeof MCK_USER_DETAIL_MAP[userId] === 'undefined') {
							otherUserIdArray.push(userId);
						}
					});
					(otherUserIdArray.length > 0) ? mckContactService.getUsersDetail(otherUserIdArray, {
						setStatus : true
					}) : _this.updateUserConnectedStatus();
				}
			};
			_this.updateUserConnectedStatus = function() {
				$applozic(".mck-user-ol-status").each(function() {
					var $this = $applozic(this);
					var tabId = $this.data('mck-id');
					if (tabId) {
						var userDetail = MCK_USER_DETAIL_MAP[tabId];
						if (typeof MCK_USER_DETAIL_MAP[tabId] !== 'undefined' && userDetail.connected) {
							$this.removeClass('n-vis').addClass('vis');
							$this.next().html('(Online)');
						} else {
							$this.removeClass('vis').addClass('n-vis');
							$this.next().html('(Offline)');
						}
					}
				});
			};
			_this.toggleBlockUser = function(tabId, isBlocked) {
				$mck_message_inner = mckMessageLayout.getMckMessageInner();
				if (isBlocked) {
					$mck_msg_error.html('You have blocked this user.');
					$mck_msg_error.removeClass('n-vis').addClass('vis').addClass('mck-no-mb');
					$applozic("#mck-write-box").removeClass('vis').addClass('n-vis');
					$mck_tab_title.removeClass('mck-tab-title-w-status');
					$mck_tab_status.removeClass('vis').addClass('n-vis');
					$mck_typing_box.removeClass('vis').addClass('n-vis');
					$mck_message_inner.data('blocked', true);
					$mck_block_button.html('Unblock User');
				} else {
					$mck_msg_error.html('');
					$mck_msg_error.removeClass('vis').addClass('n-vis').removeClass('mck-no-mb');
					$applozic("#mck-write-box").removeClass('n-vis').addClass('vis');
					$mck_message_inner.data('blocked', false);
					$mck_block_button.html('Block User');
					if (!MCK_BLOCKED_BY_MAP[tabId] && (w.MCK_OL_MAP[tabId] || MCK_LAST_SEEN_AT_MAP[tabId])) {
						if (w.MCK_OL_MAP[tabId]) {
							$mck_tab_status.html("Online");
							$mck_tab_status.attr('title', "Online");
						} else if (MCK_LAST_SEEN_AT_MAP[tabId]) {
							var lastSeenAt = mckDateUtils.getLastSeenAtStatus(MCK_LAST_SEEN_AT_MAP[tabId]);
							$mck_tab_status.html(lastSeenAt);
							$mck_tab_status.attr('title', lastSeenAt);
						}
						$mck_tab_title.addClass("mck-tab-title-w-status");
						$mck_tab_status.removeClass('n-vis').addClass('vis');
					}
				}
			};
		}
		function MckContactService() {
			var _this = this;
			var $mck_search_List = $applozic("#mck-search-list");
			var $mck_sidebox_search = $applozic("#mck-sidebox-search");
			var $mck_search_loading = $applozic("#mck-search-loading");
			var $mck_search_inner = $applozic("#mck-search-cell .mck-message-inner-left");
			var USER_BLOCK_URL = "/rest/ws/user/block";
			var CONTACT_NAME_URL = "/rest/ws/user/info";
			var USER_DETAIL_URL = "/rest/ws/user/detail";
			var CONTACT_LIST_URL = "/rest/ws/user/v3/filter";
			var USER_STATUS_URL = "/rest/ws/user/chat/status";
			_this.getContactDisplayName = function(userIdArray) {
				var mckContactNameArray = [];
				if (userIdArray.length > 0 && userIdArray[0]) {
					var data = "";
					var uniqueUserIdArray = userIdArray.filter(function(item, pos) {
						return userIdArray.indexOf(item) === pos;
					});
					for (var i = 0; i < uniqueUserIdArray.length; i++) {
						var userId = uniqueUserIdArray[i];
						if (typeof MCK_CONTACT_NAME_MAP[userId] === 'undefined') {
							data += "userIds=" + encodeURIComponent(userId) + "&";
						}
					}
					if (data.lastIndexOf("&") === data.length - 1) {
						data = data.substring(0, data.length - 1);
					}
					if (data) {
						$applozic.ajax({
							url : MCK_BASE_URL + CONTACT_NAME_URL,
							data : data,
							global : false,
							type : 'get',
							success : function(data) {
								for (var userId in data) {
									if (data.hasOwnProperty(userId)) {
										mckContactNameArray.push([ userId, data[userId] ]);
										MCK_CONTACT_NAME_MAP[userId] = data[userId];
										var contact = mckMessageLayout.fetchContact(userId);
										contact.displayName = data[userId];
									}
								}
								mckStorage.updateMckContactNameArray(mckContactNameArray);
							},
							error : function() {}
						});
					}
				}
			};

			_this.fetchContacts = function(params) {
				var response = new Object();
				var roleNameListParam = "";
				if (params.roleNameList) {
					for (var i = 0; i < params.roleNameList.length; i++) {
					    roleNameListParam += "&" + "roleNameList=" + params.roleNameList[i];
					}
				}
				$applozic.ajax({
					url : MCK_BASE_URL + CONTACT_LIST_URL + "?startIndex=0&pageSize=30&orderBy=1" + roleNameListParam,
					type : 'get',
					global : false,
					success : function(response) {
						if (params.callback) {
							params.callback(response);
						}
					},
					error : function() {

					}
				});
			};
			_this.loadContacts = function() {
				$mck_search_loading.removeClass('n-vis').addClass('vis');
				$mck_search_List.html('');
				var userIdArray = [];
				$applozic.ajax({
					url : MCK_BASE_URL + CONTACT_LIST_URL + "?startIndex=0&pageSize=30&orderBy=1",
					type : 'get',
					global : false,
					success : function(response) {
						var data = response.response;
						$mck_search_loading.removeClass('vis').addClass('n-vis');
						if ($mck_sidebox_search.length == 0 || $mck_sidebox_search.hasClass('vis')) {
							if (data === null || data.length === 0) {
								$mck_search_inner.html('<div class="mck-no-data-text mck-text-muted">No contacts yet!</div>');
							} else if (typeof data === 'object' && data.users.length > 0) {
								var mckContactNameArray = [];
								$applozic.each(data.users, function(i, user) {
									if (typeof user.userId !== "undefined") {
										userIdArray.push(user.userId);
										var contact = mckMessageLayout.getContact('' + user.userId);
										contact = (typeof contact === 'undefined') ? mckMessageLayout.createContactWithDetail(user) : mckMessageLayout.updateContactDetail(contact, user);
										MCK_CONTACT_ARRAY.push(contact);
										mckContactNameArray.push([ user.userId, contact.displayName ]);
										if (user.connected) {
											w.MCK_OL_MAP[user.userId] = true;
										} else {
											w.MCK_OL_MAP[user.userId] = false;
											if (typeof user.lastSeenAtTime !== "undefined") {
												MCK_LAST_SEEN_AT_MAP[user.userId] = user.lastSeenAtTime;
											}
										}
									}
								});
								mckStorage.updateMckContactNameArray(mckContactNameArray);
								if (userIdArray !== null && userIdArray.length > 0) {
									mckMessageLayout.addContactsToSearchList();
									return;
								}
							}
							$mck_search_inner.html('<div class="mck-no-data-text mck-text-muted">No contacts yet!</div>');
						}
					},
					error : function() {
						$mck_search_loading.removeClass('vis').addClass('n-vis');
						w.console.log('Unable to load contacts. Please reload page.');
					}
				});
			};
			_this.getUsersDetail = function(userIdArray, params) {
				if (typeof userIdArray === 'undefined' || userIdArray.length < 1) {
					return;
				}
				var data = "";
				var uniqueUserIdArray = userIdArray.filter(function(item, pos) {
					return userIdArray.indexOf(item) === pos;
				});
				for (var i = 0; i < uniqueUserIdArray.length; i++) {
					var userId = uniqueUserIdArray[i];
					if (typeof MCK_USER_DETAIL_MAP[userId] === 'undefined') {
						data += "userIds=" + encodeURIComponent(userId) + "&";
					}
				}
				if (data === '') {
					if (params.setStatus) {
						mckUserUtils.updateUserConnectedStatus();
					} else if (params.message) {
						mckMessageLayout.populateMessage(params.messageType, params.message, params.notifyUser);
					}
					return;
				}
				$applozic.ajax({
					url : MCK_BASE_URL + USER_DETAIL_URL + "?" + data,
					type : 'get',
					contentType : 'application/json',
					success : function(data) {
						if (data + '' === 'null') {
							if (params.message) {
								mckMessageLayout.populateMessage(params.messageType, params.message, params.notifyUser);
							}
						} else {
							if (data.length > 0) {
								$applozic.each(data, function(i, userDetail) {
									MCK_USER_DETAIL_MAP[userDetail.userId] = userDetail;
									w.MCK_OL_MAP[userDetail.userId] = (userDetail.connected);
									var contact = mckMessageLayout.getContact('' + userDetail.userId);
									contact = (typeof contact === 'undefined') ? mckMessageLayout.createContactWithDetail(userDetail) : mckMessageLayout.updateContactDetail(contact, userDetail);
									MCK_CONTACT_ARRAY.push(contact);
								});
								if (params) {
									if (params.setStatus) {
										mckUserUtils.updateUserConnectedStatus();
									} else if (params.message) {
										mckMessageLayout.populateMessage(params.messageType, params.message, params.notifyUser);
									}
								}
							}
						}
					},
					error : function() {}
				});
			};
			_this.getUserStatus = function(params) {
				var response = new Object();
				$applozic.ajax({
					url : MCK_BASE_URL + USER_STATUS_URL,
					type : 'get',
					success : function(data) {
						if (data.users.length > 0) {
							MCK_GROUP_SEARCH_ARRAY = [];
							$applozic.each(data.users, function(i, user) {
								var contact = mckMessageLayout.getContact('' + user.userId);
								contact = (typeof contact === 'undefined') ? mckMessageLayout.createContactWithDetail(user) : mckMessageLayout.updateContactDetail(contact, user);
								MCK_GROUP_SEARCH_ARRAY.push(contact.contactId);
							});
						}
						response.status = "success";
						response.data = data;
						if (params.callback) {
							params.callback(response);
						}
						return;
					},
					error : function() {
						response.status = "error";
						if (params.callback) {
							params.callback(response);
						}
					}
				});
			};
			_this.blockUser = function(userId, isBlock) {
				if (!userId || typeof isBlock === 'undefined') {
					return;
				}
				var data = "userId=" + userId + "&block=" + isBlock;
				$applozic.ajax({
					url : MCK_BASE_URL + USER_BLOCK_URL,
					type : 'get',
					data : data,
					success : function(data) {
						if (typeof data === 'object') {
							if (data.status === 'success') {
								MCK_BLOCKED_TO_MAP[userId] = isBlock;
								mckUserUtils.toggleBlockUser(userId, isBlock);
							}
						}
					},
					error : function() {}
				});
			};
		}
		function MckGroupLayout() {
			var _this = this;
			var $mck_tab_info = $applozic("#mck-tab-info");
			var $mck_msg_form = $applozic("#mck-msg-form");
			var $mck_msg_error = $applozic("#mck-msg-error");
			var $mck_container = $applozic(".mck-container");
			var $mck_new_group = $applozic("#mck-new-group");
			var $mck_no_gsm_text = $applozic("#mck-no-gsm-text");
			var $mck_loading = $applozic("#mck-contact-loading");
			var $mck_group_member_search = $applozic("#mck-group-member-search");
			var $mck_right_panel = $applozic(".mck-container .right");
			var $mck_contacts_inner = $applozic(".mck-contacts-inner");
			var $mck_group_info_tab = $applozic("#mck-group-info-tab");
			var $mck_sidebox_search = $applozic("#mck-sidebox-search");
			var $mck_goup_search_box = $applozic("#mck-goup-search-box");
			var $mck_sidebox_content = $applozic("#mck-sidebox-content");
			var $mck_group_name_edit = $applozic("#mck-group-name-edit");
			var $mck_group_name_save = $applozic("#mck-group-name-save");
			var $mck_group_create_tab = $applozic("#mck-group-create-tab");
			var $mck_group_info_close = $applozic("#mck-group-info-close");
			var $mck_btn_group_create = $applozic("#mck-btn-group-create");
			var $mck_contacts_content = $applozic("#mck-contacts-content");
			var $mck_group_icon_change = $applozic("#mck-group-icon-change");
			var $mck_group_icon_upload = $applozic("#mck-group-icon-upload");
			var $mck_group_search_list = $applozic("#mck-group-search-list");
			var $mck_group_member_List = $applozic("#mck-group-member-list");
			var $mck_group_create_type = $applozic("#mck-group-create-type");
			var $mck_group_create_close = $applozic("#mck-group-create-close");
			var $mck_group_create_title = $applozic("#mck-group-create-title");
			var $mck_group_menu_options = $applozic(".mck-group-menu-options");
			var $mck_btn_group_icon_save = $applozic("#mck-btn-group-icon-save");
			var $mck_group_admin_options = $applozic(".mck-group-admin-options");
			var $mck_tab_title = $applozic("#mck-tab-individual .mck-tab-title");
			var $mck_tab_status = $applozic("#mck-tab-individual .mck-tab-status");
			var $mck_group_add_member_box = $applozic("#mck-group-add-member-box");
			var $mck_msg_inner = $applozic("#mck-message-cell .mck-message-inner");
			var $mck_group_title = $applozic("#mck-group-name-sec .mck-group-title");
			var $mck_group_info_icon_loading = $applozic("#mck-group-info-icon-loading");
			var $mck_group_member_search_list = $applozic("#mck-group-member-search-list");
			var $mck_group_create_icon_loading = $applozic("#mck-group-create-icon-loading");
			var $mck_group_info_icon = $applozic("#mck-group-info-icon-box .mck-group-icon");
			var $mck_group_create_icon = $applozic("#mck-group-create-icon-box .mck-group-icon");
			var $mck_group_create_overlay_box = $applozic("#mck-group-create-icon-box .mck-overlay-box");
			var $mck_group_create_overlay_label = $applozic("#mck-group-create-icon-box .mck-overlay-label");
			var groupContactbox = '<li id="li-gm-${contHtmlExpr}" class="${contIdExpr} mck-li-group-member" data-mck-id="${contIdExpr}" data-alpha="${contFirstAlphaExpr}">' + '<div class="mck-row mck-group-member-info" title="${contNameExpr}">' + '<div class="blk-lg-3">{{html contImgExpr}}</div>' + '<div class="blk-lg-9">' + '<div class="mck-row">' + '<div class="blk-lg-8 mck-cont-name mck-truncate"><strong>${contNameExpr}</strong></div>' + '<div class="blk-lg-4 mck-group-admin-text move-right ${isAdminExpr}"><span>Admin</span></div></div>' + '<div class="mck-row">' + '<div class="blk-lg-10 mck-truncate mck-last-seen-status" title="${contLastSeenExpr}">${contLastSeenExpr}</div>' + '<div class="blk-lg-2 mck-group-admin-options ${enableAdminMenuExpr}">' + '<div class="mck-menu-box n-vis"><div class="mck-dropdown-toggle mck-group-admin-menu-toggle mck-text-center" data-toggle="mckdropdown" aria-expanded="true">' + '<span class="mck-caret"></span></div>' + '<ul id="mck-group-admin-menu" class="mck-dropdown-menu mck-group-admin-menu mck-tab-menu-box menu-right" role="menu">' + '<li><a href="#" class="mck-btn-remove-member menu-item" title="Remove Member">Remove Member</a></li>' + '</ul></div></div>' + '</div></div></div></li>';
			var groupSearchContact = '<li id="li-${contHtmlExpr}" class="${contIdExpr} mck-li-group-member" data-mck-id="${contIdExpr}">' + '<a class="mck-add-to-group" href="#" data-mck-id="${contIdExpr}">' + '<div class="mck-row" title="${contNameExpr}">' + '<div class="blk-lg-3">{{html contImgExpr}}</div>' + '<div class="blk-lg-9">' + '<div class="mck-row"><div class="blk-lg-12 mck-cont-name mck-truncate"><strong>${contNameExpr}</strong></div></div>' + '<div class="mck-row"><div class="blk-lg-12 mck-truncate mck-last-seen-status" title="${contLastSeenExpr}">${contLastSeenExpr}</div></div>' + '</div></div></a></li>';
			$applozic.template("groupMemberTemplate", groupContactbox);
			$applozic.template("groupSearchTemplate", groupSearchContact);
			$mck_new_group.on('click', function(e) {
				e.preventDefault();
				mckGroupLayout.loadCreateGroupTab();
				var width = $applozic('#mck-write-box').css('width');
				$applozic(".emoji-menu").css('width',width);
			});
			$mck_group_info_close.on('click', function(e) {
				e.preventDefault();
				$mck_group_info_tab.removeClass('vis').addClass('n-vis');
				$mck_container.removeClass('mck-panel-3');
				$applozic('.emoji-menu').removeClass('mck-panel-3');
				$applozic('body').removeClass('mck-panel-3');
				$mck_group_member_List.html('');
				// setting emaji width
				var width = $applozic('#mck-write-box').css('width');
				$applozic(".emoji-menu").css('width',width);
			});
			$mck_group_create_close.on('click', function(e) {
				e.preventDefault();
				$mck_group_create_tab.removeClass('vis').addClass('n-vis');
				$mck_container.removeClass('mck-panel-3');
				$applozic('.emoji-menu').removeClass('mck-panel-3');
				$applozic('body').removeClass('mck-panel-3');
				var width = $applozic('#mck-write-box').css('width');
				$applozic(".emoji-menu").css('width',width);
			});
			var MAX_GROUP_NAME_SIZE = 30;
			$applozic('.mck-group-name-box div[contenteditable]').keypress(function(e) {
				if (e.which === 8 || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40 || (e.ctrlKey && e.which === 97)) {
					return true;
				} else if (e.keyCode === 13 && !(e.shiftKey || e.ctrlKey)) {
					if ($applozic(e.target).hasClass('mck-group-create-title')) {
						_this.submitCreateGroup();
						return false;
					} else {
						return false;
					}
				} else {
					return MAX_GROUP_NAME_SIZE > this.innerHTML.length;
				}
			}).on('paste', function(e) {
				var $this = this;
				setTimeout(function() {
					var len = $this.innerText.length;
					if (len > MAX_GROUP_NAME_SIZE) {
						$this.innerHTML = $this.innerText.substring(0, MAX_GROUP_NAME_SIZE);
						mckUtils.setEndOfContenteditable($this);
					}
					return false;
				}, 'fast');
			}).on('drop', function(e) {
				e.preventDefault();
				e.stopPropagation();
			});
			$applozic("#mck-group-info-icon-box .mck-overlay").on('click', function(e) {
				$mck_group_icon_change.trigger('click');
			});
			$applozic(d).on('mouseenter', '.mck-group-info-icon-box.mck-hover-on', function() {
				$applozic(this).find('.mck-overlay-box').removeClass('n-vis');
			}).on('mouseleave', '.mck-group-info-icon-box.mck-hover-on', function() {
				$applozic(this).find('.mck-overlay-box').addClass('n-vis');
			});
			$applozic('#mck-group-create-icon-box .mck-overlay').on('click', function(e) {
				$mck_group_icon_upload.trigger('click');
			});
			$applozic(d).on('mouseenter', '.mck-group-create-icon-box.mck-hover-on', function() {
				$applozic(this).find('.mck-overlay-box').removeClass('n-vis');
			}).on('mouseleave', '.mck-group-create-icon-box.mck-hover-on', function() {
				var $this = $applozic(this);
				if ($this.find('.mck-group-icon-default').length === 0) {
					$this.find('.mck-overlay-box').addClass('n-vis');
				}
			});
			$mck_group_name_edit.on('click', function() {
				$mck_group_title.attr('contenteditable', true).focus();
				mckUtils.setEndOfContenteditable($mck_group_title[0]);
				$mck_group_name_save.removeClass('n-vis').addClass('vis');
				$mck_group_name_edit.removeClass('vis').addClass('n-vis');
			})
			$mck_btn_group_icon_save.on('click', function() {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var iconUrl = $mck_group_info_icon.data('iconurl');
				if (iconUrl) {
					var currTabId = $mck_msg_inner.data('mck-id');
					var isGroupTab = $mck_msg_inner.data('isgroup');
					if (currTabId && isGroupTab) {
						setTimeout(function() {
							$mck_btn_group_icon_save.removeClass('vis').addClass('n-vis');
						}, 1000);
						$mck_group_info_icon.data('iconurl', "");
						var params = {
							groupId : currTabId,
							imageUrl : iconUrl,
							apzCallback : mckGroupLayout.onUpdateGroupInfo
						}
						mckGroupService.updateGroupInfo(params);
					}
				} else {
					$mck_group_title.addClass('mck-req-border');
				}
			});
			$mck_group_name_save.on('click', function() {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var groupName = $applozic.trim($mck_group_title.text());
				if (groupName.length > 0) {
					var currTabId = $mck_msg_inner.data('mck-id');
					var isGroupTab = $mck_msg_inner.data('isgroup');
					if (currTabId && isGroupTab) {
						$mck_group_name_edit.removeClass('n-vis').addClass('vis');
						$mck_group_name_save.removeClass('vis').addClass('n-vis');
						$mck_group_title.attr('contenteditable', false);
						var params = {
							groupId : currTabId,
							name : groupName,
							apzCallback : mckGroupLayout.onUpdateGroupInfo
						}
						mckGroupService.updateGroupInfo(params);
					}
				} else {
					$mck_group_title.addClass('mck-req-border');
				}
			});
			$mck_btn_group_create.on('click', function() {
				_this.submitCreateGroup();
			});
			_this.submitCreateGroup = function() {
				var groupName = $applozic.trim($mck_group_create_title.text());
				var groupType = $mck_group_create_type.val();
				var iconUrl = $mck_group_create_icon.data('iconurl');
				if (groupName.length > 0) {
					var params = {
						groupName : groupName
					}
					if (groupType) {
						groupType = parseInt(groupType);
						if (GROUP_TYPE_MAP.indexOf(groupType) !== -1) {
							params.type = groupType;
						}
					}
					if (iconUrl) {
						params.groupIcon = iconUrl;
					}
					$mck_group_create_icon.data('iconurl', '');
					params.isInternal = true;
					$mck_btn_group_create.attr('disabled', true);
					$mck_btn_group_create.html('Creating Group...');
					mckMessageService.getGroup(params);
				} else {
					$mck_group_create_title.addClass('mck-req-border');
				}
			};
			_this.getGroupDefaultIcon = function() {
				return '<div class="mck-group-icon-default"></div>';
			};
			_this.loadGroups = function(response) {
				var groups = response.data;
				MCK_GROUP_ARRAY.length = 0;
				$applozic.each(groups, function(i, groupFeed) {
					if ( (typeof groupFeed.id !== "undefined") ) {
						var group = mckGroupUtils.addGroup(groupFeed);
						MCK_GROUP_ARRAY.push(group);
					}
				});
			};
			_this.getGroup = function(groupId) {
					if (typeof MCK_GROUP_MAP[groupId] === 'object') {
						return MCK_GROUP_MAP[groupId];
					}
					return null;
			};
			_this.getGroupDisplayName = function(groupId) {
				if (typeof MCK_GROUP_MAP[groupId] === 'object') {
					var group = MCK_GROUP_MAP[groupId];
					var displayName = group["displayName"];
					if (group.type === 3) {
						if (displayName.indexOf(MCK_USER_ID) !== -1) {
							displayName = displayName.replace(MCK_USER_ID, "").replace(":", "");
							if (typeof (MCK_GETUSERNAME) === "function") {
								var name = (MCK_GETUSERNAME(displayName));
								displayName = (name) ? name : displayName;
							}
						}
					}
					if (!displayName && group.type === 5) {
						displayName = 'Broadcast';
					}if (group.type === 10){
            for(var i= 0;i<Object.keys(group.users).length;i++){
              if((Object.values(group.users)[i]).role ===3){
              	displayName =(Object.values(group.users)[i]).userId;
                //console.log("groupName",displayName);
                break;
              }
          	}
					}
					if (!displayName) {
						displayName = group.contactId;
					}
					return displayName;
				} else {
					return groupId;
				}
			};
			_this.getGroupImage = function(imageSrc) {
				return (imageSrc) ? '<img src="' + imageSrc + '"/>' : '<img src="' + MCK_BASE_URL + '/resources/sidebox/css/app/images/mck-icon-group.png"/>';
			};
			_this.addMemberToGroup = function(group, userId) {
				if (typeof group.members === 'object') {
					if (group.members.indexOf(userId) === -1) {
						group.members.push(userId);
					}
					if (typeof group.removedMembersId === 'object' && (group.removedMembersId.indexOf(userId) !== -1)) {
						group.removedMembersId.splice(group.removedMembersId.indexOf(userId), 1);
					}
					MCK_GROUP_MAP[group.contactId] = group;
				}
				return group;
			};
			_this.removeMemberFromGroup = function(group, userId) {
				if (typeof group.removedMembersId !== 'object' || group.removedMembersId.length < 1) {
					group.removedMembersId = [];
					group.removedMembersId.push(userId);
				} else if (group.removedMembersId.indexOf(userId) === -1) {
					group.removedMembersId.push(userId);
				}
				MCK_GROUP_MAP[group.contactId] = group;
				return group;
			};
			_this.addGroupStatus = function(group) {
				var isGroupLeft = _this.isGroupLeft(group);
				if (isGroupLeft) {
					mckGroupLayout.onGroupLeft('', {
						groupId : group.contactId
					});
					$mck_tab_title.removeClass('mck-tab-title-w-status');
					$mck_tab_status.removeClass('vis').addClass('n-vis');
				} else if (group.members.length > 0) {
					var groupMembers = '';
					var isGroupMember = false;
					var subtitleLength = (group.members.length <= 30) ? group.members.length : 25;
					for (var i = 0; i < subtitleLength; i++) {
						if (MCK_USER_ID === '' + group.members[i] || (group.removedMembersId.indexOf(group.members[i]) !== -1)) {
							isGroupMember = true;
							continue;
						}
						var contact = mckMessageLayout.fetchContact('' + group.members[i]);
						var name = mckMessageLayout.getTabDisplayName(contact.contactId, false);
						groupMembers += ' ' + name + ',';
					}
					if (group.type !== 5 && group.type !== 6 || (isGroupMember && group.type !== 5)) {
						groupMembers += ' You';
					}
					if (group.members.length > 30) {
						groupMembers += ' and ' + (group.members.length - 25) + ' more';
					}
					groupMembers = groupMembers.replace(/,\s*$/, '');
					$mck_tab_status.html(groupMembers);
					$mck_tab_status.attr('title', groupMembers);
					$mck_tab_status.removeClass('n-vis').addClass('vis');
					$mck_tab_title.addClass('mck-tab-title-w-status');
					$mck_group_menu_options.removeClass('n-vis').addClass('vis');
					$mck_tab_info.addClass('mck-group-info-btn');
				} else {
					$mck_tab_title.removeClass('mck-tab-title-w-status');
					$mck_tab_status.removeClass('vis').addClass('n-vis');
					$mck_tab_info.removeClass('mck-group-info-btn');
				}
			};
			_this.disableGroupTab = function() {
				$mck_msg_error.html('You are no longer part of this group.');
				$mck_msg_error.removeClass('n-vis').addClass('vis').addClass('mck-no-mb');
				$applozic("#mck-write-box").removeClass('vis').addClass('n-vis');
				$mck_tab_title.removeClass("mck-tab-title-w-status");
				$mck_tab_status.removeClass('vis').addClass('n-vis');
			};
			_this.isGroupLeft = function(group) {
				var isGroupLeft = false;
				if (group.removedMembersId && group.removedMembersId.length > 0) {
					$applozic.each(group.removedMembersId, function(i, removedMemberId) {
						if (removedMemberId === MCK_USER_ID) {
							isGroupLeft = true;
						}
					});
				}
				return isGroupLeft;
			};
			_this.onGroupLeft = function(response, params) {
				$mck_loading.removeClass('vis').addClass('n-vis');
				if (typeof response === 'object') {
					if (response.status === "error") {
						alert("Unable to process your request. " + response.errorMessage);
						return;
					}
				}
				var groupId = params.groupId;
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				if ($mck_group_info_tab.hasClass('vis')) {
					var currGroupId = $mck_group_info_tab.data('mck-id');
					if (groupId === currGroupId) {
						$mck_group_info_close.trigger('click');
					}
				}
				var currTabId = $mck_msg_inner.data('mck-id');
				var isGroupTab = $mck_msg_inner.data('isgroup');
				if (currTabId === groupId.toString() && isGroupTab) {
					$mck_group_menu_options.removeClass('vis').addClass('n-vis');
					$mck_tab_info.removeClass('mck-group-info-btn');
					_this.disableGroupTab();
				}
			};
			_this.onAddedGroupMember = function(response, params) {
				$mck_loading.removeClass('vis').addClass('n-vis');
				if (typeof response === 'object') {
					if (response.status === "error") {
						alert("Unable to process your request. " + response.errorMessage);
						return;
					}
				}
				var groupId = params.groupId;
				var userId = params.userId;
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var group = "";
				if (groupId) {
					group = mckGroupUtils.getGroup(groupId)
				} else if (params.clientGroupId) {
					group = mckGroupUtils.getGroupByClientGroupId(params.clientGroupId);
				}
				if (typeof group === 'object') {
					group = _this.addMemberToGroup(group, userId);
					if ($mck_group_info_tab.hasClass('vis')) {
						var currGroupId = $mck_group_info_tab.data('mck-id');
						if (groupId === currGroupId) {
							var contact = mckMessageLayout.fetchContact('' + userId);
							if ($applozic("#mck-group-member-list #li-gm-user-" + contact.htmlId).length === 0) {
								_this.addGroupMember(group, contact);
							}
							_this.sortGroupMemberHtmlList();
							_this.enableGroupAdminMenuToggle();
						}
					}
					var currTabId = $mck_msg_inner.data('mck-id');
					var isGroupTab = $mck_msg_inner.data('isgroup');
					if (currTabId === groupId.toString() && isGroupTab) {
						_this.addGroupStatus(group);
					}
				} else {
					mckGroupService.getGroupFeed({
						'groupId' : groupId,
						'clientGroupId' : params.clientGroupId,
						'apzCallback' : mckGroupLayout.onGroupFeed
					});
				}
			};
			_this.onRemovedGroupMember = function(response, params) {
				$mck_loading.removeClass('vis').addClass('n-vis');
				if (typeof response === 'object') {
					if (response.status === "error") {
						alert("Unable to process your request. " + response.errorMessage);
						return;
					}
				}
				var groupId = params.groupId;
				var userId = params.userId;
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var group = "";
				if (groupId) {
					group = mckGroupUtils.getGroup(groupId)
				} else if (params.clientGroupId) {
					group = mckGroupUtils.getGroupByClientGroupId(params.clientGroupId);
				}
				if (typeof group === 'object') {
					group = _this.removeMemberFromGroup(group, userId);
					if ($mck_group_info_tab.hasClass('vis')) {
						var currGroupId = $mck_group_info_tab.data('mck-id');
						if (groupId === currGroupId) {
							var contact = mckMessageLayout.fetchContact('' + userId);
							var $liRemovedMember = $applozic("#li-gm-user-" + contact.htmlId);
							if ($liRemovedMember.length > 0) {
								$liRemovedMember.remove();
							}
						}
					}
					var currTabId = $mck_msg_inner.data('mck-id');
					var isGroupTab = $mck_msg_inner.data('isgroup');
					if (currTabId === groupId.toString() && isGroupTab) {
						_this.addGroupStatus(group);
					}
				} else {
					mckGroupService.getGroupFeed({
						'groupId' : groupId,
						'clientGroupId' : params.clientGroupId,
						'apzCallback' : mckGroupLayout.onGroupFeed
					});
				}
			};
			_this.onUpdateGroupInfo = function(response, params) {
				$mck_loading.removeClass('vis').addClass('n-vis');
				if (typeof response === 'object') {
					if (response.status === "error") {
						alert("Unable to process your request. " + response.errorMessage);
						return;
					}
				}
				var groupId = params.groupId;
				var groupInfo = params.groupInfo;
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var group = mckGroupUtils.getGroup(groupId);
				if (typeof group === 'object') {
					if (groupInfo.imageUrl) {
						group.imageUrl = groupInfo.imageUrl;
					}
					group.displayName = mckGroupLayout.getGroupDisplayName(groupId);
					if ($mck_group_info_tab.hasClass('vis')) {
						if (group.imageUrl) {
							$mck_group_info_icon.html(_this.getGroupImage(group.imageUrl));
						}
						$mck_group_title.html(group.displayName);
					}
					var currTabId = $mck_msg_inner.data('mck-id');
					var isGroupTab = $mck_msg_inner.data('isgroup');
					if (currTabId === groupId.toString() && isGroupTab) {
						$mck_tab_title.html(group.displayName);
					}
					if ($applozic("#li-group-" + group.htmlId).length > 0) {
						$applozic("#li-group-" + group.htmlId + " .name").html(group.displayName);
						if (group.imageUrl) {
							$applozic("#li-group-" + group.htmlId + " .icon").html("<img src=' " + group.imageUrl + "'>");
						}
					}
					MCK_GROUP_MAP[group.contactId] = group;
				}
			};
			_this.onGroupFeed = function(response, params) {
				$mck_loading.removeClass('vis').addClass('n-vis');
				if (response.status === 'success') {
					var groupFeed = response.data;
					var conversationPxy = groupFeed.conversationPxy;
					var group = mckGroupUtils.getGroup(groupFeed.id);
					var tabConvArray = new Array();
					if (typeof conversationPxy === "object") {
						MCK_CONVERSATION_MAP[conversationPxy.id] = conversationPxy;
						MCK_TOPIC_CONVERSATION_MAP[conversationPxy.topicId] = [ conversationPxy.id ];
						if (conversationPxy.topicDetail) {
							MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId] = $applozic.parseJSON(conversationPxy.topicDetail);
						}
						tabConvArray.push(conversationPxy);
					}
					if (tabConvArray.length > 0) {
						MCK_TAB_CONVERSATION_MAP[params.groupId] = tabConvArray;
					}
					if (params.isMessage && typeof params.message === 'object') {
						mckMessageLayout.populateMessage(params.messageType, params.message, params.notifyUser);
					}
					if (params.isReloadTab) {
						_this.reloadGroupTab(group);
					}
				}
			};
			_this.getGroupFeedFromMessage = function(params) {
				var message = params.message;
				if (message) {
					params.groupId = message.groupId;
					params.isMessage = true;
					if (message.conversationId) {
						var conversationPxy = MCK_CONVERSATION_MAP[message.conversationId];
						if ((typeof conversationPxy !== 'object') || (typeof MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId] !== 'object')) {
							params.conversationId = message.conversationId;
						}
					}
					params.apzCallback = mckGroupLayout.onGroupFeed;
					mckGroupService.getGroupFeed(params);
				}
			};
			_this.reloadGroupTab = function(group) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var currTabId = $mck_msg_inner.data('mck-id');
				var isGroupTab = $mck_msg_inner.data('isgroup');
				if (currTabId === group.contactId.toString() && isGroupTab) {
					var params = {
						tabId : group.contactId,
						'isGroup' : true
					};
					var conversationId = $mck_msg_inner.data('mck-conversationid');
					if (conversationId) {
						params.conversationId = conversationId;
					}
					mckMessageLayout.loadTab(params);
				}
			};
			_this.loadGroupTab = function(response) {
				if (response.status === 'error') {
					alert("Unable to process your request. " + response.errorMessage);
				} else {
					var group = response.data;
					mckMessageLayout.loadTab({
						tabId : group.contactId,
						'isGroup' : true
					});
					$applozic("#mck-search").val("");
				}
			};
			_this.addMembersToGroupInfoList = function(group) {
				var userIdArray = group.members;
				userIdArray.sort();
				$mck_group_member_List.html('');
				$applozic.each(userIdArray, function(i, userId) {
					if (userId) {
						var contact = mckMessageLayout.fetchContact('' + userId);
						if ($applozic("#mck-group-member-list #li-gm-user-" + contact.htmlId).length === 0) {
							_this.addGroupMember(group, contact);
						}
					}
				});
				_this.sortGroupMemberHtmlList();
				_this.enableGroupAdminMenuToggle();
			};
			_this.enableGroupAdminMenuToggle = function() {
				$applozic('.mck-group-member-info').bind("mouseenter", function() {
					$applozic(this).find('.mck-menu-box').removeClass('n-vis');
				}).bind("mouseleave", function() {
					$applozic(this).find('.mck-menu-box').removeClass('open').addClass('n-vis');
				});
			};
			_this.addGroupMember = function(group, contact) {
				var isGroupAdminExpr = "n-vis";
				var enableAdminMenuExpr = "n-vis";
				var displayName = mckMessageLayout.getTabDisplayName(contact.contactId, false);
				if (group.adminName === MCK_USER_ID) {
					enableAdminMenuExpr = "vis";
				}
				if (contact.contactId === MCK_USER_ID) {
					displayName = "You";
					enableAdminMenuExpr = "n-vis";
				}
				var imgsrctag = mckMessageLayout.getContactImageLink(contact, displayName);
				var contHtmlExpr = 'user-' + contact.htmlId;
				var lastSeenStatus = "";
				if (!MCK_BLOCKED_TO_MAP[contact.contactId]) {
					if (w.MCK_OL_MAP[contact.contactId]) {
						lastSeenStatus = "online";
					} else if (MCK_LAST_SEEN_AT_MAP[contact.contactId]) {
						lastSeenStatus = mckDateUtils.getLastSeenAtStatus(MCK_LAST_SEEN_AT_MAP[contact.contactId]);
					}
				}
				if (contact.contactId === group.adminName) {
					isGroupAdminExpr = "vis";
				}
				var contactList = [ {
					contHtmlExpr : contHtmlExpr,
					contIdExpr : contact.contactId,
					contImgExpr : imgsrctag,
					contLastSeenExpr : lastSeenStatus,
					contNameExpr : displayName,
					contFirstAlphaExpr : displayName.charAt(0).toUpperCase(),
					isAdminExpr : isGroupAdminExpr,
					enableAdminMenuExpr : enableAdminMenuExpr
				} ];
				$applozic.tmpl("groupMemberTemplate", contactList).appendTo('#mck-group-member-list');
			};
			_this.addMembersToGroupSearchList = function() {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var groupId = $mck_msg_inner.data('mck-id');
				var isGroup = $mck_msg_inner.data('isgroup');
				if (isGroup) {
					var group = mckGroupUtils.getGroup(groupId);
					var contactArray = MCK_GROUP_SEARCH_ARRAY;
					contactArray = contactArray.filter(function(item, pos) {
						return contactArray.indexOf(item) === pos;
					});
					var searchArray = [];
					contactArray.sort();
					var groupMemberArray = group.members;
					$mck_group_member_search_list.html('');
					$applozic.each(contactArray, function(i, userId) {
						if (userId) {
							var contact = mckMessageLayout.fetchContact('' + userId);
							if (groupMemberArray.indexOf(contact.contactId) === -1 || (groupMemberArray.indexOf(contact.contactId) !== -1 && group.removedMembersId.indexOf(contact.contactId) !== -1)) {
								_this.addGroupSearchMember(contact);
								searchArray.push(contact);
							}
						}
					});
					_this.enableGroupAdminMenuToggle();
					(searchArray.length > 0) ? $mck_no_gsm_text.removeClass('vis').addClass('n-vis') : $mck_no_gsm_text.removeClass('n-vis').addClass('vis');
					mckMessageLayout.initAutoSuggest({
						'contactsArray' : searchArray,
						'$searchId' : $mck_group_member_search,
						'isContactSearch' : false
					});
				}
			};
			_this.addGroupSearchMember = function(contact) {
				var displayName = mckMessageLayout.getTabDisplayName(contact.contactId, false);
				var imgsrctag = mckMessageLayout.getContactImageLink(contact, displayName);
				var contHtmlExpr = 'user-' + contact.htmlId;
				var lastSeenStatus = "";
				if (!MCK_BLOCKED_TO_MAP[contact.contactId]) {
					if (w.MCK_OL_MAP[contact.contactId]) {
						lastSeenStatus = "online";
					} else if (MCK_LAST_SEEN_AT_MAP[contact.contactId]) {
						lastSeenStatus = mckDateUtils.getLastSeenAtStatus(MCK_LAST_SEEN_AT_MAP[contact.contactId]);
					}
				}
				var contactList = [ {
					contHtmlExpr : contHtmlExpr,
					contIdExpr : contact.contactId,
					contImgExpr : imgsrctag,
					contLastSeenExpr : lastSeenStatus,
					contNameExpr : displayName
				} ];
				$applozic.tmpl("groupSearchTemplate", contactList).appendTo('#mck-group-member-search-list');
			};
			_this.loadGroupInfo = function(params) {
				if (params.groupId) {
					$mck_group_title.attr('contenteditable', false);
					$mck_group_name_save.removeClass('vis').addClass('n-vis');
					$mck_group_name_edit.removeClass('n-vis').addClass('vis');
					$mck_group_info_tab.data('mck-id', params.groupId);
					$mck_btn_group_icon_save.removeClass('vis').addClass('n-vis');
					$mck_group_info_icon_loading.removeClass('vis').addClass('n-vis');
					$mck_group_info_icon.data('iconurl', "");
					if (params.conversationId) {
						$mck_group_info_tab.data('mck-conversation-id', params.conversationId);
					}
					$mck_group_member_List.html('');
					var group = mckGroupUtils.getGroup(params.groupId);
					if (typeof group === 'object') {
						$mck_group_info_icon.html(_this.getGroupImage(group.imageUrl));
						$mck_group_title.html(group.displayName);
						_this.addMembersToGroupInfoList(group);
						(group.adminName === MCK_USER_ID) ? $mck_group_add_member_box.removeClass('n-vis').addClass('vis') : $mck_group_add_member_box.removeClass('vis').addClass('n-vis');
					} else {
						mckGroupService.getGroupFeed({
							'groupId' : params.groupId,
							'apzCallback' : mckGroupLayout.onGroupFeed
						});
					}
					$applozic('body').removeClass('mck-panel-3');
					$applozic('.emoji-menu').removeClass('mck-panel-3');
					$mck_container.removeClass('mck-panel-3').addClass('mck-panel-3');
					$mck_group_create_tab.removeClass('vis').addClass('n-vis');
					$mck_group_info_tab.removeClass('n-vis').addClass('vis');
				}
			};
			_this.loadCreateGroupTab = function() {
				$mck_group_create_icon_loading.removeClass('vis').addClass('n-vis');
				$mck_group_create_icon.data('iconurl', "");
				$mck_group_create_title.html('')
				$mck_group_create_overlay_box.removeClass('n-vis');
				$mck_group_create_overlay_label.html('Add Group Icon');
				$mck_group_create_icon.html(_this.getGroupDefaultIcon());
				$applozic('body').addClass('mck-panel-3');
				$applozic('.emoji-menu').addClass('mck-panel-3');
				$mck_container.addClass('mck-panel-3');
				$mck_group_info_tab.removeClass('vis').addClass('n-vis');
				$mck_group_create_tab.removeClass('n-vis').addClass('vis');
			};
			_this.sortGroupMemberHtmlList = function() {
				$applozic('#mck-group-member-list .mck-li-group-member').sort(function(a, b) {
					return a.dataset.alpha > b.dataset.alpha;
				}).appendTo('#mck-group-member-list');
			};
			_this.addGroupMemberFromSearch = function(userId) {
				var groupId = $mck_group_info_tab.data('mck-id');
				if (typeof groupId !== 'undefined' && typeof userId !== 'undefined') {
					var group = mckGroupUtils.getGroup(groupId);
					if (typeof group === 'object' && MCK_USER_ID === group.adminName) {
						mckGroupService.addGroupMember({
							'groupId' : groupId,
							'userId' : userId,
							'apzCallback' : mckGroupLayout.onAddedGroupMember
						});
					} else {
						$mck_group_admin_options.removeClass('vis').addClass('n-vis');
					}
				}
				$mck_goup_search_box.mckModal('hide');
			};
		}
		function MckStorage() {
			var _this = this;
			var MCK_MESSAGE_ARRAY = [];
			var MCK_CONTACT_NAME_ARRAY = [];
			_this.getMckMessageArray = function() {
				return (typeof (w.sessionStorage) !== "undefined") ? $applozic.parseJSON(w.sessionStorage.getItem("mckMessageArray")) : MCK_MESSAGE_ARRAY;
			};
			_this.clearMckMessageArray = function() {
				if (typeof (w.sessionStorage) !== "undefined") {
					w.sessionStorage.removeItem("mckMessageArray");
				} else {
					MCK_MESSAGE_ARRAY.length = 0;
				}
			};
			_this.setMckMessageArray = function(messages) {
				if (typeof (w.sessionStorage) !== "undefined") {
					w.sessionStorage.setItem('mckMessageArray', w.JSON.stringify(messages));
				} else {
					MCK_MESSAGE_ARRAY = messages;
				}
			};
			_this.updateMckMessageArray = function(mckMessageArray) {
				if (typeof (w.sessionStorage) !== "undefined") {
					var mckLocalMessageArray = $applozic.parseJSON(w.sessionStorage.getItem('mckMessageArray'));
					if (mckLocalMessageArray !== null) {
						mckLocalMessageArray = mckLocalMessageArray.concat(mckMessageArray);
						w.sessionStorage.setItem('mckMessageArray', w.JSON.stringify(mckLocalMessageArray));
					} else {
						w.sessionStorage.setItem('mckMessageArray', w.JSON.stringify(mckMessageArray));
					}
					return mckMessageArray;
				} else {
					MCK_MESSAGE_ARRAY = MCK_MESSAGE_ARRAY.concat(mckMessageArray);
					return MCK_MESSAGE_ARRAY;
				}
			};
			_this.getMckContactNameArray = function() {
				return (typeof (w.sessionStorage) !== "undefined") ? $applozic.parseJSON(w.sessionStorage.getItem("mckContactNameArray")) : MCK_CONTACT_NAME_ARRAY;
			};
			_this.setMckContactNameArray = function(mckContactNameArray) {
				if (typeof (w.sessionStorage) !== "undefined") {
					w.sessionStorage.setItem('mckContactNameArray', w.JSON.stringify(mckContactNameArray));
				} else {
					MCK_CONTACT_NAME_ARRAY = mckContactNameArray;
				}
			};
			_this.updateMckContactNameArray = function(mckContactNameArray) {
				if (typeof (w.sessionStorage) !== "undefined") {
					var mckLocalcontactNameArray = $applozic.parseJSON(w.sessionStorage.getItem('mckContactNameArray'));
					if (mckLocalcontactNameArray !== null) {
						mckContactNameArray = mckContactNameArray.concat(mckLocalcontactNameArray);
					}
					w.sessionStorage.setItem('mckContactNameArray', w.JSON.stringify(mckContactNameArray));
					return mckContactNameArray;
				} else {
					MCK_CONTACT_NAME_ARRAY = MCK_CONTACT_NAME_ARRAY.concat(mckContactNameArray);
					return MCK_CONTACT_NAME_ARRAY;
				}
			};
		}
		function MckMapLayout() {
			var _this = this;
      var GEOCODER = '';
			var CURR_LOC_ADDRESS = '';
			var IS_LOC_SHARE_INIT = false;
			var $mck_my_loc = $applozic('#mck-my-loc');
		  var $mck_btn_loc = $applozic("#mck-btn-loc");
			var $mck_loc_box = $applozic("#mck-loc-box");
			var $mck_loc_lat = $applozic("#mck-loc-lat");
			var $mck_loc_lon = $applozic("#mck-loc-lon");
			var $mck_footer = $applozic("#mck-sidebox-ft");
			var $mck_file_menu = $applozic("#mck-file-menu");
			var $mck_btn_attach = $applozic("#mck-btn-attach");
			var $mckMapContent = $applozic("#mck-map-content");
			var $mck_loc_address = $applozic("#mck-loc-address");
			_this.init = function() {
				if (IS_MCK_LOCSHARE && w.google && typeof (w.google.maps) === 'object') {
					GEOCODER = new w.google.maps.Geocoder;
          $mck_btn_loc.on('click', function() {
                         if (IS_LOC_SHARE_INIT) {
                             $mck_loc_box.mckModal();
                         } else {
                             mckMapUtils.getCurrentLocation(_this.onGetCurrLocation, _this.onErrorCurrLocation);
                             IS_LOC_SHARE_INIT = true;
                         }

                     });
				}
				$mck_my_loc.on("click", function() {
					mckMapUtils.getCurrentLocation(_this.onGetMyCurrLocation, _this.onErrorMyCurrLocation);
				});
			};
			_this.onGetCurrLocation = function(loc) {
				MCK_CURR_LATITIUDE = loc.coords.latitude;
				MCK_CURR_LONGITUDE = loc.coords.longitude;
				_this.openMapBox();
			};
			_this.onErrorCurrLocation = function() {
				MCK_CURR_LATITIUDE = 46.15242437752303;
				MCK_CURR_LONGITUDE = 2.7470703125;
				_this.openMapBox();
			};
			_this.onErrorMyCurrLocation = function(err) {
				alert("Unable to retrieve your location. ERROR(" + err.code + "): " + err.message);
			};
			_this.onGetMyCurrLocation = function(loc) {
				MCK_CURR_LATITIUDE = loc.coords.latitude;
				MCK_CURR_LONGITUDE = loc.coords.longitude;
				$mck_loc_lat.val(MCK_CURR_LATITIUDE);
				$mck_loc_lon.val(MCK_CURR_LONGITUDE);
				$mck_loc_lat.trigger('change');
				$mck_loc_lon.trigger('change');
				if (CURR_LOC_ADDRESS) {
					$mck_loc_address.val(CURR_LOC_ADDRESS);
				} else if (GEOCODER) {
					var latlng = {
						lat : MCK_CURR_LATITIUDE,
						lng : MCK_CURR_LONGITUDE
					};
					GEOCODER.geocode({
						'location' : latlng
					}, function(results, status) {
						if (status === "OK") {
							if (results[1]) {
								CURR_LOC_ADDRESS = results[1].formatted_address;
							}
						}
					});
				}
			};
			_this.openMapBox = function() {
				$mckMapContent.locationpicker({
					location : {
						latitude : MCK_CURR_LATITIUDE,
						longitude : MCK_CURR_LONGITUDE
					},
					radius : 0,
					scrollwheel : true,
					inputBinding : {
						latitudeInput : $mck_loc_lat,
						longitudeInput : $mck_loc_lon,
						locationNameInput : $mck_loc_address
					},
					enableAutocomplete : true,
					enableReverseGeocode : true,
					onchanged : function(currentLocation) {
						MCK_CURR_LATITIUDE = currentLocation.latitude;
						MCK_CURR_LONGITUDE = currentLocation.longitude;
					}
				});
				$mck_loc_box.on('shown.bs.mck-box', function() {
					$mckMapContent.locationpicker('autosize');
				});
        $mck_loc_box.mckModal();
			};
		}
		function MckMapService() {
			var _this = this;
			var $mck_msg_to = $applozic("#mck-msg-to");
			var $mck_btn_loc = $applozic("#mck-btn-loc");
			var $mck_loc_box = $applozic('#mck-loc-box');
			var $mck_msg_sbmt = $applozic("#mck-msg-sbmt");
			var $mck_msg_error = $applozic("#mck-msg-error");
			var $mck_loc_submit = $applozic("#mck-loc-submit");
			var $mck_msg_response = $applozic("#mck-msg-response");
			var $mck_response_text = $applozic("#mck_response_text");
			var $mck_msg_inner = $applozic("#mck-message-cell .mck-message-inner-right");
			$mck_btn_loc.on("click", function() {
				$mck_loc_box.mckModal();
			});
			$mck_loc_submit.on("click", function() {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				var messagePxy = {
					"type" : 5,
					"contentType" : 2,
					"message" : w.JSON.stringify(mckMapUtils.getSelectedLocation())
				};
				var conversationId = $mck_msg_inner.data('mck-conversationid');
				var topicId = $mck_msg_inner.data('mck-topicid');
				if (conversationId) {
					messagePxy.conversationId = conversationId;
				} else if (topicId) {
					var conversationPxy = {
						'topicId' : topicId
					};
					var topicDetail = MCK_TOPIC_DETAIL_MAP[topicId];
					if (typeof topicDetail === "object") {
						conversationPxy.topicDetail = w.JSON.stringify(topicDetail);
					}
					messagePxy.conversationPxy = conversationPxy;
				}
				if ($mck_msg_inner.data("isgroup") === true) {
					messagePxy.groupId = $mck_msg_to.val();
				} else {
					messagePxy.to = $mck_msg_to.val();
				}
				$mck_msg_sbmt.attr('disabled', true);
				$mck_msg_error.removeClass('vis').addClass('n-vis');
				$mck_msg_error.html("");
				$mck_response_text.html("");
				$mck_msg_response.removeClass('vis').addClass('n-vis');
				mckMessageService.sendMessage(messagePxy);
				$mck_loc_box.mckModal('hide');
			});
		}
		function MckFileService() {
			var _this = this;
			var ONE_KB = 1024;
			var ONE_MB = 1048576;
			var UPLOAD_VIA = [ 'CREATE', 'UPDATE' ];
			var $file_box = $applozic("#mck-file-box");
			var $mck_overlay = $applozic(".mck-overlay");
			var $mck_msg_sbmt = $applozic("#mck-msg-sbmt");
			var $mck_text_box = $applozic("#mck-text-box");
			var $mck_file_input = $applozic("#mck-file-input");
			var $mck_overlay_box = $applozic(".mck-overlay-box");
			var $mck_file_upload = $applozic(".mck-file-upload");
			var $mck_group_icon_upload = $applozic("#mck-group-icon-upload");
			var $mck_group_icon_change = $applozic("#mck-group-icon-change");
			var $mck_btn_group_icon_save = $applozic("#mck-btn-group-icon-save");
			var $mck_group_info_icon_box = $applozic("#mck-group-info-icon-box");
			var $mck_group_create_icon_box = $applozic("#mck-group-create-icon-box");
			var $mck_msg_inner = $applozic("#mck-message-cell .mck-message-inner-right");
			var $mck_group_info_icon_loading = $applozic("#mck-group-info-icon-loading");
			var $mck_group_create_icon_loading = $applozic("#mck-group-create-icon-loading");
			var $mck_group_info_icon = $applozic("#mck-group-info-icon-box .mck-group-icon");
			var $mck_group_create_icon = $applozic("#mck-group-create-icon-box .mck-group-icon");
			var $mck_group_create_overlay_label = $applozic("#mck-group-create-icon-box .mck-overlay-label");
			var FILE_PREVIEW_URL = "/rest/ws/aws/file";
			var FILE_UPLOAD_URL = "/rest/ws/aws/file/url";
			var FILE_DELETE_URL = "/rest/ws/aws/file/delete";
			var FILE_AWS_UPLOAD_URL = "/rest/ws/upload/file";
			var mck_filebox_tmpl = '<div id="mck-filebox-${fileIdExpr}" class="mck-file-box ${fileIdExpr}">' + '<div class="mck-file-expr">' + '<span class="mck-file-content blk-lg-7"><span class="mck-file-lb">{{html fileNameExpr}}</span>&nbsp;<span class="mck-file-sz">${fileSizeExpr}</span></span>' + '<span class="progress progress-striped active blk-lg-3" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="progress-bar progress-bar-success bar" stye></span></span>' + '<span class="move-right blk-lg-2">' + '<button type="button" class="mck-box-close mck-remove-file" data-dismiss="div" aria-hidden="true">&times;</button>' + '</span></div></div>';
			$applozic.template("fileboxTemplate", mck_filebox_tmpl);
			_this.init = function() {
				$mck_file_upload.on('click', function() {
					$mck_file_input.trigger('click');
				});
				$mck_group_icon_upload.on('change', function() {
					var file = $applozic(this)[0].files[0];
					_this.uplaodFileToAWS(file, UPLOAD_VIA[0]);
					return false;
				});
				$mck_group_icon_change.on('change', function() {
					var file = $applozic(this)[0].files[0];
					_this.uplaodFileToAWS(file, UPLOAD_VIA[1]);
					return false;
				});
				$mck_file_input.on('change', function() {
					$mck_msg_inner = mckMessageLayout.getMckMessageInner();
					var data = new Object();
					var file = $applozic(this)[0].files[0];
					var uploadErrors = [];
					if (typeof file === 'undefined') {
						return;
					}
					if ($applozic(".mck-file-box").length > 4) {
						uploadErrors.push("Can't upload more than 5 files at a time");
					}
					if (file['size'] > (MCK_FILEMAXSIZE * ONE_MB)) {
						uploadErrors.push("file size can not be more than " + MCK_FILEMAXSIZE + " MB");
					}
					if (uploadErrors.length > 0) {
						alert(uploadErrors.toString());
					} else {
						var randomId = mckUtils.randomId();
						var fileboxList = [ {
							fileIdExpr : randomId,
							fileName : file.name,
							fileNameExpr : '<a href="#">' + file.name + '</a>',
							fileSizeExpr : _this.getFilePreviewSize(file.size)
						} ];
						$applozic.tmpl("fileboxTemplate", fileboxList).appendTo('#mck-file-box');
						var $fileContainer = $applozic(".mck-file-box." + randomId);
						var $file_name = $applozic(".mck-file-box." + randomId + " .mck-file-lb");
						var $file_progressbar = $applozic(".mck-file-box." + randomId + " .progress .bar");
						var $file_progress = $applozic(".mck-file-box." + randomId + " .progress");
						var $file_remove = $applozic(".mck-file-box." + randomId + " .mck-remove-file");
						$file_progressbar.css('width', '0%');
						$file_progress.removeClass('n-vis').addClass('vis');
						$file_remove.attr("disabled", true);
						$mck_file_upload.attr("disabled", true);
						$file_box.removeClass('n-vis').addClass('vis');
						if (file.name === $applozic(".mck-file-box." + randomId + " .mck-file-lb a").html()) {
							var currTab = $mck_msg_inner.data('mck-id');
							var uniqueId = file.name + file.size;
							TAB_FILE_DRAFT[uniqueId] = currTab;
							$mck_msg_sbmt.attr('disabled', true);
							data.files = [];
							data.files.push(file);
							var xhr = new XMLHttpRequest();
							(xhr.upload || xhr).addEventListener('progress', function(e) {
								var progress = parseInt(e.loaded / e.total * 100, 10);
								$file_progressbar.css('width', progress + '%');
							});
							xhr.addEventListener('load', function(e) {
								var responseJson = $applozic.parseJSON(this.responseText);
								if (typeof responseJson.fileMeta === "object") {
									var file_meta = responseJson.fileMeta;
									var fileExpr = _this.getFilePreviewPath(file_meta);
									var name = file_meta.name;
									var size = file_meta.size;
									var currTabId = $mck_msg_inner.data('mck-id');
									var uniqueId = name + size;
									var fileTabId = TAB_FILE_DRAFT[uniqueId];
									if (currTab !== currTabId) {
										mckMessageLayout.updateDraftMessage(fileTabId, file_meta);
										delete TAB_FILE_DRAFT[uniqueId];
										return;
									}
									$file_remove.attr("disabled", false);
									$mck_file_upload.attr("disabled", false);
									$mck_msg_sbmt.attr('disabled', false);
									delete TAB_FILE_DRAFT[uniqueId];
									$file_name.html(fileExpr);
									$file_progress.removeClass('vis').addClass('n-vis');
									$applozic(".mck-file-box .progress").removeClass('vis').addClass('n-vis');
									$mck_text_box.removeAttr('required');
									FILE_META.push(file_meta);
									$fileContainer.data('mckfile', file_meta);
									$mck_file_upload.children('input').val("");
									return false;
								} else {
									$file_remove.attr("disabled", false);
									$mck_msg_sbmt.attr('disabled', false);
									// FILE_META
									// = "";
									$file_remove.trigger('click');
								}
							});
							$applozic.ajax({
								type : "GET",
								url : MCK_FILE_URL + FILE_UPLOAD_URL,
								global : false,
								data : "data=" + new Date().getTime(),
								crosDomain : true,
								success : function(result) {
									var fd = new FormData();
									fd.append('files[]', file);
									xhr.open("POST", result, true);
									xhr.send(fd);
								},
								error : function() {}
							});
						}
						return false;
					}
				});
				_this.uplaodFileToAWS = function(file, medium) {
					var data = new FormData();
					var uploadErrors = [];
					if (typeof file === 'undefined') {
						return;
					}
					if (file['type'].indexOf("image") === -1) {
						uploadErrors.push("Please upload image file.");
					}
					if (uploadErrors.length > 0) {
						alert(uploadErrors.toString());
					} else {
						$mck_overlay.attr('disabled', true);
						if (UPLOAD_VIA[0] === medium) {
							$mck_group_create_icon_box.find('.mck-overlay-box').removeClass('n-vis');
							$mck_group_create_icon_box.removeClass('mck-hover-on');
							$mck_group_create_icon_loading.removeClass('n-vis').addClass('vis');
						} else {
							$mck_group_info_icon_box.find('.mck-overlay-box').removeClass('n-vis');
							$mck_group_info_icon_box.removeClass('mck-hover-on');
							$mck_group_info_icon_loading.removeClass('n-vis').addClass('vis');
						}
						var xhr = new XMLHttpRequest();
						xhr.addEventListener('load', function(e) {
							var fileUrl = this.responseText;
							if (fileUrl) {
								if (UPLOAD_VIA[0] === medium) {
									$mck_group_create_icon.html('<img src="' + fileUrl + '"/>');
									$mck_group_create_icon.data('iconurl', fileUrl);
									$mck_group_create_overlay_label.html('Change Group Icon');
									$mck_group_create_icon_loading.removeClass('vis').addClass('n-vis');
									$mck_group_create_icon_box.addClass('mck-hover-on');
								} else {
									$mck_group_info_icon.html('<img src="' + fileUrl + '"/>');
									$mck_group_info_icon.data('iconurl', fileUrl);
									$mck_group_info_icon_loading.removeClass('vis').addClass('n-vis')
									$mck_group_info_icon_box.addClass('mck-hover-on');
									setTimeout(function() {
										$mck_btn_group_icon_save.removeClass('n-vis').addClass('vis');
									}, 1500);
								}
								setTimeout(function() {
									$mck_overlay_box.addClass('n-vis');
								}, 1500);
							}
							$mck_overlay.attr("disabled", false);
							(UPLOAD_VIA[0] === medium) ? $mck_group_icon_upload.val("") : $mck_group_icon_change.val("");
							return false;
						});
						data.append("file", file);
						xhr.open('post', MCK_BASE_URL + FILE_AWS_UPLOAD_URL, true);
						xhr.setRequestHeader("UserId-Enabled", true);
						xhr.setRequestHeader("Authorization", "Basic " + AUTH_CODE);
						xhr.setRequestHeader("Application-Key", MCK_APP_ID);
						xhr.setRequestHeader("Device-Key", USER_DEVICE_KEY);
						if (MCK_ACCESS_TOKEN) {
							xhr.setRequestHeader("Access-Token", MCK_ACCESS_TOKEN);
						}
						xhr.send(data);
					}
				};
				$applozic(d).on("click", '.mck-remove-file', function() {
					var $currFileBox = $applozic(this).parents('.mck-file-box');
					var currFileMeta = $currFileBox.data('mckfile');
					$currFileBox.remove();
					$mck_msg_sbmt.attr('disabled', false);
					if ($file_box.find('.mck-file-box').length === 0) {
						$file_box.removeClass('vis').addClass('n-vis');
						$mck_text_box.attr("required", "");
					}
					if (typeof currFileMeta === 'object') {
						_this.deleteFileMeta(currFileMeta.blobKey);
						$applozic.each(FILE_META, function(i, fileMeta) {
							if (typeof fileMeta !== 'undefined' && fileMeta.blobKey === currFileMeta.blobKey) {
								FILE_META.splice(i, 1);
							}
						});
					}
				});
			};
			_this.deleteFileMeta = function(blobKey) {
				$applozic.ajax({
					url : MCK_FILE_URL + FILE_DELETE_URL + '?key=' + blobKey,
					type : 'post',
					success : function() {},
					error : function() {}
				});
			};
			_this.getFilePreviewPath = function(fileMeta) {
				return (typeof fileMeta === "object") ? '<a href="' + MCK_FILE_URL + FILE_PREVIEW_URL + fileMeta.blobKey + '" target="_blank">' + fileMeta.name + '</a>' : "";
			};
			_this.getFilePreviewSize = function(fileSize) {
				if (fileSize) {
					if (fileSize > ONE_MB) {
						return "(" + parseInt(fileSize / ONE_MB) + " MB)";
					} else if (fileSize > ONE_KB) {
						return "(" + parseInt(fileSize / ONE_KB) + " KB)";
					} else {
						return "(" + parseInt(fileSize) + " B)";
					}
				}
				return "";
			};
			_this.addFileBox = function(file) {
				var fileboxId = mckUtils.randomId();
				var fileName = "";
				if (typeof file.fileMeta === 'object') {
					fileboxId = file.fileMeta.createdAtTime;
					fileName = file.fileMeta.name;
				}
				var fileboxList = [ {
					fileNameExpr : file.filelb,
					fileSizeExpr : file.filesize,
					fileIdExpr : fileboxId,
					fileName : fileName
				} ];
				$applozic.tmpl("fileboxTemplate", fileboxList).appendTo('#mck-file-box');
				var $fileContainer = $applozic(".mck-file-box." + fileboxId);
				var $file_remove = $fileContainer.find(".mck-remove-file");
				var $file_progress = $fileContainer.find(".progress");
				if (typeof file.fileMeta === 'object') {
					$fileContainer.data('mckblob', file.fileMeta.blobKey);
					$mck_text_box.removeAttr('required');
					$mck_msg_sbmt.attr('disabled', false);
					$file_remove.attr('disabled', false);
					$file_progress.removeClass('vis').addClass('n-vis');
					FILE_META.push(file.fileMeta);
				} else {
					$mck_msg_sbmt.attr('disabled', true);
					$file_remove.attr('disabled', true);
					$file_progress.removeClass('n-vis').addClass('vis');
				}
			};
		}
		function MckNotificationService() {
			var _this = this;
			var $mck_sidebox;
			var $mck_msg_inner;
			var $mck_msg_preview;
			var $mck_preview_icon;
			var $mck_preview_name;
			var $mck_sidebox_launcher;
			var $mck_preview_msg_content;
			var $mck_preview_file_content;
			var MCK_SW_SUBSCRIPTION;
			var MCK_SW_REGISTER_URL = "/rest/ws/plugin/update/sw/id";
			_this.init = function() {
				$mck_sidebox = $applozic("#mck-sidebox");
				$mck_msg_preview = $applozic("#mck-msg-preview");
				$mck_sidebox_launcher = $applozic("#mck-sidebox-launcher");
				$mck_msg_inner = $applozic("#mck-message-cell .mck-message-inner-left");
				$mck_preview_icon = $applozic("#mck-msg-preview .mck-preview-icon");
				$mck_preview_name = $applozic("#mck-msg-preview .mck-preview-cont-name");
				$mck_preview_msg_content = $applozic("#mck-msg-preview .mck-preview-msg-content");
				$mck_preview_file_content = $applozic("#mck-msg-preview .mck-preview-file-content");
			};
			_this.notifyUser = function(message) {
				if (message.type === 7) {
					return;
				}
				var contact = (message.groupId) ? mckGroupUtils.getGroup('' + message.groupId) : mckMessageLayout.fetchContact('' + message.to.split(",")[0]);
				var isGroup = false;
				if (message.groupId) {
					isGroup = true;
				}
				var displayName = mckMessageLayout.getTabDisplayName(contact.contactId, isGroup);
				_this.showNewMessageNotification(message, contact, displayName);
				if (IS_MCK_NOTIFICATION && !IS_MCK_TAB_FOCUSED) {
					var iconLink = MCK_NOTIFICATION_ICON_LINK;
					var msg = mckMessageLayout.getTextForMessagePreview(message, contact);
					if (typeof (MCK_GETUSERIMAGE) === "function" && !contact.isGroup) {
						var imgsrc = MCK_GETUSERIMAGE(contact.contactId);
						if (imgsrc && typeof imgsrc !== 'undefined') {
							iconLink = imgsrc;
						}
					}
					mckNotificationUtils.sendDesktopNotification(displayName, iconLink, msg);
				}
			};
			_this.showNewMessageNotification = function(message, contact, displayName) {
				$mck_msg_inner = mckMessageLayout.getMckMessageInner();
				if (!IS_NOTIFICATION_ENABLED) {
					return;
				}
				var currTabId = $mck_msg_inner.data('mck-id');
				var isGroupTab = $mck_msg_inner.data('isgroup');
				if (currTabId === contact.contactId && isGroupTab === contact.isGroup) {
					if (message.conversationId && (IS_MCK_TOPIC_HEADER || IS_MCK_TOPIC_BOX)) {
						var currConvId = $mck_msg_inner.data('mck-conversationid');
						currConvId = (typeof currConvId !== "undefined" && currConvId !== "") ? currConvId.toString() : "";
						if (currConvId === message.conversationId.toString()) {
							return;
						}
					} else {
						return;
					}
				}
				$mck_msg_preview.data('isgroup', contact.isGroup);
				var conversationId = (message.conversationId) ? message.conversationId : "";
				$mck_msg_preview.data('mck-conversationid', conversationId);
				var imgsrctag = mckMessageLayout.getContactImageLink(contact, displayName);
				if (message.message) {
					var msg = mckMessageLayout.getMessageTextForContactPreview(message, contact, 50);
					$mck_preview_msg_content.html("");
					(typeof msg === 'object') ? $mck_preview_msg_content.append(msg) : $mck_preview_msg_content.html(msg);
					$mck_preview_msg_content.removeClass('n-vis').addClass('vis');
				} else {
					$mck_preview_msg_content.html("");
				}
				if (message.fileMetaKey) {
					$mck_preview_file_content.html(mckMessageLayout.getFileIcon(message));
					$mck_preview_file_content.removeClass('n-vis').addClass('vis');
					if ($mck_preview_msg_content.html() === "") {
						$mck_preview_msg_content.removeClass('vis').addClass('n-vis');
					}
				} else {
					$mck_preview_file_content.html("");
					$mck_preview_file_content.removeClass('vis').addClass('n-vis');
				}
				$mck_preview_name.html(displayName);
				$mck_preview_icon.html(imgsrctag);
				$mck_msg_preview.data('mck-id', contact.contactId);
				$mck_msg_preview.show();
				setTimeout(function() {
					$mck_msg_preview.fadeOut(3000);
				}, 10000);
			};
			_this.sendSubscriptionIdToServer = function() {
				if (MCK_SW_SUBSCRIPTION) {
					var subscriptionId = MCK_SW_SUBSCRIPTION.endpoint.split("/").slice(-1)[0];
					if (subscriptionId) {
						$applozic.ajax({
							url : MCK_BASE_URL + MCK_SW_REGISTER_URL,
							type : 'post',
							data : 'registrationId=' + subscriptionId,
							success : function(data) {},
							error : function() {}
						});
					}
				}
			};
			_this.subscribeToServiceWorker = function() {
				if (IS_SW_NOTIFICATION_ENABLED) {
					if ('serviceWorker' in navigator) {
						navigator.serviceWorker.register('./service-worker.js', {
							scope : './'
						});
						navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
							serviceWorkerRegistration.pushManager.subscribe({
								userVisibleOnly : true
							}).then(function(pushSubscription) {
								console.log('The reg ID is :: ', pushSubscription.endpoint.split("/").slice(-1));
								MCK_SW_SUBSCRIPTION = pushSubscription;
								_this.sendSubscriptionIdToServer();
							})
						});
					}
				}
			};
			_this.unsubscribeToServiceWorker = function() {
				if (MCK_SW_SUBSCRIPTION) {
					navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
						MCK_SW_SUBSCRIPTION.unsubscribe().then(function(successful) {
							MCK_SW_SUBSCRIPTION = null;
							console.log('Unsubscribed to notification successfully');
						})
					});
				}
			};
		}
		function MckInitializeChannel($this) {
			var _this = this;
			var SOCKET = "";
			var subscriber = null;
			var stompClient = null;
			var TYPING_TAB_ID = "";
			var events = $this.events;
			var typingSubscriber = null;
			var checkConnectedIntervalId;
			var sendConnectedStatusIntervalId;
			var $mck_sidebox = $applozic("#mck-sidebox");
			var $mck_tab_title = $applozic("#mck-tab-individual .mck-tab-title");
			var $mck_typing_box = $applozic(".mck-typing-box");
			var $mck_tab_status = $applozic("#mck-tab-individual .mck-tab-status");
			var $mck_typing_box_text = $applozic(".mck-typing-box .name-text");
			var $mck_message_inner = $applozic("#mck-message-cell .mck-message-inner-right");
			_this.init = function() {
				if (typeof MCK_WEBSOCKET_URL !== 'undefined') {
					var port = (!mckUtils.startsWith(MCK_WEBSOCKET_URL, "https")) ? "15674" : "15675";
					if (typeof w.SockJS === 'function') {
						if (!SOCKET) {
							SOCKET = new SockJS(MCK_WEBSOCKET_URL + ":" + port + "/stomp");
						}
						stompClient = w.Stomp.over(SOCKET);
						stompClient.heartbeat.outgoing = 0;
						stompClient.heartbeat.incoming = 0;
						stompClient.onclose = function() {
							_this.disconnect();
						};
						stompClient.connect("guest", "guest", _this.onConnect, _this.onError, '/');
						w.addEventListener("beforeunload", function(e) {
							_this.disconnect();
						});
					}
				}
			};
			_this.checkConnected = function(isFetchMessages) {
				if (stompClient.connected) {
					if (checkConnectedIntervalId) {
						clearInterval(checkConnectedIntervalId);
					}
					if (sendConnectedStatusIntervalId) {
						clearInterval(sendConnectedStatusIntervalId);
					}
					checkConnectedIntervalId = setInterval(function() {
						_this.connectToSocket(isFetchMessages);
					}, 600000);
					sendConnectedStatusIntervalId = setInterval(function() {
						_this.sendStatus(1);
					}, 1200000);
				} else {
					_this.connectToSocket(isFetchMessages);
				}
			};
			_this.connectToSocket = function(isFetchMessages) {
				$mck_message_inner = mckMessageLayout.getMckMessageInner();
				if (!stompClient.connected) {
					if (isFetchMessages) {
						var currTabId = $mck_message_inner.data('mck-id');
						if (currTabId) {
							var isGroup = $mck_message_inner.data('isgroup');
							var conversationId = $mck_message_inner.data('mck-conversationid');
							var topicId = $mck_message_inner.data('mck-topicid');
							mckStorage.clearMckMessageArray();
							mckMessageLayout.loadTab({
								'tabId' : currTabId,
								'isGroup' : isGroup,
								'conversationId' : conversationId,
								'topicId' : topicId
							});
						}
					}
					_this.init();
				}
			};
			_this.stopConnectedCheck = function() {
				if (checkConnectedIntervalId) {
					clearInterval(checkConnectedIntervalId);
				}
				if (sendConnectedStatusIntervalId) {
					clearInterval(sendConnectedStatusIntervalId);
				}
				checkConnectedIntervalId = '';
				sendConnectedStatusIntervalId = '';
				_this.disconnect();
			};
			_this.disconnect = function() {
				if (stompClient && stompClient.connected) {
					_this.sendStatus(0);
					stompClient.disconnect();
					SOCKET.close();
          SOCKET = '';
				}
			};
			_this.unsubscibeToTypingChannel = function() {
				if (stompClient && stompClient.connected) {
					if (typingSubscriber) {
						if (MCK_TYPING_STATUS === 1) {
							_this.sendTypingStatus(0, TYPING_TAB_ID);
						}
						typingSubscriber.unsubscribe();
					}
				}
				typingSubscriber = null;
			};
			_this.unsubscibeToNotification = function() {
				if (stompClient && stompClient.connected) {
					if (subscriber) {
						subscriber.unsubscribe();
					}
				}
				subscriber = null;
			};
			_this.subscibeToTypingChannel = function(tabId, isGroup) {
				var subscribeId = (isGroup) ? tabId : MCK_USER_ID;
				if (stompClient && stompClient.connected) {
					typingSubscriber = stompClient.subscribe("/topic/typing-" + MCK_APP_ID + "-" + subscribeId, _this.onTypingStatus);
				} else {
					_this.reconnect();
				}
			};
			_this.sendTypingStatus = function(status, tabId) {
				if (stompClient && stompClient.connected) {
					if (status === 1 && MCK_TYPING_STATUS === 1) {
						stompClient.send('/topic/typing-' + MCK_APP_ID + "-" + TYPING_TAB_ID, {
							"content-type" : "text/plain"
						}, MCK_APP_ID + "," + MCK_USER_ID + "," + status);
					}
					if (tabId) {
						if (tabId === TYPING_TAB_ID && status === MCK_TYPING_STATUS && status === 1) {
							return;
						}
						TYPING_TAB_ID = tabId;
						stompClient.send('/topic/typing-' + MCK_APP_ID + "-" + tabId, {
							"content-type" : "text/plain"
						}, MCK_APP_ID + "," + MCK_USER_ID + "," + status);
						setTimeout(function() {
							MCK_TYPING_STATUS = 0;
						}, 60000);
					} else if (status === 0) {
						stompClient.send('/topic/typing-' + MCK_APP_ID + "-" + TYPING_TAB_ID, {
							"content-type" : "text/plain"
						}, MCK_APP_ID + "," + MCK_USER_ID + "," + status);
					}
					MCK_TYPING_STATUS = status;
				}
			};
			_this.onTypingStatus = function(resp) {
				$mck_message_inner = mckMessageLayout.getMckMessageInner();
				var message = resp.body;
				var publisher = message.split(",")[1];
				var status = Number(message.split(",")[2]);
				var tabId = resp.headers.destination.substring(resp.headers.destination.lastIndexOf("-") + 1, resp.headers.destination.length);
				var currTabId = $mck_message_inner.data('mck-id');
				var isGroup = $mck_message_inner.data('isgroup');
				if (!MCK_BLOCKED_TO_MAP[publisher] && !MCK_BLOCKED_BY_MAP[publisher]) {
					if (status === 1) {
						if ((MCK_USER_ID !== publisher || !isGroup) && (currTabId === publisher || currTabId === tabId)) {
							var isGroup = $mck_message_inner.data('isgroup');
							$mck_tab_title.addClass("mck-tab-title-w-typing");
							$mck_tab_status.removeClass('vis').addClass('n-vis');
							if (isGroup) {
								if (publisher !== MCK_USER_ID) {
									var displayName = mckMessageLayout.getTabDisplayName(publisher, false);
									displayName = displayName.split(" ")[0];
									$mck_typing_box_text.html(displayName + " is ");
								}
							} else {
								$mck_typing_box_text.html("");
							}
							$mck_typing_box.removeClass('n-vis').addClass('vis');
							setTimeout(function() {
								$mck_tab_title.removeClass("mck-tab-title-w-typing");
								$mck_typing_box.removeClass('vis').addClass('n-vis');
								if ($mck_tab_title.hasClass("mck-tab-title-w-status")) {
									$mck_tab_status.removeClass('n-vis').addClass('vis');
								}
								$mck_typing_box_text.html("");
							}, 60000);
						}
					} else {
						$mck_tab_title.removeClass("mck-tab-title-w-typing");
						$mck_typing_box.removeClass('vis').addClass('n-vis');
						if ($mck_tab_title.hasClass("mck-tab-title-w-status")) {
							$mck_tab_status.removeClass('n-vis').addClass('vis');
						}
						$mck_typing_box_text.html("");
					}
				}
			};
			_this.reconnect = function() {
				_this.unsubscibeToTypingChannel();
				_this.unsubscibeToNotification();
				_this.disconnect();
				_this.init();
			};
			_this.onError = function(err) {
				w.console.log("Error in channel notification. " + err);
				events.onConnectFailed();
			};
			_this.sendStatus = function(status) {
				if (stompClient && stompClient.connected) {
					stompClient.send('/topic/status', {
						"content-type" : "text/plain"
					}, MCK_TOKEN + "," + status);
				}
			};
			_this.onConnect = function() {
				if (stompClient.connected) {
					if (subscriber) {
						_this.unsubscibeToNotification();
					}
					subscriber = stompClient.subscribe("/topic/" + MCK_TOKEN, _this.onMessage);
					_this.sendStatus(1);
					_this.checkConnected(true);
				} else {
					setTimeout(function() {
						subscriber = stompClient.subscribe("/topic/" + MCK_TOKEN, _this.onMessage);
						_this.sendStatus(1);
						_this.checkConnected(true);
					}, 5000);
				}
				events.onConnect();
			};
			_this.onMessage = function(obj) {
				$mck_message_inner = mckMessageLayout.getMckMessageInner();
				var resp = $applozic.parseJSON(obj.body);
				var messageType = resp.type;
				if (messageType === "APPLOZIC_04" || messageType === "MESSAGE_DELIVERED") {
					$applozic("." + resp.message.split(",")[0] + " .mck-message-status").removeClass('mck-icon-time').removeClass('mck-icon-sent').addClass('mck-icon-delivered');
					mckMessageLayout.addTooltip(resp.message.split(",")[0]);
					events.onMessageDelivered({
						'messageKey' : resp.message.split(",")[0]
					});
				} else if (messageType === "APPLOZIC_08" || messageType === "MT_MESSAGE_DELIVERED_READ") {
					$applozic("." + resp.message.split(",")[0] + " .mck-message-status").removeClass('mck-icon-time').removeClass('mck-icon-sent').removeClass('mck-icon-delivered').addClass('mck-icon-read');
					mckMessageLayout.addTooltip(resp.message.split(",")[0]);
					events.onMessageRead({
						'messageKey' : resp.message.split(",")[0]
					});
				} else if (messageType === "APPLOZIC_05") {
					var key = resp.message.split(",")[0];
					var userId = resp.message.split(",")[1];
					mckMessageLayout.removedDeletedMessage(key, userId, false);
					events.onMessageDeleted({
						'messageKey' : resp.message.split(",")[0],
						'userKey' : resp.message.split(",")[1]
					});
				} else if (messageType === "APPLOZIC_06") {
					var userId = resp.message;
					if (typeof userId !== 'undefined') {
						mckMessageLayout.removeConversationThread(userId, false);
						events.onConversationDeleted({
							'userKey' : userId
						});
					}
				} else if (messageType === "APPLOZIC_11") {
					var userId = resp.message;
					var contact = mckMessageLayout.fetchContact(userId);
					var tabId = $mck_message_inner.data('mck-id');
					if (!MCK_BLOCKED_TO_MAP[userId] && !MCK_BLOCKED_BY_MAP[userId]) {
						if (tabId === contact.contactId && !$mck_message_inner.data('isgroup')) {
							$applozic("#mck-tab-individual .mck-tab-status").html("Online");
						}
						var htmlId = mckContactUtils.formatContactId(userId);
						$applozic("#li-user-" + htmlId + " .mck-ol-status").removeClass('n-vis').addClass('vis');
						$applozic(".mck-user-ol-status." + htmlId).removeClass('n-vis').addClass('vis');
						$applozic(".mck-user-ol-status." + htmlId).next().html('(Online)');
						w.MCK_OL_MAP[userId] = true;
						mckUserUtils.updateUserStatus({
							'userId' : resp.message,
							'status' : 1
						});
					}
					events.onUserConnect({
						'userId' : resp.message
					});
				} else if (messageType === "APPLOZIC_12") {
					var userId = resp.message.split(",")[0];
					var lastSeenAtTime = resp.message.split(",")[1];
					w.MCK_OL_MAP[userId] = false;
					if (lastSeenAtTime) {
						MCK_LAST_SEEN_AT_MAP[userId] = lastSeenAtTime;
					}
					var contact = mckMessageLayout.fetchContact(userId);
					if (!MCK_BLOCKED_TO_MAP[userId] && !MCK_BLOCKED_BY_MAP[userId]) {
						var tabId = $mck_message_inner.data('mck-id');
						$applozic(".mck-user-ol-status." + contact.htmlId).removeClass('vis').addClass('n-vis');
						$applozic(".mck-user-ol-status." + contact.htmlId).next().html('(Offline)');
						$applozic("#li-user-" + contact.htmlId + " .mck-ol-status").removeClass('vis').addClass('n-vis');
						if (tabId === contact.contactId && !$mck_message_inner.data('isgroup')) {
							$applozic("#mck-tab-individual .mck-tab-status").html(mckDateUtils.getLastSeenAtStatus(lastSeenAtTime));
						}
						mckUserUtils.updateUserStatus({
							'userId' : userId,
							'status' : 0,
							'lastSeenAtTime' : lastSeenAtTime
						});
					}
					events.onUserDisconnect({
						'userId' : userId,
						'lastSeenAtTime' : lastSeenAtTime
					});
				} else if (messageType === "APPLOZIC_09") {
					var userId = resp.message;
					var contact = mckMessageLayout.fetchContact(userId);
					mckMessageLayout.updateUnreadCount('user_' + contact.contactId, 0, true);
					$applozic("#li-user-" + contact.htmlId + " .mck-unread-count-text").html(mckMessageLayout.getUnreadCount('user_' + contact.contactId));
					$applozic("#li-user-" + contact.htmlId + " .mck-unread-count-box").removeClass("vis").addClass("n-vis");
					events.onConversationReadFromOtherSource({
						'userId' : userId
					});
				} else if (messageType === "APPLOZIC_10") {
					var userId = resp.message;
					var tabId = $mck_message_inner.data('mck-id');
					if (tabId === userId) {
						$applozic(".mck-msg-right .mck-message-status").removeClass('mck-icon-time').removeClass('mck-icon-sent').removeClass('mck-icon-delivered').addClass('mck-icon-read');
						$applozic(".mck-msg-right .mck-icon-delivered").attr('title', 'delivered and read');
						var contact = mckMessageLayout.getContact(userId);
						if (typeof contact === 'undefined') {
							var userIdArray = [];
							userIdArray.push(userId);
							mckContactService.getUsersDetail(userIdArray);
						}
					}
					events.onConversationRead({
						'userId' : userId
					});
				} else if (messageType === "APPLOZIC_16") {
					var status = resp.message.split(":")[0];
					var userId = resp.message.split(":")[1];
					var contact = mckMessageLayout.fetchContact(userId);
					var tabId = $mck_message_inner.data('mck-id');
					if (tabId === contact.contactId) {
						if (status === BLOCK_STATUS_MAP[0]) {
							MCK_BLOCKED_TO_MAP[contact.contactId] = true;
							mckUserUtils.toggleBlockUser(tabId, true);
						} else {
							MCK_BLOCKED_BY_MAP[contact.contactId] = true;
							$mck_tab_title.removeClass('mck-tab-title-w-status');
							$mck_tab_status.removeClass('vis').addClass('n-vis');
							$mck_typing_box.removeClass('vis').addClass('n-vis');
						}
					}
					$applozic("#li-user-" + contact.htmlId + " .mck-ol-status").removeClass('vis').addClass('n-vis');
					events.onUserBlocked({
						'status' : status,
						'userId' : userId
					});
				} else if (messageType === 'APPLOZIC_17') {
					var status = resp.message.split(":")[0];
					var userId = resp.message.split(":")[1];
					var contact = mckMessageLayout.fetchContact(userId);
					var tabId = $mck_message_inner.data('mck-id');
					if (tabId === contact.contactId) {
						if (status === BLOCK_STATUS_MAP[2]) {
							MCK_BLOCKED_TO_MAP[contact.contactId] = false;
							mckUserUtils.toggleBlockUser(tabId, false);
						} else if (w.MCK_OL_MAP[tabId] || MCK_LAST_SEEN_AT_MAP[tabId]) {
							MCK_BLOCKED_BY_MAP[contact.contactId] = false;
							if (!MCK_BLOCKED_TO_MAP[tabId]) {
								if (w.MCK_OL_MAP[tabId]) {
									$mck_tab_status.html('Online');
								} else if (MCK_LAST_SEEN_AT_MAP[tabId]) {
									$mck_tab_status.html(mckDateUtils.getLastSeenAtStatus(MCK_LAST_SEEN_AT_MAP[tabId]));
								}
								$mck_tab_title.addClass('mck-tab-title-w-status');
								$mck_tab_status.removeClass('n-vis').addClass('vis');
							}
						}
					}
					if (w.MCK_OL_MAP[tabId]) {
						$applozic("#li-user-" + contact.htmlId + " .mck-ol-status").removeClass('n-vis').addClass('vis');
					}
					events.onUserUnblocked({
						'status' : status,
						'userId' : userId
					});
				} else if (messageType === "APPLOZIC_18") {
					IS_MCK_USER_DEACTIVATED = false;
					events.onUserActivated();
				} else if (messageType === "APPLOZIC_19") {
					IS_MCK_USER_DEACTIVATED = true;
					events.onUserDeactivated();
				} else {
					var message = resp.message;
					// var userIdArray =
					// mckMessageLayout.getUserIdFromMessage(message);
					// mckContactService.getContactDisplayName(userIdArray);
					// mckMessageLayout.openConversation();
					if (messageType === "APPLOZIC_03") {
						if (message.type !== 0 && message.type !== 4) {
							$applozic("." + message.key + " .mck-message-status").removeClass('mck-icon-time').addClass('mck-icon-sent');
							mckMessageLayout.addTooltip(message.key);
						}
						events.onMessageSentUpdate({
							'messageKey' : message.key
						});
					} else if (messageType === "APPLOZIC_01" || messageType === "APPLOZIC_02" || messageType === "MESSAGE_RECEIVED") {
						var messageArray = [];
						messageArray.push(message);
						if (mckStorage.getMckMessageArray() !== null && mckStorage.getMckMessageArray().length > 0) {
							mckStorage.updateMckMessageArray(messageArray);
						}
						var contact = (message.groupId) ? mckGroupUtils.getGroup(message.groupId) : mckMessageLayout.getContact(message.to);
						var $mck_sidebox_content = $applozic("#mck-sidebox-content");
						var tabId = $mck_message_inner.data('mck-id');
						if (messageType === "APPLOZIC_01" || messageType === "MESSAGE_RECEIVED") {
							var messageFeed = mckMessageLayout.getMessageFeed(message);
							events.onMessageReceived({
								'message' : messageFeed
							});
						} else if (messageType === "APPLOZIC_02") {
							var messageFeed = mckMessageLayout.getMessageFeed(message);
							events.onMessageSent({
								'message' : messageFeed
							});
						}
						if (!$mck_sidebox_content.hasClass('n-vis')) {
				            if (message.conversationId) {
                                var conversationPxy = MCK_CONVERSATION_MAP[message.conversationId];
                                if ((IS_MCK_TOPIC_HEADER || IS_MCK_TOPIC_BOX) && ((typeof conversationPxy !== 'object') || (typeof (MCK_TOPIC_DETAIL_MAP[conversationPxy.topicId]) !== 'object'))) {
                                    mckMessageService.getTopicId({
                                        'conversationId': message.conversationId,
                                        'messageType': messageType,
                                        'message': message,
                                        'notifyUser': resp.notifyUser,
                                        'async' : false,
                                        'populate' : false
                                    });
                                }
                            }
							if (typeof contact === 'undefined') {
								var params = {
									'message' : message,
									'messageType' : messageType,
									'notifyUser' : resp.notifyUser
								};
								if (message.groupId) {
									mckGroupLayout.getGroupFeedFromMessage(params);
								} else {
									var userIdArray = [];
									userIdArray.push(message.to);
									mckContactService.getUsersDetail(userIdArray, params);
								}
								return;
							} else {
								mckMessageLayout.populateMessage(messageType, message, resp.notifyUser);
							}
						}
					}
				}
			};
		}
	}
}($applozic, window, document));
