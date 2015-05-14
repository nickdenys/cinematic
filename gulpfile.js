var gulp    = require('gulp'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify'),
    sass    = require('gulp-ruby-sass'),
    minify  = require('gulp-minify-css');
    rename  = require('gulp-rename');

// Declare paths
var paths = {
  styles: './assets/scss/**/*.scss',
};

// Move files from bower_components to project folders
gulp.task('bower', function() {
  // JS
  gulp.src([
      './bower_components/jquery/dist/*',
      './bower_components/angular/angular*',
      '!./bower_components/angular/*.css',
      './bower_components/angular-route/angular*'
    ])
    .pipe(gulp.dest('./app/js/vendor'));

  // CSS
  gulp.src('./bower_components/bourbon/app/assets/stylesheets/**/*.scss')
    .pipe(gulp.dest('./assets/scss/vendor/bourbon'));
  gulp.src('./bower_components/neat/app/assets/stylesheets/**/*.scss')
    .pipe(gulp.dest('./assets/scss/vendor/neat'));

  // FONTS
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.styles, ['sass']);
});

// Minify the outputted css
gulp.task('css', ['sass'], function() {
  return gulp.src([
      'assets/css/*.css',
      '!assets/css/*.min.css',
    ])
    .pipe(minify())
    .pipe(rename({
      extname: ".min.css"
    }))
    .pipe(gulp.dest('assets/css'));
});

// Compile .scss files to .css
gulp.task('sass', function() {
  return gulp.src('assets/scss/*.scss')
    .pipe(sass())
    .on('error', function (err) { console.log(err.message); })
    .pipe(gulp.dest('assets/css'));
});

gulp.task('default', ['bower', 'watch', 'css']);