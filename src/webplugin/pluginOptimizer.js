const compressor = require('node-minify');
const path = require('path');
const fs = require('fs');
const version = require('child_process')
  .execSync('git rev-parse --short HEAD', {cwd: __dirname})
  .toString().trim();
const buildDir = path.resolve(__dirname,'build');
const config = require("../../conf/config");
const MCK_CONTEXT_PATH = config.getProperties().urls.hostUrl;
const MCK_STATIC_PATH = MCK_CONTEXT_PATH + "/plugin";

// Change "env" to "false" to uncompress all files.
let env = config.getEnvId();

let jsCompressor = !env ?"no-compress" : "gcc"; 
let uglifyCompressor = !env? "no-compress" : "uglify-es";
let cssCompressor =  !env? "no-compress" : "clean-css";

const removeExistingFile = function (dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch (e) { return; }
    files && files.map(file => {
        if (fs.statSync(dirPath + '/' + file).isFile())
            fs.unlinkSync(dirPath + '/' + file);
    })
    //fs.rmdirSync(dirPath);
};

const compressAndOptimize = () => {
    compressor.minify({
        compressor: jsCompressor,
        input: [
            path.resolve(__dirname, 'lib/js/mck-ui-widget.min.js'),
            path.resolve(__dirname, 'lib/js/mck-ui-plugins.min.js'),
            path.resolve(__dirname, 'lib/js/mck-emojis.min.js'),
            path.resolve(__dirname, 'lib/js/howler-2.0.2.min.js'),
            path.resolve(__dirname, 'lib/js/tiny-slider-2.4.0.js'),
            path.resolve(__dirname, 'lib/js/mustache.js'),
            path.resolve(__dirname, 'lib/js/aes.js'),
            path.resolve(__dirname, 'js/app/km-utils.js'),
            path.resolve(__dirname, 'lib/js/sentry-error-tracker.js')
        ],
        output: path.resolve(__dirname, `${buildDir}/kommunicatepluginrequirements.${version}.min.js`),
        options: {
            compilationLevel: 'WHITESPACE_ONLY',
        },
        callback: function (err, min) {
            if (!err) {
                console.log( `kommunicatepluginrequirements.${version}.min.js combined successfully`);
            }
            else {
                console.log(`err while minifying kommunicatepluginrequirements.${version}.min.js`, err);
            }
        }
    });


    // minify applozic css files into a single file
    compressor.minify({
        compressor: cssCompressor,
        input: [
            path.resolve(__dirname, 'lib/css/mck-combined.min.css'),
            path.resolve(__dirname, 'css/app/mck-sidebox-1.0.css'),
            path.resolve(__dirname, 'css/app/km-rich-message.css'),
            path.resolve(__dirname, 'css/app/km-login-model.css'),
            path.resolve(__dirname, 'lib/css/tiny-slider-2.4.0.css'),
            path.resolve(__dirname, 'css/app/km-sidebox.css'),
        ],
        output: path.resolve(__dirname, `${buildDir}/kommunicatepluginrequirements.${version}.min.css`),
        options: {
            advanced: true, // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
            aggressiveMerging: true, // set to false to disable aggressive merging of properties.
            compatibility: '', // To add vendor prefixes for IE8+
            sourceMap: true
        },
        callback: function (err, min) {
            if (!err) {
                console.log(`kommunicatepluginrequirements.${version}.min.css combined successfully`);
            }
            else {
                console.log(`err while minifying kommunicatepluginrequirements.${version}.min.css`, err);
            }
        }
    });

    compressor.minify({
         compressor: uglifyCompressor,
        input: [
            path.resolve(__dirname, 'js/app/applozic.jquery.js'),
            path.resolve(__dirname, 'knowledgebase/common.js'),
            path.resolve(__dirname, 'knowledgebase/helpdocs.js'),
            path.resolve(__dirname, 'knowledgebase/kb.js'),
            path.resolve(__dirname, 'js/app/labels/default-labels.js'),
            path.resolve(__dirname, 'js/app/kommunicate-client.js'),
            path.resolve(__dirname, 'js/app/conversation/km-conversation-helper.js'),
            path.resolve(__dirname, 'js/app/conversation/km-conversation-service.js'),
            path.resolve(__dirname, 'js/app/kommunicate.js'),
            path.resolve(__dirname, 'js/app/km-richtext-markup-1.0.js'),
            path.resolve(__dirname, 'js/app/km-message-markup-1.0.js'),
            path.resolve(__dirname, 'js/app/km-event-listner.js'),
            path.resolve(__dirname, 'js/app/km-attachment-service.js'),
            path.resolve(__dirname, 'js/app/mck-sidebox-1.0.js'),
            path.resolve(__dirname, 'js/app/kommunicate.custom.theme.js'),
            path.resolve(__dirname, 'js/app/kommunicateCommons.js'),
            path.resolve(__dirname, 'js/app/km-rich-text-event-handler.js'),
            path.resolve(__dirname, 'js/app/kommunicate-ui.js'),
            path.resolve(__dirname, 'js/app/events/applozic-event-listener.js'),
            path.resolve(__dirname, 'js/app/events/applozic-event-handler.js'),
            path.resolve(__dirname, 'js/app/km-post-initialization.js'),
            path.resolve(__dirname, 'js/app/mck-ringtone-service.js')
        ],
        output: path.resolve(__dirname, `${buildDir}/kommunicate-plugin.${version}.min.js`),
        callback: function (err, min) {
            if (!err)
                console.log(`kommunicate-plugin.${version}.min.js combined successfully`);
            else {
                console.log(`err while minifying kommunicate-plugin.${version}.min.js`, err);
            }
        }
    });
};

