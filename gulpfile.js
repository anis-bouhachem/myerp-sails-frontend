var gulp = require('gulp');
var gutil = require('gulp-util');
var path = require('path');
var karma = require('karma');
var connect = require('gulp-connect');

var config = {
  env : process.env.NODE_ENV || "development"
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
    root: 'app',
    port : process.env.PORT || 8080,
    livereload: config.env.NODE_ENV === "development"
  });
});

gulp.task('default', ['connect']);
