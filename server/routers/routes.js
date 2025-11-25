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

const buildIndexPath = path.join(__dirname, '../../webplugin/build/index.html');
const templateIndexPath = path.join(__dirname, '../../webplugin/template/index.html');

const resolveBranch = () => {
    var envBranch =
        process.env._BRANCH ||
        process.env.BRANCH ||
        process.env.AWS_BRANCH ||
        process.env.BRANCH_NAME ||
        process.env.FIREBASE_CI_BRANCH;
    if (envBranch) return envBranch;
    try {
        return execSync('git rev-parse --abbrev-ref HEAD', {
            cwd: path.join(__dirname, '..', '..'),
            encoding: 'utf8',
            timeout: 2000,
        })
            .toString()
            .trim();
    } catch (e) {
        return 'unknown-branch';
    }
};

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
            res.sendFile(templateIndexPath);
        }
    });
});

home.get('/kommunicate.app', function (req, res) {
    // below is the code to handle the "forward".
    req.url = '/v1/kommunicate.app';
    home.handle(req, res);
});
home.get('/:version/kommunicate.app', webpluginController.getPlugin);
home.get('/chat', webpluginController.getPluginHTML);
