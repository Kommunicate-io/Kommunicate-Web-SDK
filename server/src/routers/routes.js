/*eslint-disable */
const app = require("../../app.js");
const express = require("express");
const userController = require("../users/userController.js");
const loginController= require("../login/loginController");
const registerController=require("../register/registerController");
const validate = require('express-validation');
const userValidation = require("../users/validation");
const loginValidation = require("../login/validation");
const webpluginController= require("../webplugin/controller");
const passwordResetController = require("../passwordreset/passwordResetController");
const customerValidation = require("../register/validation");
const mailValidation = require("../mail/validation.js");
const mailController = require ("../mail/mailController");
const chatController =require('../chat-demo/chatController');
const conversationController = require('../conversation/conversationController');
const conversationValidation =require ('../conversation/validation');
const autoSuggestController = require('../autosuggest/autosuggestController');
const autoSuggestValidation = require('../autosuggest/validation');
const profileImageController = require('../profileImage/profileImageController');
const applicationValidation = require('../application/validation');
const inAppMsgController  = require('../application/inAppMsgController');
const issueTypeController = require('../issuetype/issueTypeController');
const issueTypeValidation = require('../issuetype/validation');
const issueTypeAutoReplyController = require('../issueTypeAutoReply/issueTypeAutoReplyController');
const issueTypeAutoReplyValidation = require('../issueTypeAutoReply/validation');
const inAppEventController = require('../appevent/InAppEventController');
const zendeskController = require('../zendesk/zendeskController');
const zendeskValidation = require('../zendesk/validation');
const agileController = require('../agileCrm/agileController');
const agileValidation = require('../agileCrm/validation');
const integrationSettingController = require('../setting/thirdPartyIntegration/integrationSettingController');
const thirdPartySettingValidation = require('../setting/thirdPartyIntegration/validation')
const googleAuthController = require('../googleAuth/googleAuthController');
const chargebeeController= require("../chargebee/chargebeeController");
const appSettingController = require("../setting/application/appSettingController");
const applicationSettingValidation = require("../setting/application/validation");
const seedLiz = require('../users/seed')
const subscriptionValidation = require("../subscription/subscriptionValidation");
const subscriptionController = require("../subscription/subscriptionController");
const metabaseController = require('../metabase/metabaseController');
const metabaseValidator = require('../metabase/validation');



//For Cron Time Features
const cronService = require("../cron/cronService.js")

// For user preference
const userPreferenceController = require("../users/userPreferenceController.js")

// For Chat Popup Messages
const chatPopupMessageController = require("../setting/application/chatPopupMessageController.js")

//router declaration
const userRouter = express.Router();
const applicationRouter = express.Router();
const loginRouter = express.Router();
const customerRouter = express.Router();
const home = express.Router();
const miscRouters = express.Router();
const chatRouter = express.Router();
const settingRouter = express.Router();
//const signUpWithApplozicRouter = express.Router();
const conversationRouter =express.Router();
const autoSuggestRouter = express.Router();
const profileImageRouter = express.Router();
const groupRouter = express.Router();
const issueTypeRouter = express.Router();
const issueTypeReplyRouter = express.Router();
const zendeskRouter = express.Router();
const agileRouter = express.Router();
const thirdPartySettingRouter = express.Router();
const faqRouter = express.Router();
const googleAuthRouter = express.Router();
const subscriptionRouter = express.Router();
const metabaseRouter = express.Router();


//export routers
exports.home = home;
exports.users=userRouter;
exports.applications = applicationRouter;
exports.login= loginRouter;
exports.customers =customerRouter;
exports.misc = miscRouters;
exports.setting = settingRouter;
//exports.signUpWithApplozic = signUpWithApplozicRouter;
exports.chat = chatRouter;
exports.conversation=conversationRouter;
exports.autoSuggest = autoSuggestRouter;
exports.profileImage = profileImageRouter;
exports.group = groupRouter;
exports.issueType = issueTypeRouter;
exports.issueTypeAutoReply = issueTypeReplyRouter;
exports.zendesk = zendeskRouter;
exports.thirdPartySetting = thirdPartySettingRouter;
exports.faq=faqRouter;
exports.googleAuth = googleAuthRouter;
//exports.chargebee = chargebeeRouter;
exports.subscription = subscriptionRouter;
exports.agile = agileRouter;
exports.v2UserRouter = express.Router();
exports.metabaseRouter = metabaseRouter;

