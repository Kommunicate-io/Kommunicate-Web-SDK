const minify = require('@node-minify/core');
const noCompress = require('@node-minify/no-compress');
const terser = require('terser');
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
const releaseDir = path.resolve(__dirname, 'build', String(version));
const releaseResourcesDir = path.join(releaseDir, 'resources');
const releaseThirdPartyDir = path.join(releaseResourcesDir, 'third-party-scripts');
const legacyResourcesDir = path.join(buildDir, 'resources');
const legacyThirdPartyDir = path.join(legacyResourcesDir, 'third-party-scripts');
const config = require('../server/config/config-env');
const TERSER_CONFIG = require('./terser.config');
const MCK_CONTEXT_PATH = config.urls.hostUrl;
const MCK_STATIC_PATH = MCK_CONTEXT_PATH + '/plugin';
const PLUGIN_SETTING = config.pluginProperties;
const MCK_THIRD_PARTY_INTEGRATION = config.thirdPartyIntegration;

const pluginVersions = ['v1', 'v2', 'v3'];

Object.assign(PLUGIN_SETTING, {
    kommunicateApiUrl: PLUGIN_SETTING.kommunicateApiUrl || config.urls.kommunicateBaseUrl,
    botPlatformApi: PLUGIN_SETTING.botPlatformApi || config.urls.botPlatformApi,
    applozicBaseUrl: PLUGIN_SETTING.applozicBaseUrl || config.urls.applozicBaseUrl,
    dashboardUrl: PLUGIN_SETTING.dashboardUrl || config.urls.dashboardUrl,
});

let PLUGIN_FILE_DATA = new Object();
let BUILD_URL = MCK_STATIC_PATH + '/build';

let pathToResource = `${BUILD_URL}/${version}/resources`;
let resourceLocation = releaseResourcesDir;

const minifyPluginContent = (code) => {
    try {
        const result = terser.minify(code, TERSER_CONFIG);
        if (result.error) {
            console.log('plugin minification error', result.error);
            return code;
        }
        return result.code;
    } catch (err) {
        console.log('plugin minification error', err);
        return code;
    }
};

/**
 *
 * @param {string} dirPath optional
 * @returns null
 *
 * Removes existing files and subdirectories from build folder if it exists.
 * If build folder doesn't exists then it create a build folder.
 *
 */
const removeDirectoryRecursive = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        return;
    }
    fs.readdirSync(dirPath).forEach((entry) => {
        const entryPath = path.join(dirPath, entry);
        if (fs.lstatSync(entryPath).isDirectory()) {
            removeDirectoryRecursive(entryPath);
            fs.rmdirSync(entryPath);
        } else {
            fs.unlinkSync(entryPath);
        }
    });
};

const removeExistingFile = function (dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        return;
    }

    removeDirectoryRecursive(dirPath);
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

