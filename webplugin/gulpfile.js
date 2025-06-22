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
const sourcemaps = require('gulp-sourcemaps');
const SentryCli = require('@sentry/cli');
const clean = require('gulp-clean');
const tap = require('gulp-tap');
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
const TERSER_CONFIG = require('./terser.config');

const MCK_CONTEXT_PATH = config.urls.hostUrl;
const MCK_STATIC_PATH = MCK_CONTEXT_PATH + '/plugin';
const PLUGIN_SETTING = config.pluginProperties;
const MCK_THIRD_PARTY_INTEGRATION = config.thirdPartyIntegration;
const pluginVersions = ['v1', 'v2'];

PLUGIN_SETTING.kommunicateApiUrl =
    PLUGIN_SETTING.kommunicateApiUrl || config.urls.kommunicateBaseUrl;
PLUGIN_SETTING.botPlatformApi = PLUGIN_SETTING.botPlatformApi || config.urls.botPlatformApi;
PLUGIN_SETTING.applozicBaseUrl = PLUGIN_SETTING.applozicBaseUrl || config.urls.applozicBaseUrl;
PLUGIN_SETTING.dashboardUrl = PLUGIN_SETTING.dashboardUrl || config.urls.dashboardUrl;

const BUILD_URL = MCK_STATIC_PATH + '/build';

let env = config.getEnvId() !== 'development';
const SENTRY_ENABLED = MCK_THIRD_PARTY_INTEGRATION.sentry.enabled;

const cli = new SentryCli(null, {
    authToken: MCK_THIRD_PARTY_INTEGRATION.sentry.AUTH_TOKEN,
    org: MCK_THIRD_PARTY_INTEGRATION.sentry.ORG,
    project: MCK_THIRD_PARTY_INTEGRATION.sentry.PROJECT,
    sourcemaps: {
        rewrite: true,
        ignore_file: ['node_modules'],
    },
});

let pathToResource = !env ? BUILD_URL : MCK_CONTEXT_PATH + '/resources';
let resourceLocation = env ? path.resolve(__dirname, 'build/resources') : buildDir;

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
    console.log('sentry.enabled: ' + MCK_THIRD_PARTY_INTEGRATION.sentry.enabled);

    let inputScripts = THIRD_PARTY_SCRIPTS;

    return gulp
        .src(inputScripts)
        .pipe(concat(`kommunicateThirdParty.min.js`))
        .pipe(terser(TERSER_CONFIG))
        .pipe(gulp.dest(`${buildDir}`))
        .on('end', () => {
            console.log(`kommunicateThirdParty.min.js combined successfully`);
        });
};

const generateCSSFiles = () => {
    return (
        gulp
            .src(PLUGIN_CSS_FILES)
            // .pipe(sourcemaps.init())
            .pipe(
                cleanCss({
                    advanced: true, // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
                    aggressiveMerging: true, // set to false to disable aggressive merging of properties.
                    compatibility: 'ie9', // To add vendor prefixes for IE8+
                })
            ) // Minify and optimize CSS
            .pipe(concat(`kommunicate.${version}.min.css`))
            // .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(resourceLocation))
            .on('end', () => {
                console.log(`kommunicate.${version}.min.css combined successfully`);
            })
    );
};

const generatePluginJSFiles = () => {
    const RELATIVE_PATHS = [];
    return gulp
        .src(PLUGIN_JS_FILES)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(
            tap(function (file) {
                const relativePath = file.path.replace(process.cwd() + path.sep, '');

                RELATIVE_PATHS.push(relativePath);
            })
        )
        .pipe(babel()) // Run Babel
        .pipe(concat(`kommunicate-plugin.min.js`))
        .pipe(terser(TERSER_CONFIG))
        .pipe(
            sourcemaps.write('./', {
                sourceRoot: '',
                includeContent: true,
                debug: true,
                sourceMappingURLPrefix: '.',
                mapFile: function (mapFilePath) {
                    return mapFilePath.replace('.js.map', '.map');
                },
            })
        )

        .pipe(gulp.dest(`${buildDir}`)) // Destination directory
        .on('end', () => {
            console.log(`kommunicate-plugin.min.js combined successfully`);
        });
};

