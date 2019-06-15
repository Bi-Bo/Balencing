const gulp = require('gulp');
const run = require('gulp-run-command').default;
const gulpWebpack = require('webpack-stream');
const plumber = require('gulp-plumber');
const clean = require('gulp-clean');
const path = require('path');

const sourceCommonDir = './common';
const sourceMainDir = './main';
const sourceRendererDir = './renderer/src';
const outputDir = './build';
const outputRendererDir = './build/renderer';
const outputCommonDir = './build/common';

const runWebPack = option => () => gulp.src(sourceRendererDir)
    .pipe(plumber())
    .pipe(gulpWebpack(Object.assign(require('./webpack.config.js'), option)))
    .pipe(gulp.dest(outputRendererDir));

gulp.task(
    'clean',
    () => gulp.src(outputDir)
        .pipe(clean())
);

gulp.task(
    'copy_common',
    ['clean'],
    () => gulp.src(path.join(sourceCommonDir, './*.js'))
        .pipe(gulp.dest(outputCommonDir))
);

gulp.task(
    'copy_main',
    ['clean'],
    () => gulp.src(path.join(sourceMainDir, './*.js'))
        .pipe(gulp.dest(outputDir))
);

gulp.task(
    'copy_renderer',
    ['clean'],
    () => gulp.src(path.join(sourceRendererDir, './*.html'))
        .pipe(gulp.dest(outputRendererDir))
);

gulp.task(
    'copy_dep',
    ['clean'],
    () => gulp.src(path.join(sourceMainDir, './*.json'))
        .pipe(gulp.dest(outputDir))
);

gulp.task(
    'webpack',
    ['clean', 'copy_common', 'copy_main', 'copy_renderer', 'copy_dep'],
    runWebPack({
        mode: 'production',
        devtool: 'none'
    })
);

gulp.task(
    'webpack-watch',
    ['webpack'],
    runWebPack({
        watch: true,
        mode: 'development',
        devtool: 'source-map'
    })
);

gulp.task(
    'app',
    run('./node_modules/electron/cli.js ' + outputDir + '/index.js')
);

gulp.task(
    'all',
    ['webpack'],
    run('./node_modules/electron/cli.js ' + outputDir + '/index.js')
);

gulp.task(
    'dev',
    ['all', 'webpack-watch']
);