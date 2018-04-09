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
var hazelCastClient= require("./src/cache/hazelCacheClient");
//var concat = require('concat-files');
app.use(cors());


// concat(['./src/webplugin/js/app/kommunicate.js','./src/webplugin/js/app/constant.js','./src/webplugin/js/app/km-richtext-markup-1.0.js','./src/webplugin/js/app/mck-sidebox-1.0.js','./src/webplugin/js/app/km-rich-text-event-handler.js'],
// './src/webplugin/js/app/kommunicate-plugin-0.1.min.js', function(err) {
//   if (err) throw err
//   console.log('done');
// });
compressor.minify({
  compressor: 'gcc',
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
  compressor: 'gcc',
  //compressor: 'no-compress',
  input: ['./src/webplugin/js/app/constant.js','./src/webplugin/js/app/kommunicate-client.js','./src/webplugin/js/app/kommunicate.js','./src/webplugin/js/app/km-richtext-markup-1.0.js','./src/webplugin/js/app/mck-sidebox-1.0.js','./src/webplugin/js/app/km-rich-text-event-handler.js','./src/webplugin/js/app/kommunicate-ui.js','./src/webplugin/js/app/km-post-initialization.js'],
  output: './src/webplugin/js/app/kommunicate-plugin-0.1.min.js',
  callback: function (err, min) {
    if(!err)
    console.log(" kommunicate-plugin-0.1.min.js combined successfully");
    else {
      console.log("err while minifying kommunicate-plugin-0.1.min.js",err);
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
app.use('/faq',routes.faq);
app.use('/google', routes.googleAuth);

function startApp() {
    app.listen(port, function () {
        console.log('Express server listening on port : ' + port);
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
