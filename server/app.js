const express = require('express');
const path = require('path');
const app = express();
const config = require('./config/config-env');
var compression = require('compression');
const port = config.port;
const cors = require('cors');
const version = require('../package.json').version;

const routes = require('./routers/routes.js');
console.log('Build process started at :', new Date().toString());
console.log('Version: ', version);
require('../webplugin/development.js');

console.log('Host url: ', config.urls.hostUrl);
app.use(cors());
app.use(compression());
// Define the port to run on
app.set('port', port); //

app.use('/', routes.home);

const fileMaxAge = process.env.NODE_ENV && 2538000000; // 30 days cache period which is converted in milliseconds
//static paths
app.use(
    '/plugin',
    express.static(path.join(__dirname, '../webplugin'), {
        maxAge: fileMaxAge,
    })
);
app.use(
    '/plugin/sidebox',
    express.static(path.join(__dirname, '../webplugin'), {
        maxAge: fileMaxAge,
    })
);
app.use(
    '/example',
    express.static(path.join(__dirname, '../example'), {
        maxAge: false,
    })
);

//Listen for requests
var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    console.log('Open localhost using port ' + port); //
});
