let gulp = require('gulp');
let concat = require('gulp-concat');
let cleanCSS = require('gulp-clean-css');
let minify = require('gulp-minify');
let gulpCopy = require('gulp-copy');

function scripts() {
    return gulp
        .src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jquery-ui-dist/jquery-ui.js',
            'node_modules/bootstrap/dist/js/bootstrap.bundle.js',
            'node_modules/selectize.js/dist/js/standalone/selectize.js',
            'node_modules/imagelightbox/dist/imagelightbox.min.js',
            'node_modules/clipboard/dist/clipboard.js',
            'node_modules/socket.io-client/dist/socket.io.js',
            'node_modules/spectrum-colorpicker/spectrum.js',
            'node_modules/cookieconsent/build/cookieconsent.min.js'
        ])
        .pipe(concat('libs.js'))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('resources/public/lib/js'));
}

function css() {
    return gulp
        .src([
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/jquery-ui-dist/jquery-ui.css',
            'node_modules/@fortawesome/fontawesome-free/css/all.css',
            'node_modules/simple-line-icons/css/simple-line-icons.css',
            'node_modules/flag-icon-css/css/flag-icon.css',
            'node_modules/selectize.js/dist/css/selectize.default.css',
            'node_modules/imagelightbox/dist/imagelightbox.min.css',
            'node_modules/spectrum-colorpicker/spectrum.css',
            'node_modules/cookieconsent/build/cookieconsent.min.css'
        ])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(concat('libs.min.css'))
        .pipe(gulp.dest('resources/public/lib/css'));
}

function copyWebfonts() {
    return gulp
        .src(['node_modules/@fortawesome/fontawesome-free/webfonts/*'])
        .pipe(gulpCopy('resources/public/lib/webfonts/', { prefix: 4 }))
}

function copyFonts() {
    return gulp
        .src(['node_modules/simple-line-icons/fonts/*'])
        .pipe(gulpCopy('resources/public/lib/fonts/', { prefix: 3 }))
}

function copyFlags() {
    return gulp
        .src(['node_modules/flag-icon-css/flags/*/**'])
        .pipe(gulpCopy('resources/public/lib/flags/', { prefix: 3 }))
}

const build = gulp.series(gulp.parallel(css, scripts, copyWebfonts, copyFonts, copyFlags));

exports.build = build;