const minifyMckAppJs = () => {
    compressor.minify({
        compressor: uglifyCompressor,
        input: [
            path.resolve(__dirname, `${buildDir}/mck-app.${version}.js`),
        ],
        output: path.resolve(__dirname, `${buildDir}/mck-app.${version}.js`),
        callback: function (err, min) {
            if (!err) {
                console.log( `mck-app.${version}.js combined successfully`);
            }
            else {
                console.log(`err while minifying mck-app.${version}.js`, err);
            }
        }
    });
};

const generateBuildFiles = () => {
    // Generate mck-sidebox.html file for build folder.
    fs.readFile(path.join(__dirname, "template/mck-sidebox.html"), 'utf8', function (err, data) {
        if (err) {
            console.log("error while generating mck-sidebox.html", err);
        }
        fs.writeFile(`${buildDir}/mck-sidebox.${version}.html`, data, function (err) {
            if (err){
                console.log("mck-file generation error");}
        })
    });
    // Generate plugin.js file for build folder.
    fs.readFile(path.join(__dirname, "plugin.js"), 'utf8', function (err, data) {
        if (err) {
            console.log("error while generating plugin.js", err);
        }
        var mckApp = data.replace('MCK_APP_JS', `"${MCK_STATIC_PATH}/build/mck-app.${version}.js"`)
        fs.writeFile(`${buildDir}/plugin.js`, mckApp, function (err) {
            if (err){
                console.log("plugin.js generation error");}
        })
    });
    // Generate mck-app.js file for build folder.
    fs.readFile(path.join(__dirname, "js/app/mck-app.js"), 'utf8', function (err, data) {
        if (err) {
            console.log("error while generating mck app", err);
        }
        var mckApp = data.replace('KOMMUNICATE_PLUGIN_REQUIREMENTS_CSS', `"${MCK_STATIC_PATH}/build/kommunicatepluginrequirements.${version}.min.css"`)
            .replace('KOMMUNICATE_PLUGIN_REQUIREMENTS_MIN_JS', `"${MCK_STATIC_PATH}/build/kommunicatepluginrequirements.${version}.min.js"`)
            .replace('KOMMUNICATE_PLUGIN_MIN_JS', `"${MCK_STATIC_PATH}/build/kommunicate-plugin.${version}.min.js"`)
            .replace('MCK_SIDEBOX_HTML', `"${MCK_STATIC_PATH}/build/mck-sidebox.${version}.html"`);
        fs.writeFile(`${buildDir}/mck-app.${version}.js`, mckApp, function (err) {
            if (err){
                console.log("mck-file generation error");}
                minifyMckAppJs();
        })
    });
}

removeExistingFile(buildDir);
compressAndOptimize();
generateBuildFiles();

exports.pluginVersion = version;