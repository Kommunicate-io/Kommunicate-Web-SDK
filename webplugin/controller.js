const path = require('path');
const fs = require('fs');
const util = require('util');
const config = require('./../server/config/config-env');
const { pluginVersionData } = require('./development.js');

exports.getPlugin = async (req, res) => {
    const MCK_PLUGIN_VERSION = req.params.version;
    if (!MCK_PLUGIN_VERSION) {
        res.send('err while getting plugin...');
        return console.log('unable to get plugin version');
    }
    var data = Object.keys(pluginVersionData).length
        ? pluginVersionData[MCK_PLUGIN_VERSION]
        : await generatePluginFile(req, res);

    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=900');
    res.send(data);
    console.log('plugin code sent successfully');
};

const generatePluginFile = async (req, res) => {
    const MCK_CONTEXTPATH = config.urls.hostUrl;
    const MCK_STATICPATH = MCK_CONTEXTPATH + '/plugin';
    const PLUGIN_SETTING = config.pluginProperties;
    const MCK_THIRD_PARTY_INTEGRATION = config.thirdPartyIntegration;
    const MCK_PLUGIN_VERSION = req.params.version;
    PLUGIN_SETTING.kommunicateApiUrl =
        PLUGIN_SETTING.kommunicateApiUrl || config.urls.kommunicateBaseUrl;
    PLUGIN_SETTING.applozicBaseUrl = PLUGIN_SETTING.applozicBaseUrl || config.urls.applozicBaseUrl;

    console.log('setting context and static path', MCK_CONTEXTPATH);
    const pluginMinPath = path.join(__dirname, 'build/plugin.min.js');
    const pluginPath = fs.existsSync(pluginMinPath)
        ? pluginMinPath
        : path.join(__dirname, 'build/plugin.js');
    var data = await util.promisify(fs.readFile)(pluginPath, 'utf8');
    var plugin = data
        .replace(':MCK_CONTEXTPATH', MCK_CONTEXTPATH)
        .replace(':MCK_THIRD_PARTY_INTEGRATION', JSON.stringify(MCK_THIRD_PARTY_INTEGRATION))
        .replace(':MCK_PLUGIN_VERSION', MCK_PLUGIN_VERSION)
        .replace(':PLUGIN_SETTINGS', JSON.stringify(PLUGIN_SETTING))
        .replace(':MCK_STATICPATH', MCK_STATICPATH)
        .replace(':PRODUCT_ID', 'kommunicate');
    return plugin;
};

exports.getPluginHTML = async (req, res) => {
    const APP_ID = req.query.appId;
    if (!APP_ID) {
        res.send('Error while getting application id...');
        return console.log('Unable to get application id');
    }
    res.sendFile(path.join(__dirname, 'build/chat.html'));
    console.log('plugin HTML sent successfully');
};
