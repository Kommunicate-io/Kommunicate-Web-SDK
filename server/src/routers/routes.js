const app = require("../../app.js");
const express = require("express");
const userController = require("../users/userController.js");
const loginController= require("../login/loginController");
const registerController=require("../register/registerController");
const userRouter = express.Router();
const applicationRouter = express.Router();
const loginRouter = express.Router();
const customerRouter = express.Router();
const home = express.Router();
const miscRouters = express.Router();
const chatRouter = express.Router();
const validate = require('express-validation');
const userValidation = require("../users/validation");
const loginValidation = require("../login/validation");
const webpluginController= require("../webplugin/controller");
const passwordResetController = require("../passwordreset/passwordResetController");
const customerValidation = require("../register/validation");
const mailValidation = require("../mail/validation.js");
const mailController = require ("../mail/mailController");
const chatController =require('../chat-demo/chatController');
const signUpWithApplozicRouter = express.Router();
exports.home = home;
exports.users=userRouter;
exports.applications = applicationRouter;
exports.login= loginRouter;
exports.customers =customerRouter;
exports.misc = miscRouters;
exports.signUpWithApplozic = signUpWithApplozicRouter;
exports.chat = chatRouter;


const autoSuggestRouter = express.Router();
const autoSuggestController = require('../autosuggest/autosuggestController');
const autoSuggestValidation = require('../autosuggest/validation');
exports.autoSuggest = autoSuggestRouter;

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
const profileImageRouter = express.Router();
const profileImageController = require('../profileImage/profileImageController');
exports.profileImage = profileImageRouter;

home.get('/',function(req,res){
  console.log("req received at home routes");
  res.status(200).json({"message":"Welcome to kommunicate"});
});
home.get('/kommunicate.app',webpluginController.getPlugin);
// requests to user router
userRouter.get('/',userController.getAllUsers);
userRouter.get('/:userName',userController.getUserByName);
userRouter.get('/:userName/:appId',userController.getByUserNameAndAppId);
userRouter.patch('/:userName/:appId',userController.patchUser);
userRouter.post('/:userName/business-hours',validate(userValidation.updateBusinessHours),userController.updateBusinessHours);
userRouter.post('/',validate(userValidation.createUser),userController.createUser);
userRouter.post('/:userName/subscribe/off-hours-message-notification',userController.subscribeOffHoursNotification);
userRouter.post('/password-reset', passwordResetController.processPasswordResetRequest);
userRouter.get('/password/reset-form',passwordResetController.processUpdatePasswordRequest);
userRouter.post('/password-update',passwordResetController.updatePassword);
userRouter.post('/:userName/password-reset', passwordResetController.processPasswordResetRequest);
// userRouter.patch('/:userName/working-hour',validate(userValidation.businessHours),userController.updateBusinessHours);
loginRouter.post('/',validate(loginValidation.login),loginController.login);
signUpWithApplozicRouter.post('/', validate(loginValidation.login), loginController.signUpWithApplozic);
customerRouter.post('/',validate(customerValidation.createCustomer),registerController.createCustomer);
customerRouter.patch('/:userId',registerController.patchCustomer);
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
chatRouter.get('/visitor',chatController.visitorChat);
profileImageRouter.post('/', upload.single('file'), profileImageController.uploadImageToS3)

