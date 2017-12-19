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
//const issueTypeValidation


//router declaration
const userRouter = express.Router();
const applicationRouter = express.Router();
const loginRouter = express.Router();
const customerRouter = express.Router();
const home = express.Router();
const miscRouters = express.Router();
const chatRouter = express.Router();
const signUpWithApplozicRouter = express.Router();
const conversationRouter =express.Router();
const autoSuggestRouter = express.Router();
const profileImageRouter = express.Router();
const groupRouter = express.Router();
const issueTypeRouter = express.Router();
const issueTypeReplyRouter = express.Router(); 

//export routers
exports.home = home;
exports.users=userRouter;
exports.applications = applicationRouter;
exports.login= loginRouter;
exports.customers =customerRouter;
exports.misc = miscRouters;
exports.signUpWithApplozic = signUpWithApplozicRouter;
exports.chat = chatRouter;
exports.conversation=conversationRouter;
exports.autoSuggest = autoSuggestRouter;
exports.profileImage = profileImageRouter;
exports.group = groupRouter;
exports.issueType = issueTypeRouter;
exports.issueTypeAutoReply = issueTypeReplyRouter;

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
// userRouter.patch('/:userName/working-hour',validate(userValidation.businessHours),userController.updateBusinessHours);
loginRouter.post('/',validate(loginValidation.login),loginController.login);
signUpWithApplozicRouter.post('/', validate(loginValidation.login), loginController.signUpWithApplozic);
customerRouter.post('/',validate(customerValidation.createCustomer),registerController.createCustomer);
customerRouter.patch('/:userId',validate(customerValidation.patchCustomer),registerController.patchCustomer);
customerRouter.get('/:userName',registerController.getCustomerInformation);
customerRouter.post('/applozic',function(req,res){
                          console.log("called sign up with Applozic");
                          registerController.signUpWithAplozic(req,res);});
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
conversationRouter.post('/', validate(conversationValidation.createConversation),conversationController.createConversation);
conversationRouter.get('/participent/:participentId',validate(conversationValidation.getConversationListOfParticipent),conversationController.getConversationList);
conversationRouter.post('/member/add',validate(conversationValidation.addMemberIntoConversation),conversationController.addMemberIntoConversation)
//application router
applicationRouter.post('/:appId/welcomemessage',validate(applicationValidation.postWelcomeMessage),inAppMsgController.saveWelcomeMessage);
applicationRouter.get('/:appId/welcomemessage',validate(applicationValidation.getWelcomeMessage),inAppMsgController.getInAppMessages);
applicationRouter.post('/events',inAppMsgController.processEvents);
//group router
groupRouter.post('/create',userController.createGroupOfAllAgents)
issueTypeRouter.get('/',validate(applicationValidation.getWelcomeMessage),inAppMsgController.getInAppMessages)
issueTypeReplyRouter.get('/',validate(applicationValidation.getWelcomeMessage),inAppMsgController.getInAppMessages)