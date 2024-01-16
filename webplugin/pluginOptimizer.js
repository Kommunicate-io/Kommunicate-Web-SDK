const minify = require('@node-minify/core');
const terser = require('@node-minify/terser');
const noCompress = require('@node-minify/no-compress');
const gcc = require('@node-minify/google-closure-compiler');
const cleanCSS = require('@node-minify/clean-css');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const version = require('child_process')
    .execSync('git rev-parse --short HEAD', {
        cwd: __dirname,
    })
    .toString()
    .trim();
const {
    PLUGIN_CSS_FILES,
    PLUGIN_BUNDLE_FILES,
    PLUGIN_JS_FILES,
    THIRD_PARTY_SCRIPTS,
} = require('./bundleFiles');
const buildDir = path.resolve(__dirname, 'build');
const config = require('../server/config/config-env');
const pluginClient = require('../server/src/pluginClient');
const MCK_CONTEXT_PATH = config.urls.hostUrl;
const MCK_STATIC_PATH = MCK_CONTEXT_PATH + '/plugin';
const PLUGIN_SETTING = config.pluginProperties;
const MCK_THIRD_PARTY_INTEGRATION = config.thirdPartyIntegration;
const CDN_HOST_URL = MCK_THIRD_PARTY_INTEGRATION.aws.cdnUrl;
const pluginVersions = ['v1', 'v2'];
PLUGIN_SETTING.kommunicateApiUrl =
    PLUGIN_SETTING.kommunicateApiUrl || config.urls.kommunicateBaseUrl;
PLUGIN_SETTING.botPlatformApi =
    PLUGIN_SETTING.botPlatformApi || config.urls.botPlatformApi;
PLUGIN_SETTING.applozicBaseUrl =
    PLUGIN_SETTING.applozicBaseUrl || config.urls.applozicBaseUrl;
PLUGIN_SETTING.dashboardUrl =
    PLUGIN_SETTING.dashboardUrl || config.urls.dashboardUrl;
let PLUGIN_FILE_DATA = new Object();
let isAwsUploadEnabled = argv.upload;
let BUILD_URL = isAwsUploadEnabled
    ? CDN_HOST_URL + '/' + version
    : MCK_STATIC_PATH + '/build';
// Change "env" to "false" to un-compress all files.
let env = config.getEnvId() !== 'development';
let jsCompressor = !env ? noCompress : gcc;
let terserCompressor = !env ? noCompress : terser;
let cssCompressor = !env ? noCompress : cleanCSS;
let pathToResource = !env ? BUILD_URL : MCK_CONTEXT_PATH + '/resources';
let resourceLocation = env
    ? path.resolve(__dirname, 'build/resources')
    : buildDir;

/**
 *
 * @param {string} dirPath optional
 * @returns null
 *
 * Removes existing files and subdirectories from build folder if it exists.
 * If build folder doesn't exists then it create a build folder.
 *
 */
const removeExistingFile = function (dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    } else {
        try {
            var files = fs.readdirSync(dirPath);
        } catch (e) {
            return;
        }
        files &&
            files.map((file) => {
                if (fs.statSync(dirPath + '/' + file).isFile()) {
                    fs.unlinkSync(dirPath + '/' + file);
                }
            });
    }
};

