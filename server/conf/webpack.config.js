const path = require("path");
const fs = require('fs');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const nodeModules = {};


fs.readdirSync(path.resolve(__dirname, '../node_modules'))
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });


module.exports = {
  entry: "./app.js",
  target: 'node',
  externals: nodeModules,
  plugins: [
    new CleanWebpackPlugin(['dist'])
  ],
  // module: {
  //   rules: [
  //   ]
  // },
  // resolve: {
  //   alias: {
  //     plugin: path.resolve(__dirname, './src/webplugin/'),
  //   }
  // },
  output: {
    filename: "./build/kommunicateServer.js",
    //publicPath:"./build/assets"
  }
}