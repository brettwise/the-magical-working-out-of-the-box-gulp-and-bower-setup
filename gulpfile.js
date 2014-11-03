  /*!
 * gulp
 */

// Load modules
var gulp         = require('gulp'),
    es           = require('event-stream'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    glob         = require('glob'),
    livereload   = require('gulp-livereload'),
    gutil        = require('gulp-util'),
    del          = require('del'),
    uncss        = require('gulp-uncss'),
    rev          = require('gulp-rev'),
    size         = require('gulp-size'),
    bowerFiles   = require('bower-files')();

// Set Path and file variables here. 

  // The HTML Files to Interate Through When UnCSSing.
  // Notice you have to use glob as unCSS doesn't handle globbing.
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

// Where all the magic happens.

  // All the CSS things.
gulp.task('css', function() {
  var appScssFiles = gulp.src(myFiles.styles)
  .pipe(sass())
  .on('error', function(err){
    new gutil.PluginError('CSS', err, {showStack: true});
  });

  return es.concat(gulp.src(bowerFiles.css), appScssFiles)
    .pipe(concat('main.min.css'))
    .pipe(size({title: 'CSS Before'}))
    // .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(uncss({
              html: glob.sync(htmlToUnCSS.folderToCheck)
          }))
    .pipe(minifycss())
    .pipe(size({title: 'CSS After'}))
    .pipe(gulp.dest(paths.styles.dest))
    // .pipe(notify({ message: 'App & Vendor styles processed.' }));
});

  // All the JS processing.
gulp.task('js', function() {
  gulp.src(bowerFiles.js.concat(myFiles.scripts))
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    // .pipe(rev())
    .pipe(gulp.dest(paths.scripts.dest))
    // .pipe(rev.manifest())
    // .pipe(notify({ message: 'JS stuff done.' }));
});

  // Images Processing
gulp.task('img', function() {
  gulp.src(myFiles.images)
    .pipe(size({title: 'IMG Before'}))
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(size({title: 'IMG After'}))
    .pipe(gulp.dest(paths.images.dest))
    // .pipe(notify({ message: 'Image shit complete' }));
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
    gulp.start('css', 'js', 'img', 'copy_fonts');
});

// Watch CSS, JS, IMG, and font files.
gulp.task('watch', function() {
  gulp.watch([myFiles.styles, bowerFiles.css], ['css']);
  gulp.watch([myFiles.scripts, bowerFiles.js], ['js']);
  gulp.watch(paths.images.src + '**/*', ['img']);
  gulp.watch(paths.fonts.src + '*.{ttf,woff,eof,svg}', ['copy_fonts']);
  // Create LiveReload server
  livereload.listen();
  // Watch any files in static/, reload on change
  gulp.watch([basePaths.dest + '**']).on('change', livereload.changed);
});
