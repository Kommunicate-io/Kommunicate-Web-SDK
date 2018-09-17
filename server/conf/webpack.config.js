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

if (!process.env.NODE_ENV) {
  console.log("\x1b[41m------ you are not set any environment: will set default -----\x1b[0m")
}

const env = process.env.NODE_ENV ? '"' + process.env.NODE_ENV + '"' : '"default"';
module.exports = {
  entry: "./app.js",
  target: 'node',
  externals: nodeModules,
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': env
      }
    }),
  ],
  output: {
    filename: "./build/server.bundle.js",
  }
}