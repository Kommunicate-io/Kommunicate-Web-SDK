const path = require("path");
const outputDirectory = "build";

module.exports = {
    entry: "../src/app.js",
    target: 'node',
    output: {
      path: path.join(__dirname, outputDirectory),
      filename: "kommunicateServer.js"
    },
    externals: nodeModules,
    // module: {
    //   rules: [
    //     // {
    //     //   test: /\.js$/,
    //     //   exclude: /node_modules/,
    //     //   use: {
    //     //     loader: "babel-loader"
    //     //   }
    //     // },
    //     {
    //       test: /\.css$/,
    //       use: ["style-loader", "css-loader"]
    //     }
    //   ]
    // }
}