const express =require("express");
const path= require("path");
const bodyParser = require('body-parser');
const config = require("./conf/config");
const routes = require("./src/routers/routes.js");
const app =express();
const Sequelize = require("sequelize");
const port = config.getProperties().port;
const db = require("./src/models");
const homeRouter = require("./src/models");
const cors =require("cors");
const validate = require('express-validation');
var compressor = require('node-minify');
var cleanCss = require ('clean-css');
var hazelCastClient= require("./src/cache/hazelCacheClient");
const eventProcessor= require("./src/events/eventProcessor");
const cronInitializer = require('./src/cron/cronJobInitializer');
const Sentry = require('@sentry/node');
global['__basedir'] = __dirname
//var concat = require('concat-files');
app.use(cors());
process.env.NODE_ENV?console.log("\x1b[41m ------Warning: build running into "+process.env.NODE_ENV+" -----\x1b[0m"):console.log("\x1b[41m ------Warning: environment is not -----\x1b[0m");
// minify applozic plugin code files into a single file
const sentryConfig = config.getProperties().thirdPartyIntegration.sentry.server;
sentryConfig.enable && Sentry.init({ 
  dsn: sentryConfig.dsn 
});
compressor.minify({
  //compressor: 'gcc',
   compressor: 'no-compress',
  input: ['./src/webplugin/lib/js/jquery-3.2.1.min.js','./src/webplugin/lib/js/mck-ui-widget.min.js', './src/webplugin/lib/js/mck-ui-plugins.min.js', './src/webplugin/lib/js/mqttws31.js', './src/webplugin/lib/js/mck-emojis.min.js',
  './src/webplugin/lib/js/howler-2.0.2.min.js', './src/webplugin/lib/js/tiny-slider-2.4.0.js', './src/webplugin/lib/js/mustache.js', './src/webplugin/lib/js/aes.js', './src/webplugin/js/app/km-utils.js',
  './src/webplugin/lib/js/sentry-error-tracker.js'],
  output: './src/webplugin/js/kommunicatepluginrequirements.min.js',
  callback: function (err, min) {
    if(!err){
    console.log(" kommunicatepluginrequirements.min.js combined successfully");
    }
    else {
      console.log("err while minifying kommunicatepluginrequirements.min.js",err);
    }
  }
});

// minify applozic css files into a single file
compressor.minify({
  compressor: 'clean-css',
  //compressor: 'no-compress',
  input: ['./src/webplugin/lib/css/mck-combined.min.css', './src/webplugin/css/app/mck-sidebox-1.0.css', './src/webplugin/css/app/km-rich-message.css', './src/webplugin/css/app/km-login-model.css',
  './src/webplugin/lib/css/tiny-slider-2.4.0.css','./src/webplugin/css/app/km-sidebox.css'],
  output: './src/webplugin/css/kommunicatepluginrequirements.min.css',
  options: {
  advanced: true, // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
  aggressiveMerging: true, // set to false to disable aggressive merging of properties.
  sourceMap: true
  },
  callback: function (err, min) {
    if(!err){
    console.log(" kommunicatepluginrequirements.min.css combined successfully");
    }
    else {
      console.log("err while minifying kommunicatepluginrequirements.min.css",err);
    }
  }
});