// Add already minified files only in the below compressor code.
const compressAndOptimize = () => {
    if (env) {
        // create resources folder
        // resources folder will contain the files generated with version
        if (!fs.existsSync(`${buildDir}/resources`)) {
            fs.mkdirSync(`${buildDir}/resources`);
        }

        // add third party scripts here
        if (!fs.existsSync(`${buildDir}/resources/third-party-scripts`)) {
            fs.mkdirSync(`${buildDir}/resources/third-party-scripts`);
        }
    }
    minify({
        compressor: jsCompressor,
        input: THIRD_PARTY_SCRIPTS,
        output: path.resolve(
            __dirname,
            `${buildDir}/kommunicateThirdParty.min.js`
        ),
        options: {
            compilationLevel: 'WHITESPACE_ONLY',
        },
        callback: function (err, min) {
            if (!err) {
                console.log(
                    `kommunicateThirdParty.min.js combined successfully`
                );
            } else {
                console.log(
                    `err while minifying kommunicateThirdParty.min.js`,
                    err
                );
            }
        },
    });

    // minify applozic css files into a single file
    minify({
        compressor: cssCompressor,
        input: PLUGIN_CSS_FILES,
        output: path.resolve(
            __dirname,
            `${resourceLocation}/kommunicate.${version}.min.css`
        ),
        options: {
            level: 1, // (default)
            compatibility: '*', // (default) - Internet Explorer 10+ compatibility mode
        },
        callback: function (err, min) {
            if (!err) {
                console.log(
                    `kommunicate.${version}.min.css combined successfully`
                );
            } else {
                console.log(
                    `err while minifying kommunicate.${version}.min.css`,
                    err
                );
            }
        },
    });

    minify({
        compressor: terserCompressor,
        input: PLUGIN_JS_FILES,
        options: {
            compress: {
                drop_console: true,
            },
        },
        output: path.resolve(
            __dirname,
            `${buildDir}/kommunicate-plugin.min.js`
        ),
        callback: function (err, min) {
            if (!err)
                console.log(`kommunicate-plugin.min.js combined successfully`);
            else {
                console.log(
                    `err while minifying kommunicate-plugin.min.js`,
                    err
                );
            }
        },
    });
};

const combineJsFiles = () => {
    var paths = PLUGIN_BUNDLE_FILES;
    minify({
        compressor: terserCompressor,
        input: paths,
        options: {
            compress: {
                drop_console: true,
                keep_fnames: true,
            },
            mangle: {
                keep_fnames: true,
            },
        },
        output: path.resolve(
            __dirname,
            `${resourceLocation}/kommunicate.${version}.min.js`
        ),
        callback: function (err, min) {
            if (!err) {
                console.log(`kommunicate.${version}.js combined successfully`);
                paths.forEach(async function (value) {
                    await deleteFilesUsingPath(value);
                });
                if (isAwsUploadEnabled) {
                    uploadFilesToCdn(buildDir, version);
                } else {
                    console.log('Files not uploaded to CDN');
                }
            } else {
                console.log(
                    `err while minifying kommunicate.${version}.js`,
                    err
                );
            }
        },
    });
};

