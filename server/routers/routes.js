const app = require('./../app');
const express = require('express');
const webpluginController = require('../../webplugin/controller');
const {getLinkPreview} = require("link-preview-js");
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
home.get('/extractlink',function(req, res){
    var urlToExtract = req.query.linkToExtract; 
    if(!urlToExtract){
        res.status(400);
    }
    getLinkPreview(urlToExtract).then(
        (response) => {
            res.status(200).send({data: response});
        }
    ).catch(err => {
        res.send(400).send({error: 'invalid URL'});
    });

});