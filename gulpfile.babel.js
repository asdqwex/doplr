'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const modRewrite = require('connect-modrewrite');
const watch = require('gulp-watch');
const less = require('gulp-less');
const rename = require('gulp-rename');
const jade = require('gulp-jade');
const webpack = require('webpack-stream');
const spawn = require('child_process').spawn;
const seq = require('run-sequence');
const uglify = require('gulp-uglify');
const fs = require('fs');

let radarInstance;

// Copy some theme stuff over
gulp.task('assets', function () {
  gulp.src('www/favicon.ico').pipe(gulp.dest('public/'));
});

gulp.task('radar:restart', function () {
  if (radarInstance) { radarInstance.kill(); }
  radarInstance = spawn('./bin/doplr.js', ['radar'], {
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

gulp.task('reloadproxy:start', function () {
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

const WEBPACK_OPTIONS = {
  watch: true,
  module: {
    loaders: [
      { test: /(^\.js$|\.jsx$)/, exclude: /node_modules/, loader: 'babel' }
    ]
  },
  output: {
    filename: 'bundle.js'
  }
};

gulp.task('webpack', function () {
  const task = gulp.src('www/index.jsx')
    .pipe(webpack(WEBPACK_OPTIONS))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    });
  if (process.env.COMPRESS) {
    task.pipe(uglify());
  }
  task.pipe(gulp.dest('public'))
    .pipe(connect.reload());
});

gulp.task('less', function () {
  gulp.src('www/index.less')
    .pipe(less({
      compress: process.env.COMPRESS || false,
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

gulp.task('semantic:setup', function () {
  // Theme config
  gulp.src('www/theme.config')
    .pipe(gulp.dest('node_modules/semantic-ui/src'));
  // Fonts
  gulp.src('node_modules/semantic-ui/src/themes/default/assets/fonts/*')
    .pipe(gulp.dest('public/themes/default/assets/fonts/'));
  // Setup semantic node_module for use
  return gulp.src('node_modules/semantic-ui/src/_site/*/*')
    .pipe(gulp.dest('node_modules/semantic-ui/src/site'));
});

gulp.task('semantic:ui', function () {
  // Compile semantic into a vendor.css bundle
  gulp.src('node_modules/semantic-ui/src/semantic.less')
    .pipe(less({
      compress: process.env.COMPRESS || false,
      rootpath: '/'
    }))
    .on('error', function (err) {
      console.log(err.toString());
      this.emit('end');
    })
    .pipe(rename('vendor.css'))
    .pipe(gulp.dest('public'))
    .pipe(connect.reload());
});

gulp.task('jade', function () {
  gulp.src('www/index.jade')
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

const semanticIsSetup = fs.existsSync('node_modules/semantic-ui/src/site');
const defaultTasks = ['semantic:ui', 'less', 'jade', 'webpack', 'assets'];
gulp.task('default', function () {
  if (semanticIsSetup) {
    seq(defaultTasks);
  } else {
    seq('semantic:setup', defaultTasks);
  }
});

gulp.task('watch', function () {
  const tasks = [];
  if (!semanticIsSetup) {
    tasks.push('semantic:setup');
  }
  tasks.push(defaultTasks);
  tasks.push(['radar:restart', 'reloadproxy:start']);
  tasks.push(function () {
    // LESS FILES
    watch(['www/index.less'], function () {
      seq(['less']);
    });
    // JADE FILES
    watch(['www/index.jade'], function () {
      seq(['jade']);
    });
    // FRONTEND: JS AND JSX
    watch(['www/*.jsx', 'www/*.js', 'www/partials/*.jsx', 'www/partials/*/*.jsx'], function () {
      seq(['webpack']);
    });
    // DOPLR LIB: JS
    watch(['lib/*.js', 'lib/sweep/*.js'], function () {
      seq(['radar:restart'], function () {
        connect.reload();
      });
    });
  });
  seq(...tasks);
});
