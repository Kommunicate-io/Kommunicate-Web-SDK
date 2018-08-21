const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssMinify = require('postcss-clean');
const babel = require('gulp-babel');
const mediaq = require("css-mqpacker");
const exec = require('gulp-exec');
const htmlMin = require('gulp-htmlmin');
const cached = require('gulp-cached');

// // Regex for html minifier
// var jekyllConditionalWrapOpen = /\{\% if[^}]+\%\}/;
// var jekyllConditionalWrapClose = /\{\%[^}]+endif \%\}/;
// var jekyllConditionalWrapPair = [jekyllConditionalWrapOpen, jekyllConditionalWrapClose];

//Image minification task
gulp.task('imageMinify', (e) => {
    gulp.src('assets/resources/images/*')
        .on('start', ()=>{
            console.log('This will take a while..');
        })
        .pipe(cached('imgminify'))
        .pipe(imageMin([
            imageMin.gifsicle({
                interlaced: false   
            }),
            imageMin.jpegtran({
                progressive: true
            }),
            imageMin.optipng({
                optimizationLevel: 5
            }),
            imageMin.svgo({
                plugins: [{
                        removeViewBox: false
                    },
                    {
                        cleanupIDs: false
                    }
                ]
            })
        ])).pipe(gulp.dest('_site/assets/resources/images')).on('end', e).on('error', e);
});

//Minify html
gulp.task('html', () => {
    gulp.src(['_site/**/*.html',
            "!_site/**/sections/*.html"
        ])
        .pipe(htmlMin({
            removeComments: true,
            collapseWhitespace: true,
            removeEmptyAttributes: true,
            removeCommentsFromCDATA: true,
            removeRedundantAttributes: true,
            collapseBooleanAttributes: true,
            minifyJS:true,
            minifyCSS:true
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
});

//compile Es6 js and minify it
gulp.task('js', (e) => {

    gulp.src(["_site/assets/resources/js"])
        .pipe(cached('jsminify'))
        .pipe(babel({
            "presets": ["es2015-without-strict"]
        }))
        .pipe(uglify())
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
});
//compile sass then autoprefix it then combine alll media queries
gulp.task('css', (e) => {
    var plugins = [
        mediaq(),
        autoprefixer({
            browsers: ['last 5 version']
        }),
        cssMinify()
    ];
    setTimeout(() => {
        gulp.src(["_src/scss/*.scss"])
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest("_src/css")).on('end', e).on('error', e)
            .pipe(postcss(plugins))
            .pipe(gulp.dest('_site/assets/resources/css'));
    }, 400);


})
gulp.task('css-prod', (e) => {
    var plugins = [
        mediaq(),
        autoprefixer({
            browsers: ['last 5 version']
        }),
        cssMinify()
    ];
    setTimeout(() => {
        gulp.src(["_site/assets/resources/css/**/*.css","_site/assets/resources/css/*.css"])
            .pipe(postcss(plugins))
            .pipe(gulp.dest(function (file) {
                return file.base;
            })).on('end', e).on('error', e)
    }, 400);


})

//Browser sync and watch tasks
gulp.task('serve', function () {
    browsersync.init({
        server: "./_site"

    });
    // exec('bundle exec jekyll serve');?
    gulp.watch('assets/resources/js/*.js', ['js']);
    gulp.watch('assets/resources/js/**/*.js', ['js']);
    gulp.watch('_src/scss/*.scss', ['css']);
    gulp.watch('_src/scss/**/*.scss', ['css']);
    // gulp.watch('src/css/*.css', ['css']);
    gulp.watch('_src/images/*', ['imageMin']);
 
    gulp.watch(['_site/*', '_site/assets/resources/js/**/*.js', '_site/assets/resources/css/**/*.css']).on('change', browsersync.reload);
});

gulp.task('default', ['js', 'css', 'serve', 'html','css-prod']);