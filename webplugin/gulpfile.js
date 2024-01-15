const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cleanCss = require('gulp-clean-css');
const path = require('path');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const version = require('child_process')
    .execSync('git rev-parse --short HEAD', {
        cwd: __dirname,
    })
    .toString()
    .trim();
const buildDir = path.resolve(__dirname, 'build');
const config = require('../server/config/config-env');
const pluginClient = require('../server/src/pluginClient');
const TERSER_CONFIG = require('./terser.config');
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

let env = config.getEnvId() !== 'development';

let pathToResource = !env ? BUILD_URL : MCK_CONTEXT_PATH + '/resources';
let resourceLocation = env
    ? path.resolve(__dirname, 'build/resources')
    : buildDir;

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

const generateResourceFolder = () => {
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
};

const generateThirdPartyJSFiles = () => {
    return gulp
        .src([
            path.resolve(__dirname, 'lib/js/mck-ui-widget.min.js'),
            path.resolve(__dirname, 'lib/js/howler-2.1.2.min.js'),
            path.resolve(__dirname, 'lib/js/tiny-slider-2.9.2.js'),
            path.resolve(__dirname, 'lib/js/mustache.js'),
            path.resolve(__dirname, 'lib/js/sentry-error-tracker.js'),
            path.resolve(__dirname, 'lib/js/intl-tel-lib.js'),
        ])
        .pipe(concat(`kommunicateThirdParty.min.js`))
        .pipe(terser(TERSER_CONFIG))
        .pipe(gulp.dest(`${buildDir}`))
        .on('end', () => {
            console.log(`kommunicateThirdParty.min.js combined successfully`);
        });
};

const generateCSSFiles = () => {
    return gulp
        .src([
            path.resolve(__dirname, 'lib/css/mck-combined.min.css'),
            path.resolve(__dirname, 'css/app/mck-sidebox-1.0.css'),
            path.resolve(__dirname, 'css/app/km-voice-note.css'),
            path.resolve(__dirname, 'css/app/km-rich-message.css'),
            // path.resolve(__dirname, 'css/app/km-login-model.css'),
            path.resolve(__dirname, 'lib/css/tiny-slider-2.9.2.css'),
            path.resolve(__dirname, 'css/app/km-sidebox.css'),
            path.resolve(__dirname, 'lib/css/intl-tel-lib.css'),
            path.resolve(__dirname, 'css/app/style/style.css'),
        ])
        .pipe(
            cleanCss({
                advanced: true, // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
                aggressiveMerging: true, // set to false to disable aggressive merging of properties.
                compatibility: 'ie9', // To add vendor prefixes for IE8+
            })
        ) // Minify and optimize CSS
        .pipe(concat(`kommunicate.${version}.min.css`))
        .pipe(gulp.dest(resourceLocation))
        .on('end', () => {
            console.log(`kommunicate.${version}.min.css combined successfully`);
        });
};

