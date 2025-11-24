const app = require('./../app');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const webpluginController = require('../../webplugin/controller');
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

home.get('/index.html', function (req, res) {
    const buildIndex = path.join(__dirname, '../../webplugin/build/index.html');
    const templateIndex = path.join(__dirname, '../../webplugin/template/index.html');
    const indexPath = fs.existsSync(buildIndex) ? buildIndex : templateIndex;
    try {
        const raw = fs.readFileSync(indexPath, 'utf8');
        const branch =
            process.env.BRANCH ||
            process.env.AWS_BRANCH ||
            (() => {
                try {
                    return execSync('git rev-parse --abbrev-ref HEAD', {
                        cwd: path.join(__dirname, '..', '..'),
                        encoding: 'utf8',
                    })
                        .toString()
                        .trim();
                } catch (e) {
                    return '';
                }
            })() ||
            'unknown-branch';
        res.type('html').send(raw.replace(/__KM_BRANCH__/g, branch));
    } catch (err) {
        res.sendFile(indexPath);
    }
});

home.get('/kommunicate.app', function (req, res) {
    // below is the code to handle the "forward".
    req.url = '/v1/kommunicate.app';
    home.handle(req, res);
});
home.get('/:version/kommunicate.app', webpluginController.getPlugin);
home.get('/chat', webpluginController.getPluginHTML);