const copyIndexWithBranch = (src, dest, branchValue, envValue) => {
    try {
        const templatePath = path.join(__dirname, src);
        const content = fs.readFileSync(templatePath, 'utf8');
        const resolvedBranch = branchValue || 'unknown-branch';
        const resolvedEnv = envValue || 'development';
        const replaced = content
            .replace(/__KM_BRANCH__/g, resolvedBranch)
            .replace(/__KM_ENV__/g, resolvedEnv);
        fs.writeFileSync(dest, replaced);
        console.log(
            `${dest} generated successfully with branch ${resolvedBranch} and env ${resolvedEnv}`
        );
    } catch (err) {
        console.log(`error while generating ${dest}`, err);
    }
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

const copyDirectoryRecursive = (sourceDir, destinationDir) => {
    if (!fs.existsSync(sourceDir)) {
        console.log(`Source directory ${sourceDir} does not exist`);
        return;
    }
    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true });
    }
    fs.readdirSync(sourceDir).forEach((entry) => {
        const srcPath = path.join(sourceDir, entry);
        const destPath = path.join(destinationDir, entry);
        if (fs.lstatSync(srcPath).isDirectory()) {
            copyDirectoryRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
    console.log(`${destinationDir} directory generated successfully`);
};
const generateBuildFiles = () => {
    const buildEnvValue = process.env._BUILD_ENV || process.env.NODE_ENV || 'development';
    copyIndexWithBranch(
        'template/index.html',
        `${buildDir}/index.html`,
        KM_RELEASE_BRANCH,
        buildEnvValue
    );

    copyFileToBuild('template/serve.json', `${buildDir}/serve.json`);

    copyFileToBuild('../robots.txt', `${buildDir}/robots.txt`);

    // Generate chat.html for /chat route
    // rewrite added in serve.json for local testing and on amplify
    copyFileToBuild('template/chat.html', `${buildDir}/chat.html`);

    copyFileToBuild('../example/demo2.html', `${buildDir}/demo2.html`);

    // legacy path for emoticon script redirect
    copyFileToBuild('lib/js/mck-emojis.min.js', `${legacyThirdPartyDir}/mck-emojis.min.js`);

    // copy applozic.chat.{version}.min.js to build
    copyFileToBuild('js/app/applozic.chat-6.2.8.min.js', `${buildDir}/applozic.chat-6.2.8.min.js`);

    THIRD_PARTY_FILE_INFO.forEach((fileData) => {
        if (Array.isArray(fileData.source)) {
            generateFiles({
                fileName: fileData.outputName,
                source: fileData.source,
                output: `${releaseThirdPartyDir}/${fileData.outputName}`,
            });
            return;
        }
        copyFileToBuild(fileData.source, `${releaseThirdPartyDir}/${fileData.outputName}`, true);
    });

    // Generate mck-sidebox.html file for build folder.
    fs.readFile(path.join(__dirname, 'template/mck-sidebox.html'), 'utf8', (err, data) => {
        if (err) {
            console.log('error while generating mck-sidebox.html', err);
            return;
        }
        fs.writeFile(`${resourceLocation}/mck-sidebox.${version}.html`, data, (err) => {
            if (err) {
                console.log('error while generating mck-sidebox.html', err);
                return;
            }
            console.log(`mck-sidebox.html generated successfully (v${version})`);
        });
    });

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
            const minifiedPlugin = minifyPluginContent(mckApp);
            fs.writeFileSync(path.join(buildDir, 'plugin.min.js'), minifiedPlugin);
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

    // copy fonts required by the compiled CSS
    copyDirectoryRecursive(
        path.join(__dirname, 'css/app/fonts'),
        path.join(releaseDir, 'css/app/fonts')
    );
    copyDirectoryRecursive(
        path.join(__dirname, 'css/app/fonts'),
        path.join(buildDir, 'css/app/fonts')
    );

    // copy img folder for local build
    copyDirectoryRecursive(path.join(__dirname, 'img'), path.join(releaseResourcesDir, 'img'));
};

const generateFilesByVersion = (location) => {
    fs.readFile(path.join(__dirname, location), 'utf8', function (err, data) {
        if (err) {
            console.log('error while generating plugin.js', err);
        }

        const thirdPartyScripts = getDynamicLoadFiles(`${pathToResource}/third-party-scripts`);

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
                        PRODUCT: process.env.PRODUCT || 'kommunicate',
                    })
                );

            for (var i = 0; i < pluginVersions.length; i++) {
                var data = plugin.replace(':MCK_PLUGIN_VERSION', pluginVersions[i]);

                const minifiedData = minifyPluginContent(data);
                PLUGIN_FILE_DATA[pluginVersions[i]] = minifiedData;

                const versionDir = path.join(buildDir, pluginVersions[i]);
                if (!fs.existsSync(versionDir)) {
                    fs.mkdirSync(versionDir, { recursive: true });
                }
                fs.writeFileSync(path.join(versionDir, 'kommunicate.app'), minifiedData);
                if (pluginVersions[i] === 'v1') {
                    fs.writeFileSync(path.join(buildDir, 'kommunicate.app'), minifiedData);
                }
                if (pluginVersions[i] === 'v3') {
                    fs.writeFileSync(
                        path.join(buildDir, 'kommunicate-widget-3.0.min.js'),
                        minifiedData
                    );
                }
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
if (!fs.existsSync(releaseResourcesDir)) {
    fs.mkdirSync(releaseResourcesDir, { recursive: true });
}
if (!fs.existsSync(releaseThirdPartyDir)) {
    fs.mkdirSync(releaseThirdPartyDir, { recursive: true });
}
if (!fs.existsSync(legacyThirdPartyDir)) {
    fs.mkdirSync(legacyThirdPartyDir, { recursive: true });
}
generateMinFiles();
generateBuildFiles();

exports.pluginVersion = version;
exports.pluginVersionData = PLUGIN_FILE_DATA;