const generatePluginJSFiles = () => {
    return gulp
        .src([
            path.resolve(__dirname, 'lib/js/Fr.voice.js'),
            path.resolve(__dirname, 'lib/js/recorder.js'),
            path.resolve(__dirname, 'lib/js/jquery.linkify.js'),
            path.resolve(__dirname, 'js/app/km-utils.js'),
            path.resolve(__dirname, 'js/app/applozic.jquery.js'),
            path.resolve(__dirname, 'knowledgebase/common.js'),
            path.resolve(__dirname, 'knowledgebase/kb.js'),
            path.resolve(__dirname, 'js/app/labels/default-labels.js'),
            path.resolve(__dirname, 'js/app/kommunicate-client.js'),
            path.resolve(
                __dirname,
                'js/app/conversation/km-conversation-helper.js'
            ),
            path.resolve(
                __dirname,
                'js/app/conversation/km-conversation-service.js'
            ),
            path.resolve(__dirname, 'js/app/kommunicate.js'),
            path.resolve(__dirname, 'js/app/km-richtext-markup-1.0.js'),
            path.resolve(__dirname, 'js/app/km-message-markup-1.0.js'),
            path.resolve(__dirname, 'js/app/km-event-listner.js'),
            path.resolve(__dirname, 'js/app/km-widget-custom-events.js'),
            path.resolve(__dirname, 'js/app/km-attachment-service.js'),
            path.resolve(__dirname, 'js/app/zendesk-chat-service.js'),
            path.resolve(__dirname, 'js/app/km-nav-bar.js'),
            path.resolve(__dirname, 'js/app/mck-sidebox-1.0.js'),
            path.resolve(__dirname, 'js/app/kommunicate.custom.theme.js'),
            path.resolve(__dirname, 'js/app/kommunicateCommons.js'),
            path.resolve(__dirname, 'js/app/km-rich-text-event-handler.js'),
            path.resolve(__dirname, 'js/app/kommunicate-ui.js'),
            path.resolve(__dirname, 'js/app/events/applozic-event-handler.js'),
            path.resolve(__dirname, 'js/app/km-post-initialization.js'),
            path.resolve(__dirname, 'js/app/mck-ringtone-service.js'),
            path.resolve(__dirname, 'js/app/media/typing-area-dom-service.js'),
            path.resolve(__dirname, 'js/app/media/media-service.js'),
            path.resolve(__dirname, 'js/app/media/media-dom-event-listener.js'),
        ])
        .pipe(babel()) // Run Babel
        .pipe(concat(`kommunicate-plugin.min.js`))
        .pipe(terser(TERSER_CONFIG))
        .pipe(gulp.dest(`${buildDir}`)) // Destination directory
        .on('end', () => {
            console.log(`kommunicate-plugin.min.js combined successfully`);
        });
};

const combineJsFiles = async () => {
    var paths = [
        path.resolve(__dirname, `${buildDir}/mck-app.js`),
        path.resolve(__dirname, `${buildDir}/kommunicateThirdParty.min.js`),
        path.resolve(__dirname, `${buildDir}/kommunicate-plugin.min.js`),
    ];
    await new Promise((resolve) => {
        gulp.src(paths)
            .pipe(concat(`kommunicate.${version}.min.js`))
            .pipe(terser(TERSER_CONFIG))
            .pipe(gulp.dest(resourceLocation))
            .on('end', () => {
                console.log(`kommunicate.${version}.js combined successfully`);
                paths.forEach((value) => {
                    deleteFilesUsingPath(value);
                });

                if (isAwsUploadEnabled) {
                    uploadFilesToCdn(buildDir, version);
                } else {
                    console.log('Files not uploaded to CDN');
                }

                resolve();
            });
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
            // console.log(data, err);
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
            fs.writeFile(
                `${buildDir}/mck-app.js`,
                mckApp,
                function (err, data) {
                    if (err) {
                        console.log('mck-file generation error');
                    }
                    combineJsFiles();
                }
            );
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
const copyFileToBuild = (src, dest) => {
    // console.log(`Copying file from ${src} to ${dest}`);
    fs.copyFile(path.join(__dirname, src), dest, (err) => {
        if (err) {
            console.log(`error while generating ${dest}`, err);
        }
        console.log(`${dest} generated successfully`);
    });
};

gulp.task('removeExistingFile', function (done) {
    removeExistingFile(buildDir);
    done && done();
});

gulp.task('generateResourceFolder', function (done) {
    generateResourceFolder();
    done();
});
gulp.task('generateThirdPartyJSFiles', generateThirdPartyJSFiles);
gulp.task('generateCSSFiles', generateCSSFiles);
gulp.task('generatePluginJSFiles', generatePluginJSFiles);
gulp.task('generateBuildFiles', function (done) {
    generateBuildFiles();
    done();
});

gulp.task(
    'default',
    gulp.series(
        'removeExistingFile',
        'generateResourceFolder',
        'generateThirdPartyJSFiles',
        'generateCSSFiles',
        'generatePluginJSFiles',
        'generateBuildFiles'
    )
);

exports.pluginVersion = version;
exports.pluginVersionData = PLUGIN_FILE_DATA;