//Cron Time Stamp Route
exports.cronServiceRouter = express.Router();


//Chat Popup Route
exports.chatPopupRouter = express.Router();

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

home.get('/',function(req,res){
  console.log("req received at home routes");
  res.status(200).json({"message":"Welcome to kommunicate"});
});
home.get('/kommunicate.app',webpluginController.getPlugin);
home.get('/v2/kommunicate.app',webpluginController.iframePlugin);
home.get('/seed/liz', seedLiz.seedLiz)

// requests for user preference service
userRouter.post("/preference/add", validate(userValidation.createUserPreference), userPreferenceController.createUserPreference);
userRouter.post("/preference/delete", validate(userValidation.deleteUserPreference), userPreferenceController.deleteUserPreference);
userRouter.post("/preference/update", validate(userValidation.updateUserPreference), userPreferenceController.updateUserPreference);
userRouter.get("/preference/get",  validate(userValidation.getUserPreference), userPreferenceController.getUserPreference);

// requests to user router
userRouter.get('/invite/detail',validate(userValidation.getInvitedAgentDetail),userController.getInvitedAgentDetail);
userRouter.get('/invite/list',validate(userValidation.getInvitedUser),userController.getInvitedUser);
userRouter.get('/',validate(userValidation.getAllUser),userController.getAllUsers);
userRouter.get('/availability/status', userController.getAgentIdsStatusWise);
userRouter.get('/:userName',userController.getUserByName);
userRouter.get('/:userName/:appId',userController.getByUserNameAndAppId);
userRouter.get('/password/reset-form',passwordResetController.processUpdatePasswordRequest);
userRouter.get('/chat/plugin/settings', userController.defaultPluginSettings);
userRouter.get('/v2/chat/plugin/settings', userController.defaultPluginSettingsV2);
//userRouter.patch('/:userName/:appId',userController.patchUser);
userRouter.post('/:userName/business-hours',validate(userValidation.updateBusinessHours),userController.updateBusinessHours);
userRouter.post('/',validate(userValidation.createUser),userController.createUser);
userRouter.post('/:userName/subscribe/off-hours-message-notification',userController.subscribeOffHoursNotification);
userRouter.post('/password-reset', passwordResetController.processPasswordResetRequest);
userRouter.post('/password-update',passwordResetController.updatePassword);
userRouter.post('/:userName/password-reset', passwordResetController.processPasswordResetRequest);
userRouter.post('/password/update',validate(userValidation.updatePassword),userController.updatePassword);
userRouter.patch('/invite/status',validate(userValidation.inviteStatusUpdate),userController.inviteStatusUpdate);
userRouter.patch('/:userName/:appId',userController.patchUser);
userRouter.patch('/goAway/:userName/:appId',userController.goAway);
userRouter.patch('/status',userController.updateUserStatus);
userRouter.patch('/goOnline/:userName/:appId',userController.goOnline);
userRouter.patch('/:botId/:appId/:status',validate(userValidation.botStatus), userController.changeBotStatus);
userRouter.patch("/", validate(userValidation.userActivation), userController.activateOrDeactivateUser);
userRouter.delete("/invitation",validate(userValidation.deleteInvitation), userController.deleteInvitation);
// userRouter.patch('/:userName/working-hour',validate(userValidation.businessHours),userController.updateBusinessHours);


loginRouter.post('/',validate(loginValidation.login),loginController.login);
//signUpWithApplozicRouter.post('/', validate(loginValidation.login), loginController.signUpWithApplozic);
customerRouter.post('/',validate(customerValidation.createCustomer),registerController.createCustomer);
customerRouter.patch('/:userId',validate(customerValidation.patchCustomer),registerController.patchCustomer);
customerRouter.get('/:userName',registerController.getCustomerInformation);
customerRouter.post('/applozic',function(req,res){
                          console.log("called sign up with Applozic");
                          registerController.signUpWithAplozic(req,res);});
