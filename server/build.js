const version = require('../package.json').version;
console.log('Build process started at :', new Date().toString());
console.log('Version: ', version);
require('../webplugin/pluginOptimizer');