const combineJsFiles = async () => {
    var paths = PLUGIN_BUNDLE_FILES;

    gulp.src(paths)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat(`kommunicate.${version}.min.js`))
        .pipe(
            sourcemaps.write('./', {
                sourceRoot: '',
                includeContent: true,
                debug: true,
                sourceMappingURLPrefix: '.',
                mapFile: function (mapFilePath) {
                    return mapFilePath.replace('.js.map', '.map');
                },
            })
        )
        .pipe(gulp.dest(resourceLocation))
        .on('end', () => {
            console.log(`kommunicate.${version}.js combined successfully`);
            paths.forEach((value) => {
                deleteFilesUsingPath(value);
            });
            deleteFilesUsingPath(`${buildDir}/mck-app.js`);
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

const minifyJS = (path, dir, fileName, shouldMinify, callback) => {
    console.log(path, dir);
    return gulp
        .src(path)
        .pipe(stripComments())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(gulpif(shouldMinify, babel()))
        .pipe(gulpif(shouldMinify, terser(TERSER_CONFIG)))
        .pipe(concat(fileName))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${dir}`)) // Destination directory
        .on('end', () => {
            console.log(`${fileName} generated successfully`);
            callback && callback();
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

        // generate robots.txt for build dir
        copyFileToBuild('../robots.txt', `${buildDir}/robots.txt`);

        THIRD_PARTY_FILE_INFO.forEach((file) => {
            const des = `${resourceLocation}/third-party-scripts`;

            if (file.type === 'js') {
                const source = Array.isArray(file.source) ? file.source : [file.source];
                minifyJS(source, des, file.outputName, file.shouldMinify);
            } else if (file.type === 'css') {
                minifyCss([file.source], des, file.outputName);
            }
        });
    }
    // Generate chat.html for /chat route
    // rewrite added in serve.json for local testing and on amplify
    copyFileToBuild('template/chat.html', `${buildDir}/chat.html`);

    // copy applozic.chat.{version}.min.js to build
    copyFileToBuild('js/app/applozic.chat-6.2.8.min.js', `${buildDir}/applozic.chat-6.2.8.min.js`);

    // Generate mck-sidebox.html file for build folder.
    minifyHtml(
        [path.join(__dirname, 'template/mck-sidebox.html')],
        resourceLocation,
        `mck-sidebox.${version}.html`
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
        // console.log(data, err);
        if (err) {
            console.log('error while generating mck app', err);
        }
        var mckApp = data
            .replace('KOMMUNICATE_MIN_CSS', `"${pathToResource}/kommunicate.${version}.min.css"`)
            .replace('MCK_SIDEBOX_HTML', `"${pathToResource}/mck-sidebox.${version}.html"`);
        fs.writeFile(`${buildDir}/mck-app.js`, mckApp, function (err, data) {
            if (err) {
                console.log('mck-file generation error');
            }
            minifyJS(`${buildDir}/mck-app.js`, buildDir, `mck-app.min.js`, true, combineJsFiles);
            // combineJsFiles();
        });
    });
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
                        ENVIRONMENT: process.env.NODE_ENV,
                    })
                );

            for (var i = 0; i < pluginVersions.length; i++) {
                var data = plugin.replace(':MCK_PLUGIN_VERSION', pluginVersions[i]);
                if (env && pluginVersions[i] == 'v2') {
                    if (!fs.existsSync(`${buildDir}/v2`)) {
                        fs.mkdirSync(`${buildDir}/v2`);
                    }
                    fs.writeFile(`${buildDir}/v2/kommunicate.app`, data, function (err) {
                        if (err) {
                            console.log('kommunicate.app generation error');
                        }
                        console.log('kommunicate.app generated');
                    });
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

async function uploadSourceMaps(done) {
    if (!SENTRY_ENABLED) {
        done();
        return;
    }

    try {
        // Initialize a new release in Sentry
        await cli.releases.new(KM_RELEASE_BRANCH);

        // Upload source maps to the release
        await cli.releases.uploadSourceMaps(KM_RELEASE_BRANCH, {
            include: [buildDir],
            rewrite: true,
            sourceMapPath: buildDir,
            ext: ['.js', '.map'], // Explicitly specify file extensions
            stripPrefix: [buildDir], // Remove build directory prefix
            stripCommonPrefix: true,
            validate: true, // Validate source maps
            debug: true, // Add verbose Sentry CLI logging
        });

        // Finalize the release
        await cli.releases.finalize(KM_RELEASE_BRANCH);

        console.log('Source maps successfully uploaded to Sentry.');
        done();
    } catch (error) {
        console.error('Failed to upload source maps:', error);
        done(error);
    }
}
// Task to upload source maps to Sentry
gulp.task('upload-sourcemaps', async function (done) {
    try {
        await uploadSourceMaps(done);
        done();
    } catch (error) {
        console.error('Failed to upload source maps:', error);
        done(error);
    }
});

gulp.task('cleanFolder', function () {
    if (!fs.existsSync(buildDir)) {
        console.log('No build folder exist, creating the build folder');

        fs.mkdirSync(buildDir);
    }

    console.log('cleaning build folder');

    return gulp
        .src(buildDir + '/*', { read: false })
        .pipe(clean())
        .on('end', () => {
            console.log('cleaned build folder');
        });
});

gulp.task(
    'default',
    gulp.series(
        'cleanFolder',
        'sass',
        'generateResourceFolder',
        'generateThirdPartyJSFiles',
        'generateCSSFiles',
        'generatePluginJSFiles',
        'generateBuildFiles',
        'upload-sourcemaps'
    )
);