customerRouter.patch('/:appId/:user/routing/:routingState', validate(customerValidation.updateRoutingState), registerController.updateRoutingState);
customerRouter.get('/',validate(customerValidation.searchCustomer), registerController.getCustomerByApplicationId)
miscRouters.get('/tz',userController.getTimezone);
miscRouters.post('/process-off-business-hours',userController.processOffBusinessHours);
miscRouters.post('/mail', validate(mailValidation.sendMail),mailController.sendMail);
miscRouters.post("/invite/mail", validate(mailValidation.sendMail), mailController.sendInvitationMail)
autoSuggestRouter.get('/', autoSuggestController.getAllSuggestions);
autoSuggestRouter.get('/:applicationId', autoSuggestController.getSuggestionsByAppId);
autoSuggestRouter.post('/', validate(autoSuggestValidation.createSuggestion), autoSuggestController.createSuggestion);
autoSuggestRouter.patch('/',validate(autoSuggestValidation.updateSuggestion), autoSuggestController.updateSuggestion)
autoSuggestRouter.delete('/',validate(autoSuggestValidation.deleteSuggetion), autoSuggestController.deleteSuggetion)
chatRouter.get('/visitor',chatController.visitorChat);
profileImageRouter.post('/', upload.single('file'), profileImageController.uploadImageToS3);

//conversation router
conversationRouter.post('/member/add',validate(conversationValidation.addMemberIntoConversation),conversationController.addMemberIntoConversation);
conversationRouter.post('/v2/create', conversationController.createConversationFromMail);
conversationRouter.post('/assignee/switch', conversationController.switchConversationAssignee);

//application router
applicationRouter.post('/:appId/welcomemessage',validate(applicationValidation.postWelcomeMessage),inAppMsgController.saveWelcomeMessage);
applicationRouter.get('/:appId/welcomemessage',validate(applicationValidation.getWelcomeMessage),inAppMsgController.getInAppMessages);
applicationRouter.post('/events',inAppMsgController.processEvents);
applicationRouter.get('/all/events',inAppEventController.getAllInAppEvents)
applicationRouter.post('/:userName/:appId/createinappmsg',validate(applicationValidation.createInAppMsg),inAppMsgController.createInAppMsg);
applicationRouter.patch('/disableInAppMsgs/:userName/:appId',inAppMsgController.disableInAppMessages);
applicationRouter.patch('/enableInAppMsgs/:userName/:appId',inAppMsgController.enableInAppMessages);
applicationRouter.get('/:userName/:appId/getInAppMessages',validate(applicationValidation.getInAppMessages),inAppMsgController.getInAppMessages2);
applicationRouter.get('/events',validate(applicationValidation.getInAppMessagesByEventId),inAppMsgController.getInAppMessagesByEventIds);
applicationRouter.patch('/:id/deleteInAppMsg',inAppMsgController.softDeleteInAppMsg);
applicationRouter.patch('/editInAppMsg', validate(applicationValidation.editInAppMessages),inAppMsgController.editInAppMsg);
applicationRouter.get('/:appId/awaymessage',validate(applicationValidation.processAwayMessage), inAppMsgController.processAwayMessage);
//group router
groupRouter.post('/create',userController.createGroupOfAllAgents)
/**
 * CRUD API's for 'IssueType' object
 */
issueTypeRouter.post('/:userName/:appId',validate(issueTypeValidation.createIssueType), issueTypeController.createIssueType)
issueTypeRouter.get('/:userName/:appId',issueTypeController.getIssueTypeByCustIdAndCreatedBy)
issueTypeRouter.get('/',issueTypeController.getIssueType)
issueTypeRouter.patch('/:id', validate(issueTypeValidation.updateIssueType), issueTypeController.updateIssueType)
issueTypeRouter.delete('/',validate(issueTypeValidation.deleteIssueType), issueTypeController.deleteIssueType)
/**
 * CRUD API's for 'IssueTypeAutoReply' object
 */
issueTypeReplyRouter.post('/',validate(issueTypeAutoReplyValidation.createIssueTypeAutoReply), issueTypeAutoReplyController.createIssueTypeAutoReply)
issueTypeReplyRouter.get('/',issueTypeAutoReplyController.getIssueTypeAutoReply)
issueTypeReplyRouter.patch('/',validate(issueTypeAutoReplyValidation.updateDeleteIssueTypeAutoReply), issueTypeAutoReplyController.updateIssueTypeAutoReply )
issueTypeReplyRouter.delete('/', validate(issueTypeAutoReplyValidation.updateDeleteIssueTypeAutoReply), issueTypeAutoReplyController.deleteIssueTypeAutoReply)

googleAuthRouter.get('/authCode', googleAuthController.authCode);

