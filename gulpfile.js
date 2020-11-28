var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var runSequence = require('gulp4-run-sequence');

gulp.task('browsersync', function () {
  browserSync({
    server: {
      baseDir: 'app',
    },
  });
});

gulp.task('sass', function () {
  return gulp
    .src('app/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

gulp.task('watch', function () {
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('useref', function () {
  return gulp
    .src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

/* Build */
gulp.task('default', function (callback) {
  runSequence(['sass', 'browsersync'], 'watch', callback);
});

gulp.task('build', function (callback) {
  runSequence('sass', ['useref'], callback);
});
