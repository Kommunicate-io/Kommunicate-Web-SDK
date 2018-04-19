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
const zendeskValidation = require('../zendesk/validation') ;
const integrationSettingController = require('../thirdPartyIntegration/integrationSettingController');
const thirdPartySettingValidation = require('../thirdPartyIntegration/validation')
const googleAuthController = require('../googleAuth/googleAuthController');
const chargebeeController= require("../chargebee/chargebeeController");


//router declaration
const userRouter = express.Router();
const applicationRouter = express.Router();
const loginRouter = express.Router();
const customerRouter = express.Router();
const home = express.Router();
const miscRouters = express.Router();
const chatRouter = express.Router();
//const signUpWithApplozicRouter = express.Router();
const conversationRouter =express.Router();
const autoSuggestRouter = express.Router();
const profileImageRouter = express.Router();
const groupRouter = express.Router();
const issueTypeRouter = express.Router();
const issueTypeReplyRouter = express.Router(); 
const zendeskRouter = express.Router();
const thirdPartySettingRouter = express.Router();
const faqRouter = express.Router();
const googleAuthRouter = express.Router();
const chargebeeRouter = express.Router();

//export routers
exports.home = home;
exports.users=userRouter;
exports.applications = applicationRouter;
exports.login= loginRouter;
exports.customers =customerRouter;
exports.misc = miscRouters;
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
exports.chargebee = chargebeeRouter;

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

home.get('/',function(req,res){
  console.log("req received at home routes");
  res.status(200).json({"message":"Welcome to kommunicate"});
});
home.get('/kommunicate.app',webpluginController.getPlugin);
// requests to user router
userRouter.get('/',validate(userValidation.getAllUser),userController.getAllUsers);
userRouter.get('/:userName',userController.getUserByName);
userRouter.get('/:userName/:appId',userController.getByUserNameAndAppId);
//userRouter.patch('/:userName/:appId',userController.patchUser);
userRouter.patch('/:userName/:appId',userController.patchUser);
userRouter.post('/:userName/business-hours',validate(userValidation.updateBusinessHours),userController.updateBusinessHours);
userRouter.post('/',validate(userValidation.createUser),userController.createUser);
userRouter.post('/:userName/subscribe/off-hours-message-notification',userController.subscribeOffHoursNotification);
userRouter.post('/password-reset', passwordResetController.processPasswordResetRequest);
userRouter.get('/password/reset-form',passwordResetController.processUpdatePasswordRequest);
userRouter.post('/password-update',passwordResetController.updatePassword);
userRouter.post('/:userName/password-reset', passwordResetController.processPasswordResetRequest);
userRouter.post('/password/update',validate(userValidation.updatePassword),userController.updatePassword);
userRouter.patch('/goAway/:userName/:appId',userController.goAway);
userRouter.patch('/goOnline/:userName/:appId',userController.goOnline);
userRouter.patch('/:botId/:appId/:status',validate(userValidation.botStatus), userController.changeBotStatus);
// userRouter.patch('/:userName/working-hour',validate(userValidation.businessHours),userController.updateBusinessHours);
loginRouter.post('/',validate(loginValidation.login),loginController.login);
//signUpWithApplozicRouter.post('/', validate(loginValidation.login), loginController.signUpWithApplozic);
customerRouter.post('/',validate(customerValidation.createCustomer),registerController.createCustomer);
customerRouter.patch('/:userId',validate(customerValidation.patchCustomer),registerController.patchCustomer);
customerRouter.get('/:userName',registerController.getCustomerInformation);
customerRouter.post('/applozic',function(req,res){
                          console.log("called sign up with Applozic");
                          registerController.signUpWithAplozic(req,res);});
customerRouter.patch('/:appId/routing/:routingState', validate(customerValidation.updateRoutingState), registerController.updateAgentRoutingState);
customerRouter.get('/',validate(customerValidation.searchCustomer), registerController.getCustomerByApplicationId)
miscRouters.get('/tz',userController.getTimezone);
miscRouters.post('/process-off-business-hours',userController.processOffBusinessHours);
miscRouters.post('/mail', validate(mailValidation.sendMail),mailController.sendMail);
autoSuggestRouter.get('/', autoSuggestController.getAllSuggestions);
autoSuggestRouter.get('/:applicationId', autoSuggestController.getSuggestionsByAppId);
autoSuggestRouter.post('/', validate(autoSuggestValidation.createSuggestion), autoSuggestController.createSuggestion);
autoSuggestRouter.patch('/',validate(autoSuggestValidation.updateSuggestion), autoSuggestController.updateSuggestion)
autoSuggestRouter.delete('/',validate(autoSuggestValidation.deleteSuggetion), autoSuggestController.deleteSuggetion)
chatRouter.get('/visitor',chatController.visitorChat);
profileImageRouter.post('/', upload.single('file'), profileImageController.uploadImageToS3);

//conversation router
conversationRouter.post('/', validate(conversationValidation.createConversation),conversationController.createConversation);
conversationRouter.patch('/update', validate(conversationValidation.updateConversation),conversationController.updateConversation);
conversationRouter.get('/participent/:participentId',validate(conversationValidation.getConversationListOfParticipent),conversationController.getConversationList);
conversationRouter.get('/', conversationController.getConversationStats);
conversationRouter.post('/member/add',validate(conversationValidation.addMemberIntoConversation),conversationController.addMemberIntoConversation);
conversationRouter.get('/stats',validate(conversationValidation.getConversationStats),conversationController.getConversationStat);
conversationRouter.post('/create', validate(conversationValidation.createConversationV2), conversationController.createSupportGroup);
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
zendeskRouter.post('/:appId/ticket/:groupId/create', validate(zendeskValidation.createTicket), zendeskController.createZendeskTicket);
zendeskRouter.put('/:appId/ticket/:groupId/update', validate(zendeskValidation.updateTicket), zendeskController.updateZendeskTicket);
zendeskRouter.get('/:appId/ticket/:groupId', validate(zendeskValidation.getTicket),zendeskController.getTicket)
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
 * Chargebee
 */
chargebeeRouter.get('/count', chargebeeController.subscriptionCount);
