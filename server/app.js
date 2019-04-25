const express =require("express");
const path= require("path");
const bodyParser = require('body-parser');
const config = require("./conf/config");
const routes = require("./src/routers/routes.js");
const app =express();
const port = config.getProperties().port;
const db = require("./src/models");
const cors =require("cors");
const validate = require('express-validation');
var hazelCastClient= require("./src/cache/hazelCacheClient");
const eventProcessor= require("./src/events/eventProcessor");
const cronInitializer = require('./src/cron/cronJobInitializer');
const Sentry = require('@sentry/node');
const KM_SERVER_RELEASE_VERSION = require("../server/src/utils/constant").KM_SERVER_RELEASE_VERSION;
const logger = require("./src/utils/logger")
require('./src/webplugin/pluginOptimizer');
require('./src/database/mongoDataSource');

const deploymentSettings= process.argv;

global['__basedir'] = __dirname

app.use(cors());

process.env.NODE_ENV?console.log("\x1b[41m ------Warning: build running into "+process.env.NODE_ENV+" -----\x1b[0m"):console.log("\x1b[41m ------Warning: environment is not -----\x1b[0m");

const sentryConfig = config.getProperties().thirdPartyIntegration.sentry.server;

sentryConfig.enable && Sentry.init({ 
  dsn: sentryConfig.dsn,
  release: KM_SERVER_RELEASE_VERSION 
});

app.set("db",db);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static paths
app.use('/plugin', express.static(path.join(__dirname,"src/webplugin")));
app.use('/plugin/sidebox', express.static(path.join(__dirname,"src/webplugin")));
app.use('/img', express.static("img"));
app.use('/chat/js',express.static("src/chat-demo"));

app.use('/',routes.home);
app.use('/users',routes.users);
app.use('/applications',routes.applications);
app.use('/login',routes.login);
app.use('/customers',routes.customers);
app.use('/misc',routes.misc);
app.use('/autosuggest/message',routes.autoSuggest);
app.use('/chat',routes.chat);
app.use('/profileImage',routes.profileImage);
app.use('/conversations',routes.conversation);
app.use('/group',routes.group);
app.use('/issuetype', routes.issueType);
app.use('/issuetype/autoreply', routes.issueTypeAutoReply);
app.use('/zendesk', routes.zendesk);
app.use('/integration/settings', routes.thirdPartySetting);
app.use('/kb',routes.faq);
app.use('/google', routes.googleAuth);
app.use('/subscription', routes.subscription);
app.use('/agilecrm', routes.agile);
app.use('/settings',routes.setting);
app.use('/v2/users',routes.v2UserRouter);
app.use('/metabase',routes.metabaseRouter);
app.use('/feedback', routes.feedbackRouter);
app.use('/apple-app-site-association', routes.iosSettingRouter);
app.use('/onboarding', routes.onboardingRouter)

//Cron Time Stamp Route
app.use('/crontime',routes.cronServiceRouter);

//Chat Popup Route
app.use('/popup', routes.chatPopupRouter);

function startApp() {
    app.listen(port, function () {
        console.log('Express server listening on port : ' + port);
       
       deploymentSettings.forEach(setting=>{
          if(setting =="--ep"){
            logger.info("[EP] Ep is enabled... initializing event consumers");
            eventProcessor.initializeEventsConsumers();
          }
        });    
        cronInitializer.initiateAllCron();
    });
}

Promise.all([hazelCastClient.initializeClient(),db.sequelize.sync()])
    .then(startApp)
    .catch(e=> {
      console.log("error while syncing with db",e);
        throw new Error(e);
    });


app.use((err, req,res,next)=>{
console.log("executing error handlar",err);
if (err instanceof validate.ValidationError){
res.status(err.status).json(err);
} else {
res.status(500).send(err);
}
});
module.exports = app;
