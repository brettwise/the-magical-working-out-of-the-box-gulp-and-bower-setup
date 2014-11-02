/*!
 * gulp
 */

// Load modules
var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    livereload   = require('gulp-livereload'),
    del          = require('del'),
    uncss        = require('gulp-uncss'),
    rev          = require('gulp-rev'),
    bowerFiles   = require('bower-files')();

// Path and file variables

  // The HTML Files to Interate Through When UnCSSing
var htmlToUnCSS = {
  folderToCheck: '../*.html'
};

  // Duh, base paths
var basePaths = {
  src: 'src/',
  dest: 'dest/'
};

  // Paths to file specific directories
var paths = {
  images: {
    src: basePaths.src + 'img/',
    dest: basePaths.dest + 'img/'
  },
  scripts: {
    src: basePaths.src + 'js/',
    dest: basePaths.dest + 'js/'
  },
  styles: {
    src: basePaths.src + 'scss/',
    dest: basePaths.dest + 'css/'
  },
  fonts: {
    src: basePaths.src + 'fonts/',
    dest: basePaths.dest + 'fonts/'
  }
};

// The asset files themselves!
var myFiles = {
  styles: paths.styles.src + '*.scss',
  scripts: paths.scripts.src + '**/*.js',
  images: paths.images.src + '**/*.{jpg,svg,png}',
  fonts: paths.fonts.src + '**/*.{ttf,woff,eof,svg}'
};

// All the CSS things.
gulp.task('css', function() {
  gulp.src([
    bowerFiles.css,
    myFiles.styles 
    ])
    .pipe(concat('main.min.css'))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sass())
    .pipe(minifycss())
    .pipe(uncss({
              html: [htmlToUnCSS.folderToCheck]
          }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(notify({ message: 'CSS app & vendor styles processed.'}));
});

// All the JS processing.
gulp.task('js', function() {
  gulp.src([
    bowerFiles.js,
    myFiles.scripts
    ])
    .pipe(concat('main.min.js'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(unglify())
    // .pipe(rev())
    .pipe(gulp.dest(paths.scripts.dest))
    // .pipe(rev.manifest())
    .pipe(notify({ message: 'JS stuff done.' }));
});

// Images Processing
gulp.task('img', function() {
  gulp.src(myFiles.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(notify({ message: 'Image shit complete' }));
});

// Font Processing
gulp.task('copy_fonts', function() {
  gulp.src(myFiles.fonts)
  .pipe(gulp.dest(paths.fonts.dest));
});

// Clean
gulp.task('clean', function(cb) {
    del([paths.styles.dest, paths.scripts.dest, paths.images.dest], cb);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('css', 'cssven', 'js', 'jsven', 'img', 'copy_fonts');
});

// Watch
gulp.task('watch', function() {

  // Watch CSS
  gulp.watch([myFiles.styles, bowerFiles.css], ['css']);

  // Watch JS
  gulp.watch([myFiles.scripts, bowerFiles.js], ['js']);

  // Watch image files
  gulp.watch(paths.images.src + '**/*', ['img']);

  //Watch fonts
  gulp.watch(paths.fonts.src + '*.{ttf,woff,eof,svg}', ['copy_fonts']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in static/, reload on change
  gulp.watch([basePaths.dest + '**']).on('change', livereload.changed);

});