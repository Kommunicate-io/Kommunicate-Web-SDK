const express = require('express');
const path = require('path');
const app = express();
const config = require("./config/config-env");
const port = config.port;
const cors = require("cors");
const version = require('../package.json').version

const routes = require("./routers/routes.js");
console.log("Build process started at :", new Date().toString());
console.log("Version: ", version);
require('../webplugin/pluginOptimizer');

console.log("Host url: ", config.urls.hostUrl);
app.use(cors());
// Define the port to run on
app.set('port', port); //
app.use('/', routes.home);

const fileMaxAge = process.env.NODE_ENV && 2538000000; // 30 days cache period which is converted in milliseconds
//static paths
app.use('/plugin', express.static(path.join(__dirname, '../webplugin'), {
  maxAge: fileMaxAge
}));
app.use('/plugin/sidebox', express.static(path.join(__dirname, '../webplugin'), {
  maxAge: fileMaxAge
}));

//Listen for requests
var server = app.listen(app.get('port'), function () {
  var port = server.address().port;
  console.log('Open localhost using port ' + port); //
});
