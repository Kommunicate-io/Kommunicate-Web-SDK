const app = require('./../app');
const express = require('express');
const path = require('path');
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

home.get('/kommunicate.app', function (req, res) {
    // below is the code to handle the "forward".
    req.url = '/v1/kommunicate.app';
    home.handle(req, res);
});
home.get('/:version/kommunicate.app', webpluginController.getPlugin);

home.get('/chat', webpluginController.getPluginHTML)

// home.get('/robots.txt', (req, res) => {
//     const sanitizedHost = req.hostname.toLowerCase().trim();
//     const allowedHosts = ['widget-cn.kommunicate.io', 'widget.kommunicate.io'];
//     const robotsPath = path.resolve(__dirname, '../../robots.txt');
//     if (true) {
//         res.type('text/plain');
//         res.sendFile(robotsPath, err => {
//             if (err) {
//                 console.error('[robots.txt] Error serving file:', err);
//                 res.status(404).send('Not found');
//             }            
//         });
//     } else {
//         res.status(404).send('Not Found');
//     }
// });
