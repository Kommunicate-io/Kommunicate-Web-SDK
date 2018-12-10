const path = require("path");
const fs = require('fs');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: 'public/index.html',
    filename: 'index.html',
    inject: 'body'
})

module.exports = env => {
    console.log(`\x1b[41m------ Build is running on ${env && env.REACT_APP_NODE_ENV}-----\x1b[0m`)
    return {
        entry: "./src/index.js",

        output: {
            path: path.resolve(__dirname, 'build'),
            filename: "./bundle.js",
            publicPath: '/'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        plugins: ['transform-object-rest-spread', 'transform-class-properties']
                    }
                },
                {
                    use: ['style-loader', 'css-loader'],
                    test: /\.css$/
                },
                {
                    test: /\.(jpe?g|png|gif|svg|woff(2)?|ttf|eot)$/i,
                    loader: "file-loader?name=[name].[ext]&outputPath=icons/"
                }
            ]
        },
        devServer: {
            hot: true,
            contentBase: './public',
            compress: true,
            historyApiFallback: true,
            port: 9000
        },
        plugins: [
            HtmlWebpackPluginConfig,
            new webpack.DefinePlugin({
                'process.env': {
                    'REACT_APP_NODE_ENV': env && env.REACT_APP_NODE_ENV ? JSON.stringify(env.REACT_APP_NODE_ENV) : JSON.stringify("development")
                }
            }),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new CopyWebpackPlugin([
                {
                    context: './public/', from: '**/*', to: './', force: true,
                }
            ])
        ]
    }
}