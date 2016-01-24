var gulp = require('gulp');
var gutil = require('gulp-util');

var connect = require('gulp-connect');

var config = {
  env : process.env.NODE_ENV || "development"
}

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port : process.env.PORT || 8080,
    livereload: config.env.NODE_ENV === "development"
  });
});

gulp.task('default', ['connect']);