/*
*zendesk APIs
*/
zendeskRouter.post('/attachment/upload/:appId', upload.single('file'), zendeskController.uploadAttachment)
zendeskRouter.post('/:appId/ticket/:groupId/create', validate(zendeskValidation.createTicket), zendeskController.createZendeskTicket);
zendeskRouter.put('/:appId/ticket/:ticketId/update', validate(zendeskValidation.updateTicket), zendeskController.updateZendeskTicket);
zendeskRouter.get('/:appId/ticket/:ticketId', validate(zendeskValidation.getTicket),zendeskController.getTicket)
/**
 * third party settings
 */
thirdPartySettingRouter.post('/:appId/insert/:type',validate(thirdPartySettingValidation.settings), integrationSettingController.updateOrCreate)
thirdPartySettingRouter.get('/:appId',validate(thirdPartySettingValidation.getSettings), integrationSettingController.getIntegrationSetting)
thirdPartySettingRouter.delete('/:appId/:type',validate(thirdPartySettingValidation.settings), integrationSettingController.deleteIntegrationSetting)
/**
 * Faq search
 */
faqRouter.get("/search",validate(autoSuggestValidation.searchFAQ),autoSuggestController.searchFAQ);

/**
 * Agile CRM APIs
 */
agileRouter.post('/:appId/contact', validate(agileValidation.createContact),
  agileController.createContact);
agileRouter.patch('/:appId/:contactId/contact', validate(agileValidation.updateContact),
  agileController.updateContact);
agileRouter.patch('/:appId/contacts/:contactId/tag', validate(agileValidation.updateTag),
  agileController.updateTag);
/**
 * setting router
 */
settingRouter.get('/application/:appId', validate(applicationSettingValidation.getAppSettingsByApplicationId),
  appSettingController.getAppSettingsByApplicationId);
settingRouter.post('/application/insert', validate(applicationSettingValidation.insertAppSetting),
  appSettingController.insertAppSettings);
settingRouter.patch('/application/:appId', validate(applicationSettingValidation.updateAppSettings),
  appSettingController.updateAppSettings);

//chat popup settings route
settingRouter.get('/popup/:appId', validate(applicationSettingValidation.getChatPopupMessage),
  chatPopupMessageController.getChatPopupMessage);
settingRouter.post('/popup/:appId', validate(applicationSettingValidation.createChatPopupMessage),
  chatPopupMessageController.createChatPopupMessage);
settingRouter.patch('/popup/:appId', validate(applicationSettingValidation.updateChatPopupMessage),
  chatPopupMessageController.updateChatPopupMessage);
settingRouter.delete('/popup/:appId', validate(applicationSettingValidation.deleteChatPopupMessage), 
  chatPopupMessageController.deleteChatPopupMessage);

// v2 user router
this.v2UserRouter.patch('/:userName/metadata',validate(userValidation.validateMetadata), userController.updateIntegryData);
this.v2UserRouter.patch('/:userId', validate(userValidation.validateUserUpdate), userController.updateApplozicUser)

metabaseRouter.get('/', validate(metabaseValidator.queryParams), metabaseController.getData)

//Cron Time Stamp Router
this.cronServiceRouter.post('/', cronService.updateLastRunTime)
this.cronServiceRouter.get('/:cronKey', cronService.getLastRunTime)
/**
 * Chargebee subscription
 */
//kommunicate customer subscription APIs
subscriptionRouter.patch('/detail',validate(subscriptionValidation.updateKommunicateSubscription),
subscriptionController.updateKommunicateCustomerSubscription)

// third party Subscription APIs
subscriptionRouter.get('/count', chargebeeController.subscriptionCount);
subscriptionRouter.get('/detail/:userId', validate(subscriptionValidation.getSubscription), chargebeeController.getSubscriptionDetail);
subscriptionRouter.get('/',validate(subscriptionValidation.getAllSubscriptionByApiKey), subscriptionController.getAllSubscriptionByApiKey);
subscriptionRouter.post('/',validate(subscriptionValidation.createSubscription), subscriptionController.createSubscription);
subscriptionRouter.patch('/update/:userId', validate(subscriptionValidation.updateSubscription), chargebeeController.updateSubscribedAgentCount)
subscriptionRouter.delete('/:subscriptionId', validate(subscriptionValidation.deleteSubscription), subscriptionController.deleteSubscription);