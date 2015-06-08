var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./app"
    },
    files: "./app/assets/css/**/*.css"
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src('app/assets/images/')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('app/assets/images/optimized/'));
});

gulp.task('styles', function(){
  gulp.src(['app/assets/scss/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
      }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('app/assets/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('app/assets/css/'))
    .pipe(browserSync.reload({stream:true}))
});


gulp.task('default', ['browser-sync'], function(){
  gulp.watch("app/assets/scss/**/*.scss", ['styles']);
  gulp.watch("*.html", ['bs-reload']);
});