compressor.minify({
  compressor: 'gcc',
  // compressor: 'no-compress',
  input: ['./src/webplugin/knowledgebase/common.js', './src/webplugin/knowledgebase/helpdocs.js', './src/webplugin/knowledgebase/kb.js'],
  output: './src/webplugin/knowledgebase/kommunicate-kb-0.1.min.js',
  callback: function (err, min) {
    if(!err)
    console.log(" kommunicate-kb-0.1.min.js combined successfully");
    else {
      console.log("err while minifying kommunicate-kb-0.1.min.js",err);
    }
  }
});
compressor.minify({
  // compressor: 'gcc',
  compressor: 'uglify-es',
  //compressor: 'no-compress',
  input: ['./src/webplugin/knowledgebase/kommunicate-kb-0.1.min.js',
  './src/webplugin/js/app/labels/default-labels.js',
  './src/webplugin/js/app/kommunicate-client.js',
  './src/webplugin/js/app/conversation/km-conversation-helper.js',
  './src/webplugin/js/app/conversation/km-conversation-service.js',
  './src/webplugin/js/app/kommunicate.js',
  './src/webplugin/js/app/km-richtext-markup-1.0.js', 
  './src/webplugin/js/app/km-message-markup-1.0.js',
  './src/webplugin/js/app/km-event-listner.js',
  './src/webplugin/js/app/km-attachment-service.js',
  './src/webplugin/js/app/mck-sidebox-1.0.js',
  './src/webplugin/js/app/kommunicate.custom.theme.js',
  './src/webplugin/js/app/kommunicateCommons.js',
  './src/webplugin/js/app/km-rich-text-event-handler.js',
  './src/webplugin/js/app/kommunicate-ui.js',
  './src/webplugin/js/app/events/applozic-event-listener.js',
  './src/webplugin/js/app/events/applozic-event-handler.js',
  './src/webplugin/js/app/km-post-initialization.js',
  './src/webplugin/js/app/mck-ringtone-service.js'],
  output: './src/webplugin/js/app/km-chat-combined-0.1.min.js',
  callback: function (err, min) {
    if(!err)
    console.log(" km-chat-combined-0.1.min.js combined successfully");
    else {
      console.log("err while minifying kkm-chat-combined-0.1.min.js",err);
    }
  }
});

compressor.minify({

  compressor: 'no-compress',
  input: ['./src/webplugin/js/app/applozic.jquery.js','./src/webplugin/js/app/applozic.chat.min.js','./src/webplugin/js/app/km-chat-combined-0.1.min.js'],
  output: './src/webplugin/js/app/kommunicate-plugin-0.2.min.js',
  callback: function (err, min) {
    if(!err)
    console.log(" kommunicate-plugin-0.2.min.js combined successfully");
    else {
      console.log("err while minifying kommunicate-plugin-0.2.min.js",err);
    }
  }
});

compressor.minify({
  compressor: 'clean-css',
  input: ['./src/webplugin/css/app/km-rich-message.css','./src/webplugin/css/app/mck-sidebox-1.0.css'],
  output: './src/webplugin/js/app/mck-sidebox-1.0.min.css',
  callback: function (err, min) {
    if(!err)
    console.log("mck-sidebox-1.0.css minified successfully");
    else {
      console.log("err while minifying mck-sidebox-1.0.css",err);
    }
  }
});


app.set("db",db);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static patchCustomerapp.use('/css', express.static("css"));
app.use('/plugin', express.static(path.join(__dirname,"src/webplugin")));
app.use('/plugin/sidebox', express.static(path.join(__dirname,"src/webplugin")));

app.use('/img', express.static("img"));
app.use('/chat/js',express.static("src/chat-demo"));

//app.use('/',routes.home);
app.use('/',routes.home);
app.use('/users',routes.users);
app.use('/applications',routes.applications);
app.use('/login',routes.login);
app.use('/customers',routes.customers);
app.use('/misc',routes.misc);
app.use('/autosuggest/message',routes.autoSuggest);
//not in use. customer/applozic is being used for applozic signup.
//app.use('/signUpWithApplozic',routes.signUpWithApplozic);
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

//Cron Time Stamp Route
app.use('/crontime',routes.cronServiceRouter);


function startApp() {
    app.listen(port, function () {
        console.log('Express server listening on port : ' + port);
        //to do: start the event consumers
        eventProcessor.initializeEventsConsumers();
        cronInitializer.initiatAllCron();
    });
}

Promise.all([hazelCastClient.initializeClient(),db.sequelize.sync()])
    .then(startApp)
    .catch(e=> {
      console.log("error while syncing with db",e);
        throw new Error(e);
    });

/* app.use(function (err, req, res, next) {
  console.error(err.stack);
  console.log("executing error handlar",err);
  res.status(500).send('Something is broken!')
}) */

app.use((err, req,res,next)=>{
console.log("executing error handlar",err);
if (err instanceof validate.ValidationError){
res.status(err.status).json(err);
} else {
res.status(500).send(err);
}
});
module.exports = app;
