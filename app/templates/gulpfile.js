var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    concat       = require('gulp-concat'),
    imagemin     = require('gulp-imagemin'),
    livereload   = require('gulp-livereload'),
    clean        = require('gulp-clean'),
    cache        = require('gulp-cache'),
    notify       = require('gulp-notify');


gulp.task('css', function(){
    return gulp.src('public/scss/app.scss')
        .pipe(sass({ style: 'compressed', loadPath: ['bower_components/foundation/scss'], quiet: true }))
        .pipe(autoprefixer('last 1 version'))
        // .pipe(minifycss())  no longer necessary because sass is compressed
        .pipe(gulp.dest('public/css'))
        .pipe(notify({ message: 'All done with the css.' }));
});

gulp.task('default', function(){
    gulp.run('css');

    gulp.watch('public/scss/**/.*scss', function() {
        gulp.run('css');
    });
});