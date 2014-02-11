var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    cache        = require('gulp-cache'),
    clean        = require('gulp-clean'),
    concat       = require('gulp-concat'),
    imagemin     = require('gulp-imagemin'),
    livereload   = require('gulp-livereload'),
    minifycss    = require('gulp-minify-css'),
    notify       = require('gulp-notify'),
    rename       = require('gulp-rename'),
    sass         = require('gulp-ruby-sass'),
    uglify       = require('gulp-uglify'),
    lr           = require('tiny-lr'),
    server       = lr();


gulp.task('css', function(){
    return gulp.src('app/assets/scss/app.scss')
        .pipe(sass({
            style: 'expanded',
            loadPath: ['bower_components/foundation/scss'],
            quiet: true }))
        .pipe(autoprefixer('last 5 version'))
        .pipe(gulp.dest('public/css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('public/css'))
        .pipe(livereload(server))
        .pipe(notify({ message: 'All done with the css.' }));
});

gulp.task('js', function() {
  return gulp.src('app/assets/js/**/*.js')
    // .pipe(jshint('.jshintrc'))
    // .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('public/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('app/assets/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public/images'))
    .pipe(livereload(server))
    .pipe(notify({ message: 'Images task complete' }));
});


gulp.task('clean', function() {
  return gulp.src(['public/css', 'public/js', 'public/images'], {read: false})
    .pipe(clean());
});

gulp.task('reload', function() {
  return gulp.src('app/views/**/*.php')
    .pipe(livereload(server))
    .pipe(notify({ message: 'Views task complete' }));
});



gulp.task('default', ['clean'], function() {
  gulp.start('css', 'js', 'images');
});



gulp.task('watch', function() {



  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };


    // Watch blade views
    gulp.watch('app/views/**/*.php', ['reload']);

    // Watch .scss files
    gulp.watch('app/assets/scss/**/*.scss', ['css']);

    // Watch .js files
    gulp.watch('app/assets/js/**/*.js', ['js']);

    // Watch image files
    gulp.watch('app/assets/images/**/*', ['images']);
  });
});
