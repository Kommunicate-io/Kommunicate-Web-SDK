const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cleanCss = require('gulp-clean-css');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass')(require('sass'));
const htmlmin = require('gulp-htmlmin');
const path = require('path');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const stripComments = require('gulp-strip-comments');

const fs = require('fs');
const {
    PLUGIN_CSS_FILES,
    PLUGIN_BUNDLE_FILES,
    PLUGIN_JS_FILES,
    THIRD_PARTY_SCRIPTS,
    version,
    THIRD_PARTY_FILE_INFO,
} = require('./bundleFiles');
const buildDir = path.resolve(__dirname, 'build');
const config = require('../server/config/config-env');
const TERSER_CONFIG = require('./terser.config');

const MCK_CONTEXT_PATH = config.urls.hostUrl;
const MCK_STATIC_PATH = MCK_CONTEXT_PATH + '/plugin';
const PLUGIN_SETTING = config.pluginProperties;
const MCK_THIRD_PARTY_INTEGRATION = config.thirdPartyIntegration;
const pluginVersions = ['v1', 'v2'];

PLUGIN_SETTING.kommunicateApiUrl =
    PLUGIN_SETTING.kommunicateApiUrl || config.urls.kommunicateBaseUrl;
PLUGIN_SETTING.botPlatformApi =
    PLUGIN_SETTING.botPlatformApi || config.urls.botPlatformApi;
PLUGIN_SETTING.applozicBaseUrl =
    PLUGIN_SETTING.applozicBaseUrl || config.urls.applozicBaseUrl;
PLUGIN_SETTING.dashboardUrl =
    PLUGIN_SETTING.dashboardUrl || config.urls.dashboardUrl;

const BUILD_URL = MCK_STATIC_PATH + '/build';

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
        .src(THIRD_PARTY_SCRIPTS)
        .pipe(concat(`kommunicateThirdParty.min.js`))
        .pipe(terser(TERSER_CONFIG))
        .pipe(gulp.dest(`${buildDir}`))
        .on('end', () => {
            console.log(`kommunicateThirdParty.min.js combined successfully`);
        });
};

const generateCSSFiles = () => {
    return gulp
        .src(PLUGIN_CSS_FILES)
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
        .src(PLUGIN_JS_FILES)
        .pipe(babel()) // Run Babel
        .pipe(concat(`kommunicate-plugin.min.js`))
        .pipe(terser(TERSER_CONFIG))
        .pipe(gulp.dest(`${buildDir}`)) // Destination directory
        .on('end', () => {
            console.log(`kommunicate-plugin.min.js combined successfully`);
        });
};

const combineJsFiles = async () => {
    var paths = PLUGIN_BUNDLE_FILES;

    gulp.src(paths)
        .pipe(concat(`kommunicate.${version}.min.js`))
        .pipe(terser(TERSER_CONFIG))
        .pipe(gulp.dest(resourceLocation))
        .on('end', () => {
            console.log(`kommunicate.${version}.js combined successfully`);
            paths.forEach((value) => {
                deleteFilesUsingPath(value);
            });
        });
};

const minifyHtml = (paths, outputDir, fileName) => {
    gulp.src(paths)
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .on('error', console.error)
        .pipe(concat(fileName))
        .pipe(gulp.dest(outputDir))
        .on('end', () => {
            console.log(`${fileName} generated successfully`);
        });
};

const minifyJS = (path, dir, fileName, shouldMinify) => {
    gulp.src(path)
        .pipe(stripComments())
        .pipe(gulpif(shouldMinify, babel()))
        .pipe(gulpif(shouldMinify, terser(TERSER_CONFIG)))
        .pipe(rename(fileName))
        .pipe(gulp.dest(`${dir}`)) // Destination directory
        .on('end', () => {
            console.log(`${fileName} generated successfully`);
        });
};

const minifyCss = (path, dir, fileName) => {
    gulp.src(path)
        .pipe(
            cleanCss({
                advanced: true, // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
                aggressiveMerging: true, // set to false to disable aggressive merging of properties.
                compatibility: 'ie9', // To add vendor prefixes for IE8+
            })
        ) // Minify and optimize CSS
        .pipe(rename(fileName))
        .pipe(gulp.dest(dir))
        .on('end', () => {
            console.log(`${fileName} combined successfully`);
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

        THIRD_PARTY_FILE_INFO.forEach((file) => {
            const des = `${resourceLocation}/third-party-scripts`;

            if (file.type === 'js') {
                minifyJS(
                    [file.source],
                    des,
                    file.outputName,
                    file.shouldMinify
                );
            } else if (file.type === 'css') {
                minifyCss([file.source], des, file.outputName);
            }
        });
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
    minifyHtml(
        [path.join(__dirname, 'template/mck-sidebox.html')],
        resourceLocation,
        `mck-sidebox.${version}.html`
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

const getThirdPartyScripts = () => {
    return JSON.stringify({
        zendesk: {
            js: `${pathToResource}/third-party-scripts/zendesk-chat-service-${version}.min.js`,
        },
        intlForPreChat: {
            js: `${pathToResource}/third-party-scripts/intl-tel-lib.min.js`,
            css: `${pathToResource}/third-party-scripts/intl-tel-lib-${version}.min.css`,
        },
        frVoice: {
            js: `${pathToResource}/third-party-scripts/fr-voice.min.js`,
        },
        recorder: {
            js: `${pathToResource}/third-party-scripts/recorder.min.js`,
        },
        crypto: {
            js: `${pathToResource}/third-party-scripts/crypto.min.js`,
        },
    });
};

const generateFilesByVersion = (location) => {
    fs.readFile(path.join(__dirname, location), 'utf8', function (err, data) {
        if (err) {
            console.log('error while generating plugin.js', err);
        }

        const thirdPartyScripts = getThirdPartyScripts();

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
                .replace(':THIRD_PARTY_SCRIPTS', thirdPartyScripts);

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
gulp.task('sass', function () {
    return gulp
        .src('./scss/style.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('./css/app/style'))
        .on('end', () => {
            console.log('compiled scss to css');
        });
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
        'sass',
        'removeExistingFile',
        'generateResourceFolder',
        'generateThirdPartyJSFiles',
        'generateCSSFiles',
        'generatePluginJSFiles',
        'generateBuildFiles'
    )
);
