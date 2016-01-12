var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var gutil = require('gulp-util');

function compile(watch) {
	var bundler = watchify(browserify('./public/js/main.js', {
		debug: true,
		extensions: ['.jsx', '.js'],
	}).transform(babel, {presets: ["es2015", "react"]}));


	bundler.on('log', (msg) => {
		gutil.log(gutil.colors.cyan('scripts') + ': ' + msg);
	});

	function rebundle() {
		bundler.bundle()
			.on('error', function(err) {
				console.error(err.message);
				this.emit('end');
			})
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({
				loadMaps: true
			}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./public/dist/js'));
	}

	if (watch) {
		bundler.on('update', function() {
			console.log('-> bundling...');
			rebundle();
		});
	}

	rebundle();
}

function watch() {
	return compile(true);
};

gulp.task('build', function() {
	return compile();
});
gulp.task('watch', function() {
	return watch();
});

gulp.task('default', ['watch']);