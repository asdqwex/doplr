'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const modRewrite = require('connect-modrewrite');
const watch = require('gulp-watch');
const less = require('gulp-less');
const rename = require('gulp-rename');
const jade = require('gulp-jade');
const webpack = require('gulp-webpack');
const spawn = require('child_process').spawn;
const seq = require('run-sequence');

const WEBPACK_OPTIONS = {
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  output: {
    filename: 'bundle.js'
  }
};

let radarInstance;

gulp.task('radar:restart', function () {
  if (radarInstance) {
    radarInstance.kill();
  }
  radarInstance = spawn('./bin/radar.js', {
    stdio: 'inherit',
    env: {},
    PATH: process.env.PATH
  }).on('error', function (err) {
    console.log(err.message);
    throw err;
  }).on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});
process.on('exit', function() {
  if (radarInstance) { radarInstance.kill(); }
});

gulp.task('weathergirl:start', function () {
  connect.server({
    root: 'public',
    port: 8080,
    livereload: true,
    middleware: function () {
      return [modRewrite([
        '^/api/(.*)$ http://localhost:' + 9040 + '/$1 [P]'
      ])];
    }
  });
});

gulp.task('webpack', function () {
  gulp.src('www/index.js')
    .pipe(webpack(WEBPACK_OPTIONS))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('public'))
    .pipe(connect.reload());
});


gulp.task('less', function () {
  return gulp.src('www/index.less')
    .pipe(less({
      compress: false,
      rootpath: '/'
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(rename('bundle.css'))
    .pipe(gulp.dest('public'))
    .pipe(connect.reload());
});

gulp.task('jade', function () {
  return gulp.src('www/index.jade')
    .pipe(jade({
      locals: {
        assetURL: '/'
      }
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(gulp.dest('public'))
    .pipe(connect.reload());
});

gulp.task('default', function () {
  seq(['less', 'jade', 'webpack']);
});

gulp.task('watch', function () {
  seq(
    ['less', 'jade', 'webpack'],
    ['radar:restart', 'weathergirl:start'],
    function () {
      watch(['www/index.less'], function () {
        seq(['less']);
      });
      watch(['www/index.jade'], function () {
        seq(['jade']);
      });
      watch(['www/index.js'], function () {
        seq(['webpack']);
      });
      watch(['lib/*.js', 'lib/sweep/*.js'], function () {
        seq(['radar:restart'], function () {
          connect.reload();
        });
      });
    }
  );
});