const copyFileToBuild = (src, dest) => {
    fs.copyFile(path.join(__dirname, src), dest, (err) => {
        if (err) {
            console.log(`error while generating ${dest}`, err);
        }
        console.log(`${dest} generated successfully`);
    });
};
const generateBuildFiles = () => {
    if (env) {
        // Generate index.html for home route
        copyFileToBuild('template/index.html', `${buildDir}/index.html`);

        // config file for serve
        copyFileToBuild('template/serve.json', `${buildDir}/serve.json`);

        // third party script for location picker
        copyFileToBuild(
            'lib/js/locationpicker.jquery.min.js',
            `${resourceLocation}/third-party-scripts/locationpicker.jquery.min.js`
        );

        // third party script for emoticons
        copyFileToBuild(
            'lib/js/mck-emojis.min.js',
            `${resourceLocation}/third-party-scripts/mck-emojis.min.js`
        );
    }
    // Generate chat.html for /chat route
    // rewrite added in serve.json for local testing and on amplify
    copyFileToBuild('template/chat.html', `${buildDir}/chat.html`);

    // copy applozic.chat.{version}.min.js to build
    copyFileToBuild(
        'js/app/applozic.chat-6.2.4.min.js',
        `${buildDir}/applozic.chat-6.2.4.min.js`
    );

    // Generate mck-sidebox.html file for build folder.
    fs.copyFile(
        path.join(__dirname, 'template/mck-sidebox.html'),
        `${resourceLocation}/mck-sidebox.${version}.html`,
        (err) => {
            if (err) {
                console.log('error while generating mck-sidebox.html', err);
            }
            console.log('mck-sidebox.html generated successfully');
        }
    );

    // Generate plugin.js file for build folder.
    fs.readFile(
        path.join(__dirname, 'plugin.js'),
        'utf8',
        function (err, data) {
            if (err) {
                console.log('error while generating plugin.js', err);
            }
            var mckApp = data.replace(
                'KOMMUNICATE_MIN_JS',
                // dest is diff for dev and build
                `"${pathToResource}/kommunicate.${version}.min.js"`
            );

            fs.writeFile(`${buildDir}/plugin.js`, mckApp, function (err) {
                if (err) {
                    console.log('plugin.js generation error');
                }
                generateFilesByVersion('build/plugin.js');
            });
        }
    );
    // Generate mck-app.js file for build folder.
    fs.readFile(
        path.join(__dirname, 'js/app/mck-app.js'),
        'utf8',
        function (err, data) {
            if (err) {
                console.log('error while generating mck app', err);
            }
            var mckApp = data
                .replace(
                    'KOMMUNICATE_MIN_CSS',
                    `"${pathToResource}/kommunicate.${version}.min.css"`
                )
                .replace(
                    'MCK_SIDEBOX_HTML',
                    `"${pathToResource}/mck-sidebox.${version}.html"`
                );
            fs.writeFile(`${buildDir}/mck-app.js`, mckApp, function (err) {
                if (err) {
                    console.log('mck-file generation error');
                }
                combineJsFiles();
            });
        }
    );
};

const generateFilesByVersion = (location) => {
    fs.readFile(path.join(__dirname, location), 'utf8', function (err, data) {
        if (err) {
            console.log('error while generating plugin.js', err);
        }
        try {
            var plugin = data
                .replace(':MCK_CONTEXTPATH', MCK_CONTEXT_PATH)
                .replace(
                    ':MCK_THIRD_PARTY_INTEGRATION',
                    JSON.stringify(MCK_THIRD_PARTY_INTEGRATION)
                )
                .replace(':MCK_STATICPATH', MCK_STATIC_PATH)
                .replace(':PRODUCT_ID', 'kommunicate')
                .replace(':PLUGIN_SETTINGS', JSON.stringify(PLUGIN_SETTING));

            for (var i = 0; i < pluginVersions.length; i++) {
                var data = plugin.replace(
                    ':MCK_PLUGIN_VERSION',
                    pluginVersions[i]
                );
                if (env && pluginVersions[i] == 'v2') {
                    if (!fs.existsSync(`${buildDir}/v2`)) {
                        fs.mkdirSync(`${buildDir}/v2`);
                    }
                    fs.writeFile(
                        `${buildDir}/v2/kommunicate.app`,
                        data,
                        function (err) {
                            if (err) {
                                console.log('kommunicate.app generation error');
                            }
                            console.log('kommunicate.app generated');
                        }
                    );
                }
                PLUGIN_FILE_DATA[pluginVersions[i]] = data;
            }
            console.log('plugin files generated for all versions successfully');
        } catch (error) {
            console.log(error);
        }
    });
};

const deleteFilesUsingPath = (path) => {
    // Assuming that 'path/file.txt' is a regular file.
    try {
        fs.unlinkSync(path);
    } catch (error) {
        console.log(error);
    }
};

const uploadFilesToCdn = async (buildDir, version) => {
    try {
        await pluginClient.upload(buildDir, version);
        console.log('Uploaded all files to CDN');
    } catch (error) {
        console.log(
            'The server has stopped due to some error, please check server logs for better understanding.',
            error
        );
        process.kill(process.pid);
    }
};

removeExistingFile(buildDir);
compressAndOptimize();
generateBuildFiles();

exports.pluginVersion = version;
exports.pluginVersionData = PLUGIN_FILE_DATA;
