const path = require("path");
const fs = require('fs');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

const optimization = {
    splitChunks: {
        cacheGroups: {
            common: {
                test: /[\\/]node_modules[\\/]/,
                name: "common",
                chunks: "all",
                priority: 20,
                enforce: true
            }
        }
    }
}

module.exports = env => {
    console.log(`\x1b[41m------ Build is running on ${env && env.REACT_APP_NODE_ENV}----${env&&env.BRAND}-\x1b[0m`)
    let faviconIconPath = env && env.BRAND == "applozic" ? 'assets/favicon/applozic.ico' : 'assets/favicon/kommunicate.ico'
    let productTitle = env && env.BRAND == "applozic"? "Applozic": "Kommunicate";
    var plugins = [
        new HtmlWebpackPlugin({
            title: productTitle,
            template: 'public/index.html',
            filename: 'index.html',
            favicon: faviconIconPath,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'REACT_APP_NODE_ENV': env && env.REACT_APP_NODE_ENV ? JSON.stringify(env.REACT_APP_NODE_ENV) : JSON.stringify("development")
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new CopyWebpackPlugin([
            {
                context: './public/', from: '**/*', to: './', ignore: ['index.html', 'favicon.ico']
            }
        ]),
        new CleanWebpackPlugin('build/**/*')
    ]
    if (env && env.REACT_APP_NODE_ENV == 'test') {
        console.log('bundle analyzer added')
        plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 4545, analyzerHost: "localhost" }))
    }
    return {
        entry: {
            dashboard: "./src/index.js",
        },
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: "[name].bundle.js",
            publicPath: '/'
        },
        devtool: 'source-map',
        optimization: optimization,
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
        plugins: plugins
    }
}