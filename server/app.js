const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const config = require('./config/config-env');
var compression = require('compression');
const port = config.port;
const cors = require('cors');
const version = require('../package.json').version;

const routes = require('./routers/routes.js');
const { minifyHtml } = require('./utils/html-minifier');
const fileMaxAge = process.env.NODE_ENV && 2538000000;
const sideboxCacheControl = fileMaxAge
    ? `public, max-age=${Math.floor(fileMaxAge / 1000)}`
    : 'public, max-age=0';
const sideboxBuildDir = path.join(__dirname, '../webplugin/build');
const sideboxTemplatePath = path.join(__dirname, '../webplugin/template/mck-sidebox.html');
const sideboxHtmlCache = new Map();
console.log('Build process started at :', new Date().toString());
console.log('Version: ', version);
require('../webplugin/development.js');

console.log('Host url: ', config.urls.hostUrl);
app.use(cors());
app.use(compression());
// Define the port to run on
app.set('port', port); //

app.use('/', routes.home);

app.get(/^\/plugin(?:\/build)?\/mck-sidebox.*\.html$/, async (req, res, next) => {
    const fileName = path.basename(req.path);
    const cacheKey = fileName || 'template';
    let html = sideboxHtmlCache.get(cacheKey);
    if (html) {
        res.type('html').set('Cache-Control', sideboxCacheControl).send(html);
        return;
    }

    const builtPath = path.join(sideboxBuildDir, fileName || '');
    try {
        let rawHtml;
        try {
            rawHtml = await fs.promises.readFile(builtPath, 'utf8');
        } catch (readErr) {
            if (readErr && readErr.code === 'ENOENT') {
                rawHtml = await fs.promises.readFile(sideboxTemplatePath, 'utf8');
            } else {
                throw readErr;
            }
        }
        html = minifyHtml(rawHtml);
        sideboxHtmlCache.set(cacheKey, html);
        res.type('html').set('Cache-Control', sideboxCacheControl).send(html);
    } catch (error) {
        console.error('Error while serving minified mck-sidebox:', error);
        next(error);
    }
});

//static paths
app.use(
    '/plugin',
    express.static(path.join(__dirname, '../webplugin'), {
        maxAge: fileMaxAge,
    })
);
app.use(
    '/css',
    express.static(path.join(__dirname, '../webplugin/css'), {
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
