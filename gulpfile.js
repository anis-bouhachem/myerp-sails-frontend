var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var path = require('path');
var karma = require('karma');
var connect = require('gulp-connect');
var sass = require('gulp-sass');
var sassdoc = require('sassdoc');
var gulpDocs = require('gulp-ngdocs');
var runSequence = require('run-sequence');
var del = require('del');

var pkg = require('./package.json');

var config = {
  env : process.env.NODE_ENV || "development",
  src : "./src",
  dest : "./app",
  doc : "./app/docs"
}

var karmaParseConfig = require('karma/lib/config').parseConfig;

function runKarma(configFilePath, options, cb) {

	configFilePath = path.resolve(configFilePath);

	var server = karma.server;
	var log=gutil.log, colors=gutil.colors;
	var config = karmaParseConfig(configFilePath, {});

    Object.keys(options).forEach(function(key) {
      config[key] = options[key];
    });

	server.start(config, function(exitCode) {
		log('Karma has exited with ' + colors.red(exitCode));
		cb();
		process.exit(exitCode);
	});
}

/** actual tasks */


gulp.task('sass', function () {
  gulp.src(config.src + '/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.dest + "/css"));
});

gulp.task('sass:watch', function () {
  gulp.watch(config.src + '/**/*.scss', ['sass']);
});

gulp.task('sass:doc', function () {
  return gulp.src(config.src + '/**/*.scss')
    .pipe(sassdoc({dest : config.doc + "/scss"}));
});

gulp.task('ngdocs', [], function () {
  var options = {
    scripts: [config.src + "/app.js"],
    html5Mode: false,
    startPage: '/api',
    title: "Documentation : " + pkg.name,
    titleLink: "/docs/ng",
    api: {
      api: true,
      title: 'API Documentation'
    }
  };
  return gulp.src(config.src + "/**/*.js")
    .pipe(gulpDocs.process(options))
    .pipe(gulp.dest(config.doc + '/ng'));
});


gulp.task('clean', function () {
	return del(config.dest);
});


gulp.task("build", function() {
  gulp.src(config.src + "/**")
    .pipe(gulp.dest(config.dest));
});
/** single run */
gulp.task('test', function(cb) {
	runKarma('karma.conf.js', {
		autoWatch: false,
		singleRun: true
	}, cb);
});

/** continuous ... using karma to watch (feel free to circumvent that;) */
gulp.task('test-dev', function(cb) {
	runKarma('karma.conf.js', {
		autoWatch: true,
		singleRun: false
	}, cb);
});


gulp.task('connect', function() {
  connect.server({
    root: config.dest,
    port : process.env.PORT || 8080,
    livereload: config.env.NODE_ENV === "development"
  });
});

gulp.task("doc", ['sass:doc', 'ngdocs'], function () {
  gulp.src("./files/docs-index.html")
    .pipe(rename("index.html"))
    .pipe(gulp.dest(config.dest + "/docs"));
});

gulp.task('default', function (callback) {
  runSequence('clean',
              'build',
              'doc',
              'connect',
              callback);
});
