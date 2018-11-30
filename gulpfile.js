// general
let gulp = require('gulp');

// shared
let concat = require('gulp-concat');
let rename = require('gulp-rename');
let del = require('del');
let rimraf = require('gulp-rimraf');

// css
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let cssnano = require('gulp-cssnano');

//css style linter
let gulpStylelint = require('gulp-stylelint');

// js
let uglify = require('gulp-uglify-es').default;
let eslint = require('gulp-eslint');
let babel = require('gulp-babel');
//let minify = require('gulp-js-minify');

// postcss
let postcss = require('gulp-postcss');
let autoprefixer = require('autoprefixer');
let mqpacker = require('css-mqpacker');

//sprites svg
let svgmin = require('gulp-svgmin');
let svgSymbols = require('gulp-svg-symbols');



/* ==========================================================================
#SVG
========================================================================== */
gulp.task('clean:svg', function(cb) {
  return del([
    './dest/svg/**'
  ], cb);
});

gulp.task('svg', ['clean:svg'], function() {
  return gulp.src('./assets/svg/*.svg')
    .pipe(svgmin())
    .pipe(svgSymbols({
      templates: ['default-svg']
    }))
    .pipe(rimraf())
    .pipe(rename('icons.svg'))
    .pipe(gulp.dest('./dest/svg'));
});

/* ==========================================================================
#PostCSS plugins saved in variable
========================================================================== */
let processors = [
  autoprefixer({
    browsers: ['last 3 versions', 'IE 10', 'IE 11'],
    cascade: false
  }),
  mqpacker
]

/* ==========================================================================
#CSS
========================================================================== */
gulp.task('styles', function() {
  return gulp.src('./scss/styles.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(cssnano({
      zindex: false
    }))
    .pipe(rename('styles.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dest/css'));
});

/* ==========================================================================
#CSS Lint
========================================================================== */
gulp.task('css-lint', function() {
  return gulp.src([
    './scss/**/*.scss'
    ])
    .pipe(gulpStylelint({
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
});

/* ==========================================================================
#Javascript
========================================================================== */
gulp.task('scripts', function() {
  return gulp.src([
      './js/slick.min.js',
      './js/chosen.jquery.min.js',
      './js/jquery.mousewheel.js',
      './js/jquery.mCustomScrollbar.js',
      './js/main.js'
    ])
    //.pipe(minifyjs())
    .pipe(concat('scripts.min.js'))
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(gulp.dest('./dest/js'))
})

/* ==========================================================================
#JS Lint
========================================================================== */
gulp.task('js-lint', () => {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['./js/main.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError())
})

/* ==========================================================================
#All ready for production
========================================================================== */
gulp.task('p', ['svg', 'styles', 'css-lint', 'scripts', 'js-lint']);

/* ==========================================================================
#Watch
========================================================================== */
gulp.task('watch', ['styles', 'scripts'], function() {
  gulp.watch('scss/**/*.scss', ['styles'])
  gulp.watch('js/*.js', ['scripts'])
})

/* ==========================================================================
#Default
========================================================================== */
gulp.task('default', ['watch'])
