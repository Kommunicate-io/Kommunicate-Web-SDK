const app = require('./../app');
const express = require('express');
const path = require('path');
const fs = require('fs');
const webpluginController = require('../../webplugin/controller');
const { resolveBranch } = require('../utils/branch');
//router declaration
const home = express.Router();

//export routers
exports.home = home;

home.get('/', function (req, res) {
    console.log('req received at home routes');
    res.status(200).json({
        message: 'Welcome to kommunicate',
    });
});

const buildIndexPath = path.join(__dirname, '../../webplugin/build/index.html');
const templateIndexPath = path.join(__dirname, '../../webplugin/template/index.html');

const loadIndexTemplate = () => {
    const indexPath = fs.existsSync(buildIndexPath) ? buildIndexPath : templateIndexPath;
    try {
        const raw = fs.readFileSync(indexPath, 'utf8');
        const branch = resolveBranch();
        const envValue =
            process.env._BUILD_ENV ||
            process.env.NODE_ENV ||
            process.env.BRANCH_ENV ||
            process.env.FIREBASE_ENV ||
            'development';
        return raw.replace(/__KM_BRANCH__/g, branch).replace(/__KM_ENV__/g, envValue);
    } catch (e) {
        return null;
    }
};

const cachedIndexHtml = loadIndexTemplate();

home.get('/index.html', function (req, res) {
    if (cachedIndexHtml) {
        res.type('html').send(cachedIndexHtml);
        return;
    }
    res.sendFile(buildIndexPath, (err) => {
        if (err) {
            res.sendFile(templateIndexPath, (templateErr) => {
                if (templateErr) {
                    console.error('Failed to load index template:', templateErr);
                    if (!res.headersSent) {
                        res.status(500).send('Unable to load Kommunicate index.');
                    }
                }
            });
        }
    });
});

home.get('/kommunicate.app', function (req, res) {
    // backward-compatible root loader uses v2 via forward
    req.url = '/v2/kommunicate.app';
    home.handle(req, res);
});
home.get('/kommunicate-widget-3.0.min.js', function (req, res) {
    // new loader alias uses v3 directly
    req.params.version = 'v3';
    webpluginController.getPlugin(req, res);
});
home.get('/:version/kommunicate.app', webpluginController.getPlugin);
home.get('/chat', webpluginController.getPluginHTML);
