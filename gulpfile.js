'use strict'

const argv = process.argv;
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
let webpackConfig = require('./webpack.config.js');
let webpackProductionConfig = require('./webpack.production.config.js');

let config =  process.env.NODE_ENV === 'production' ? webpackProductionConfig : webpackConfig;

gulp.task('watch', () => {

	// 当src/js、src/css下文件发生变动时，启动webpack
	gulp.watch(['src/**/*.js', 'src/**/*.css'], ['webpack']);

	// 当src文件夹中的文件发生改变时，将其迁移至public文件夹中
	gulp.watch('src/*.html', () => {
		return gulp.src('src/*.html')
			.pipe(gulp.dest('public'))
	});

	// 当src/img中的图片更新时，将其迁移至public/img中
	gulp.watch('src/img/**/*', (event) =>{
		return gulp.src(event.path)
			.pipe(gulp.dest('public/img'));

	} )
	// 当public文件夹发生改变时，刷新浏览器
	gulp.watch("public/*.html").on('change', reload);
})


gulp.task('webpack', (callback) => {
	console.log('webpack start...')
	webpack(config, (err,stats) => {
		if(err){
			throw new gutil.PluginError('webpack', err);
		}

 		gutil.log('[webpack]', stats.toString());
 		callback();
	})
});


// 代理 + 监听watch任务
gulp.task('server', () => {
	nodemon({
		script: 'app.js',
		ignore: ['gulpfile.js', 'node_modules/', 'src/', 'public/'],
		env: {
			'NODE_ENV': 'development'
		}
	}).on('start', function() { 
		browserSync.init({ 
			proxy: 'http://localhost:3451', // 端口号必须和app.js中监听的端口一致
			files: ["public/**/*.*", "views/**", "routes/**"], 
			port:8080 
		}, function() { 
			console.log("browser refreshed.");
		});   
	});
});


gulp.task('default', ['server', 'webpack', 'watch'])