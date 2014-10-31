/*!
 * gulp
 */

// Load plugins
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

// Styles
gulp.task('css', function() {
  gulp.src(myFiles.styles)
    .pipe(sass())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(rev())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rev.manifest())
    .pipe(notify({ message: 'CSS shit done' }));
});

// Compile copy and minify vendor styles
gulp.task('cssven', function() {
  gulp.src(bowerFiles.css)
    .pipe(sass())
    .pipe(concat('vendor.min.css'))
    .pipe(minifycss())
    .pipe(uncss({
            html: [htmlToUnCSS.folderToCheck]
        }))
    .pipe(rev())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(rev.manifest())
    .pipe(notify({ message: 'That vendor SCSS & CSS shit is done'}));
});

// Scripts
gulp.task('js', function() {
  gulp.src(myFiles.scripts)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(rev.manifest())
    .pipe(notify({ message: 'JS shit finished' }));
});

// Copy and minify vendor javascript
gulp.task('jsven', function() {
  gulp.src(bowerFiles.js)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(rev.manifest())
    .pipe(notify({ message: 'JS vendor shit copied' }));
});

// Images
gulp.task('img', function() {
  gulp.src(myFiles.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(notify({ message: 'Image shit complete' }));
});

// Fonts
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

  // Watch my .scss files
  gulp.watch(myFiles.styles, ['css']);

  //Watch vendor styles
  gulp.watch(bowerFiles.css, ['cssven']);
  // gulp.watch('assets/styles/scss/vendor/*.scss', ['cssven']);

  // Watch my .js files
  gulp.watch(myFiles.scripts, ['js']);

  // Watch .js vendor files
  gulp.watch(bowerFiles.js, ['jsven']);

  // Watch image files
  gulp.watch(paths.images.src + '**/*', ['img']);

  //Watch fonts
  gulp.watch(paths.fonts.src + '*.{ttf,woff,eof,svg}', ['copy_fonts']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in static/, reload on change
  gulp.watch([basePaths.dest + '**']).on('change', livereload.changed);

});