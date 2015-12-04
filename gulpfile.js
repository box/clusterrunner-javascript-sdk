var fs = require('fs');
var exec = require('child_process').exec;
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');
var eslint = require('gulp-eslint');
var mocha = require('gulp-mocha');
var git = require('gulp-git');
var jsdoc = require('gulp-jsdoc');
var bg = require('gulp-bg');
var shell = require('gulp-shell');
var Server = require('karma').Server;

var webpackConfig = {
    output: {
        // Expose class 'ClusterRunner' to global namespace in browser
        library: 'ClusterRunner'
    },
    // Do the following so webpack works with 'requests'
    module: {
        loaders: [
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
};

gulp.task('build', function() {
    return gulp.src('./src/client.js')
        .pipe(webpack(webpackConfig))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('doc', function() {
	return gulp.src('./src/*.js')
		.pipe(jsdoc('./jsdoc'))
});

gulp.task('lint', function() {
    return gulp.src('./src/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});

gulp.task('unit-test', function() {
    return gulp.src('./test/unit/*.js', {read: false})
        .pipe(mocha({
            reporter: 'dot',
            require: ['./test/unit/helper.js']
        }))
});

gulp.task('browser-functional-test', ['build'], function(done) {
    return new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('node-functional-test', function() {
    return gulp.src('./test/functional/node/*.js', {read: false})
        .pipe(mocha({reporter: 'dot'}))
});

gulp.task('get-clusterrunner', function(done) {
	if (!fs.existsSync('.clusterrunner')) {
		var platform = process.platform;
		var clusterrunnerPackageUrl = undefined;
		if (platform === 'darwin')
			clusterrunnerPackageUrl = 'https://cloud.box.com/shared/static/pqln47ur9ektad5hxq4a.tgz';
		else
			clusterrunnerPackageUrl = 'https://cloud.box.com/shared/static/2pl4pi6ykvrbb9d06t4m.tgz';

		exec('mkdir -p .clusterrunner/dist && curl -L ' + clusterrunnerPackageUrl + ' > .clusterrunner/clusterrunner.tgz && tar -zxvf .clusterrunner/clusterrunner.tgz -C .clusterrunner/dist && cp .clusterrunner/dist/conf/default_clusterrunner.conf .clusterrunner/clusterrunner.conf && chmod 600 .clusterrunner/clusterrunner.conf', function (err) {
			if (!err) done();
		});
	} else {
		done();
	}
});

gulp.task('stop-clusterrunner', shell.task([
    '.clusterrunner/dist/clusterrunner stop -c .clusterrunner/clusterrunner.conf'
]));

gulp.task('build-simple-job', shell.task([
    'cd test/functional && ../../.clusterrunner/dist/clusterrunner build --job-name Simple -c ../../.clusterrunner/clusterrunner.conf'
]));

gulp.task('start-clusterrunner', shell.task(['.clusterrunner/dist/clusterrunner deploy']));

gulp.task('prepare-clusterrunner-for-functional-test', function(done) {
    runSequence(
        'get-clusterrunner',
        'stop-clusterrunner',
        'start-clusterrunner',
        'build-simple-job',
        done
    );
});

gulp.task('functional-test', function(done) {
    runSequence(
        'prepare-clusterrunner-for-functional-test',
        ['browser-functional-test', 'node-functional-test'],
        'stop-clusterrunner',
        done
    );
});

gulp.task('test', function(done) {
    // 'unit-test' and 'node-functional-test' can't be run in parallel due to mocha
    runSequence('unit-test', 'functional-test', 'lint', done);
});
