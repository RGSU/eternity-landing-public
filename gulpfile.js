/* eslint-enable */
import path from 'path';
// import fs from 'fs';

import gulp from 'gulp';
import browserSync from 'browser-sync';
import cheerio from 'gulp-cheerio';
import { deleteSync } from 'del';
import htmlBeautify from 'gulp-html-beautify';
import gulpif from 'gulp-if';
import plumber from 'gulp-plumber';
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import debug from 'gulp-debug';

import stylus from 'gulp-stylus';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import sortMediaQueries from 'postcss-sort-media-queries';

import posthtml from 'gulp-posthtml';
import posthtmlInlineSvg from 'posthtml-inline-svg';

import svgSprite from 'gulp-svg-sprite';
import svgmin from 'gulp-svgmin';
import gulpZip from 'gulp-vinyl-zip';

import webpackStream from 'webpack-stream';
import { setup as emittySetup } from '@zoxon/emitty';
import { createRequire } from 'module';
import webpackConfig from './webpack.config.js';

// Plugins options
const browserSyncPort = 3000;
const useJQuery = false;

// Dev Variables
const isProduction = Boolean(process.env.NODE_ENV);

// CLEAN Folders
const clean = (done) => {
  deleteSync(['./dist']);
  done();
};

// PUG, HTML PAGES

const emittyPug = emittySetup('src', 'pug', {
  makeVinylFile: true,
});

global.watch = false;
global.emittyChangedFile = {
  path: '',
  stats: null,
};

const pages = () => {
  const sourceOptions = global.watch ? { read: false } : {};
  return gulp.src('src/pages/**/*.pug', sourceOptions)
    .pipe(plumber())
    .pipe(
      gulpif(
        global.watch,
        emittyPug.stream(
          global.emittyChangedFile.path,
          global.emittyChangedFile.stats,
        ),
      ),
    )
    .pipe(debug())
    .pipe(pug({
      pretty: false,
      doctype: 'html',
      locals: {
        env: isProduction ? 'production' : 'development',
        useJQuery,
      },
    }))
    .pipe(posthtml([
      posthtmlInlineSvg({
        cwd: path.resolve('src'),
        tag: 'icon',
        attr: 'src',
        svgo: {
          plugins: [
            { removeStyleElement: true },
            { removeViewBox: false },
            {
              removeAttrs: {
                attrs: ['fill', 'stroke', 'style', 'title', 'id', 'class'],
                preserveCurrentColor: true,
              },
            },
          ],
        },
      }),
    ]))
    .pipe(htmlBeautify({
      indent_char: ' ',
      indent_size: 4,
    }))
    .pipe(gulp.dest('dist'));
};

// CSS Styles
const styles = () => gulp.src('src/index.styl')
  .pipe(plumber())
  .pipe(stylus({
    'include css': true,
    include: [
      './bower_components/',
      './node_modules/',
    ],
  }))
  .pipe(gulpif(isProduction, rename('style.min.css'), rename('style.css')))
  .pipe(
    postcss(gulpif(
      isProduction,
      [
        autoprefixer(),
        sortMediaQueries(),
        cssnano({
          preset: ['default', {
            discardComments: {
              removeAll: true,
            },
          }],
        }),
      ],
      [
        autoprefixer(),
        sortMediaQueries(),
      ],
    )),
  )
  .pipe(gulp.dest('dist/assets/css/'))
  .pipe(browserSync.stream());

// JavaScript
const scripts = () => gulp.src(['src/index.js'])
  .pipe(plumber())
  .pipe(webpackStream(webpackConfig))
  .pipe(gulp.dest('dist/assets/js/'));

const gsapAnimations = () => gulp.src(['src/plugins/gsap-animate/gsapAnimations.js'])
  .pipe(plumber())
  .pipe(webpackStream(webpackConfig))
  .pipe(gulp.dest('dist/assets/js/'));

// const jquery = (done) => {
//   if (useJQuery) {
//     return gulp.src(['node_modules/jquery/dist/jquery.min.js'])
//       .pipe(plumber())
//       .pipe(gulp.dest('dist/assets/js/'));
//   }
//   done();
//   return true;
// };

// SVG Sprite
const sprite = () => gulp.src([
  'src/assets/sprite/*.svg',
  '!src/assets/sprite/_*.svg'])
  .pipe(svgmin({
    js2svg: { pretty: true },
  }))
  .pipe(cheerio({
    run($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke');
      $('[style]').removeAttr('style');
      $('[title]').removeAttr('title');
    },
    parserOptions: { xmlMode: true },
  }))
  .pipe(replace('&gt;', '>'))
  .pipe(svgSprite({
    mode: {
      symbol: {
        sprite: '../public/assets/img/sprite.svg',
        render: {
          styl: {
            dest: '../components/icon/icon.styl',
            template: 'src/components/icon/template.txt',
          },
        },
      },
    },
  }))
  .pipe(gulp.dest('src/'));

// Public Assets
const publicAssets = () => gulp.src(['src/public/**/*.*'])
  .pipe(plumber())
  .pipe(gulp.dest('dist/'));

// ZIP
const require = createRequire(import.meta.url);
const projectName = require('./package.json').name;

const correctNumber = (number) => (number < 10 ? `0${number}` : number);

const getDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = correctNumber(now.getMonth() + 1);
  const day = correctNumber(now.getDate());
  const hours = correctNumber(now.getHours());
  const minutes = correctNumber(now.getMinutes());
  return `${year}-${month}-${day}-${hours}${minutes}`;
};

const zipDist = () => {
  const datetime = getDateTime();
  const zipName = `${projectName}_${datetime}.zip`;
  return gulp.src('dist/**/*')
    .pipe(plumber())
    .pipe(gulpZip.zip(zipName))
    .pipe(gulp.dest('zip'));
};

const zipSrc = () => {
  const datetime = getDateTime();
  const zipName = `${projectName}_src_${datetime}.zip`;
  return gulp.src(['**/*', '**/.*', '!desktop.ini', '!yarn.lock', '!*.log',
    '!_project/**/*', '!_project',
    '!zip/**/*', '!zip',
    '!node_modules/**/*', '!node_modules',
    '!.git'])
    .pipe(plumber())
    .pipe(gulpZip.zip(zipName))
    .pipe(gulp.dest('zip'));
};

export const zip = gulp.series(zipSrc, zipDist);

// Server
const server = () => {
  browserSync.init({
    ui: false,
    notify: false,
    host: 'localhost',
    open: true,
    cors: true,
    port: browserSyncPort,
    server: {
      baseDir: 'dist',
    },
  });
};

// Watch

const reload = (done) => {
  browserSync.reload();
  done();
};

const watch = () => {
  global.watch = true;
  gulp.watch('src/**/*.pug', gulp.series(pages, reload))
    .on('all', (event, filepath, stats) => {
      global.emittyChangedFile = {
        path: filepath,
        stats,
      };
    });
  gulp.watch('src/**/*.styl', gulp.series(styles));
  gulp.watch('src/**/*.js', gulp.series(scripts, reload));
  gulp.watch('src/**/*.js', gulp.series(gsapAnimations, reload));
  gulp.watch('src/public/**/*.*', gulp.series(publicAssets, reload));
  gulp.watch('src/assets/sprite/*.*', gulp.series(sprite, reload));
};

export default gulp.series(
  clean,
  sprite,
  gulp.parallel(publicAssets, scripts, gsapAnimations, styles),
  pages,
  gulp.parallel(watch, server),
);
