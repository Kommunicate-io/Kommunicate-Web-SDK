const path = require("path");
const fs = require('fs');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const nodeModules = {};


 fs.readdirSync(path.resolve(__dirname, '../node_modules'))
     .filter(function(x) {
         return ['.bin'].indexOf(x) === -1;
     })
     .forEach(function(mod) {
         nodeModules[mod] = 'commonjs ' + mod;
     });


module.exports = {
    entry: "./app.js",
    target: 'node',
    //context: path.resolve(__dirname, 'conf'),
    externals: nodeModules,
    output: {
      //path: path.join(__dirname, outputDirectory),
      filename: "./build/kommunicateServer.js"
    },
    //watch:true,
     // in order to ignore all modules in node_modules folder
    // module: {
    //   rules: [
        
    //   ]
    // }
}