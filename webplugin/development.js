const minify = require('@node-minify/core');
const noCompress = require('@node-minify/no-compress');
const path = require('path');
const fs = require('fs');

const {
    PLUGIN_CSS_FILES,
    PLUGIN_BUNDLE_FILES,
    PLUGIN_JS_FILES,
    THIRD_PARTY_SCRIPTS,
    version,
    THIRD_PARTY_FILE_INFO,
    getDynamicLoadFiles,
    KM_RELEASE_BRANCH,
} = require('./bundleFiles');
const buildDir = path.resolve(__dirname, 'build');
const config = require('../server/config/config-env');
const MCK_CONTEXT_PATH = config.urls.hostUrl;
const MCK_STATIC_PATH = MCK_CONTEXT_PATH + '/plugin';
const PLUGIN_SETTING = config.pluginProperties;
const MCK_THIRD_PARTY_INTEGRATION = config.thirdPartyIntegration;

const pluginVersions = ['v1', 'v2'];

Object.assign(PLUGIN_SETTING, {
    kommunicateApiUrl: PLUGIN_SETTING.kommunicateApiUrl || config.urls.kommunicateBaseUrl,
    botPlatformApi: PLUGIN_SETTING.botPlatformApi || config.urls.botPlatformApi,
    applozicBaseUrl: PLUGIN_SETTING.applozicBaseUrl || config.urls.applozicBaseUrl,
    dashboardUrl: PLUGIN_SETTING.dashboardUrl || config.urls.dashboardUrl,
});

let PLUGIN_FILE_DATA = new Object();
let BUILD_URL = MCK_STATIC_PATH + '/build';

let pathToResource = BUILD_URL;
let resourceLocation = buildDir;

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

const generateFiles = ({ fileName, source, output }) => {
    return new Promise((resolve, reject) => {
        minify({
            compressor: noCompress,
            input: source,
            output: output,
            callback: function (err, min) {
                if (!err) {
                    console.log(`${fileName}combined successfully`);
                    resolve('success');
                } else {
                    console.log(`err while minifying ${fileName}`, err);
                    reject('failed');
                }
            },
        });
    });
};

// Add already minified files only in the below compressor code.
const generateMinFiles = () => {
    const FILES_INFO = {
        'kommunicateThirdParty.min.js': {
            source: THIRD_PARTY_SCRIPTS,
            output: path.resolve(__dirname, `${buildDir}/kommunicateThirdParty.min.js`),
        },
        [`kommunicate.${version}.min.css`]: {
            source: PLUGIN_CSS_FILES,
            output: path.resolve(__dirname, `${resourceLocation}/kommunicate.${version}.min.css`),
        },
        'kommunicate-plugin.min.js': {
            source: PLUGIN_JS_FILES,
            output: path.resolve(__dirname, `${buildDir}/kommunicate-plugin.min.js`),
        },
    };

    Object.keys(FILES_INFO).forEach((file) => {
        generateFiles({ fileName: file, ...FILES_INFO[file] });
    });
};

const combineJsFiles = async () => {
    var paths = PLUGIN_BUNDLE_FILES;

    const resp = await generateFiles({
        fileName: `kommunicate.${version}.min.js`,
        source: paths,
        output: path.resolve(__dirname, `${resourceLocation}/kommunicate.${version}.min.js`),
    });

    if (resp !== 'failed') {
        paths.forEach(function (value) {
            deleteFilesUsingPath(value);
        });
    }
};

const copyFileToBuild = (src, dest, isFullPathExist) => {
    fs.copyFile(isFullPathExist ? src : path.join(__dirname, src), dest, (err) => {
        if (err) {
            console.log(`error while generating ${dest}`, err);
        }
        console.log(`${dest} generated successfully`);
    });
};
const generateBuildFiles = () => {
    // Generate chat.html for /chat route
    // rewrite added in serve.json for local testing and on amplify
    copyFileToBuild('template/chat.html', `${buildDir}/chat.html`);

    // copy applozic.chat.{version}.min.js to build
    copyFileToBuild('js/app/applozic.chat-6.2.8.min.js', `${buildDir}/applozic.chat-6.2.8.min.js`);

    THIRD_PARTY_FILE_INFO.forEach((fileData) => {
        if (Array.isArray(fileData.source)) {
            generateFiles({
                fileName: fileData.outputName,
                source: fileData.source,
                output: `${resourceLocation}/${fileData.outputName}`,
            });
            return;
        }
        copyFileToBuild(fileData.source, `${buildDir}/${fileData.outputName}`, true);
    });

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
    fs.readFile(path.join(__dirname, 'plugin.js'), 'utf8', function (err, data) {
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
    });
    // Generate mck-app.js file for build folder.
    fs.readFile(path.join(__dirname, 'js/app/mck-app.js'), 'utf8', function (err, data) {
        if (err) {
            console.log('error while generating mck app', err);
        }
        var mckApp = data
            .replace('KOMMUNICATE_MIN_CSS', `"${pathToResource}/kommunicate.${version}.min.css"`)
            .replace('MCK_SIDEBOX_HTML', `"${pathToResource}/mck-sidebox.${version}.html"`);
        fs.writeFile(`${buildDir}/mck-app.js`, mckApp, function (err) {
            if (err) {
                console.log('mck-file generation error');
            }
            const oldPath = `${buildDir}/mck-app.js`;
            const newPath = `${buildDir}/mck-app.min.js`;
            fs.rename(oldPath, newPath, function (renameErr) {
                if (renameErr) {
                    console.log('Error renaming mck-file');
                } else {
                    console.log('File renamed successfully');
                    combineJsFiles();
                }
            });
        });
    });
};

const generateFilesByVersion = (location) => {
    fs.readFile(path.join(__dirname, location), 'utf8', function (err, data) {
        if (err) {
            console.log('error while generating plugin.js', err);
        }

        const thirdPartyScripts = getDynamicLoadFiles(pathToResource);

        try {
            var plugin = data
                .replace(':MCK_CONTEXTPATH', MCK_CONTEXT_PATH)
                .replace(
                    ':MCK_THIRD_PARTY_INTEGRATION',
                    JSON.stringify(MCK_THIRD_PARTY_INTEGRATION)
                )
                .replace(':MCK_STATICPATH', MCK_STATIC_PATH)
                .replace(':PRODUCT_ID', 'kommunicate')
                .replace(':PLUGIN_SETTINGS', JSON.stringify(PLUGIN_SETTING))
                .replace(':KM_RELEASE_HASH', version)
                .replace(':THIRD_PARTY_SCRIPTS', thirdPartyScripts)
                .replace(
                    ':MCK_ENV_DETAILS',
                    JSON.stringify({
                        BRANCH: KM_RELEASE_BRANCH,
                        ENVIRONMENT: process.env.NODE_ENV || 'development',
                    })
                );

            for (var i = 0; i < pluginVersions.length; i++) {
                var data = plugin.replace(':MCK_PLUGIN_VERSION', pluginVersions[i]);

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

removeExistingFile(buildDir);
generateMinFiles();
generateBuildFiles();

exports.pluginVersion = version;
exports.pluginVersionData = PLUGIN_FILE_DATA;
