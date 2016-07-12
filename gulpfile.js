//process.env.DISABLE_NOTIFIER = true; // U&ncomment to disables all notifications

var fileinclude = require('gulp-file-include'), // Include partials
    gulp = require('gulp'), // Gulp
    sass = require('gulp-sass'), // Libsass Pre-processor
    autoprefixer = require('gulp-autoprefixer'), // Autoprefixes CSS using regular CSS
    jshint = require('gulp-jshint'), // Lint your JS on the fly
    stylish = require('jshint-stylish'), // Style your jshint results
    uglify = require('gulp-uglify'), // JS minification
    imagemin = require('gulp-imagemin'), // Compress Images
    newer = require('gulp-newer'), // A Gulp plugin for passing through only those source files that are newer than corresponding destination files.
    rename = require('gulp-rename'), // Rename files i.e. in this case rename minified files to .min
    replace = require('gulp-replace'), // A string replace plugin for gulp
    concat = require('gulp-concat'), // Merges all files in to 1
    notify = require('gulp-notify'), // Notifications upon task completion
    sourcemaps = require('gulp-sourcemaps'), // Line numbers pointing to your SCSS files
    del = require('del'), // Clean folders of files
    htmlclean = require('gulp-htmlclean'), // Minify HTML
    neat = require('node-neat').includePaths, // The Bourbon Neat grid system
    browserSync = require('browser-sync'), // Live reloading
    scsslint = require('gulp-scss-lint'), // SCSS Linting
    ext_replace = require('gulp-ext-replace'), // Small gulp plugin to change a file's extension
    merge = require('merge-stream'), // Create a stream that emits events from multiple other streams
    cleanCSS = require('gulp-clean-css'), // Replaces css-nano, this will also combine MQs
    fontmin = require('gulp-fontmin'), // Font minification - Also generates CSS
    svgmin = require('gulp-svgmin'), // Optimise SVGs
    htmlv = require('gulp-html-validator'), // Validate HTML
    reload = browserSync.reload;

// Format
var fileFormat = 'html',
    fileExt = '.' + fileFormat;

// **********************
// *** Required Tasks ***
// **********************

// $ browser-sync - Initialise static Browser Sync server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: "./",
        //proxy: 'website-proxy.dev',
        //port: 3000,
        files: '*.css' // Inject CSS changes
    });
});

// $ gulp bs-reload - Browser Sync
gulp.task('bs-reload', function() {
    browserSync.reload();
    return gulp.src('*' + fileExt)
        .pipe(notify({
            message: 'Reload complete',
            onLast: true
        }));
});

// $ gulp sass
gulp.task('sass', function() {
    return gulp.src('./src/styles/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: ['src/styles/*.scss'].concat(neat)
        }))
        .on('error', notify.onError(function(error) {
            return 'An error occurred while compiling sass.\nLook in the console for details.\n' + error;
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({ debug: true }, function(details) {
            console.log(details.name + ' file size before: ' + details.stats.originalSize + ' bytes');
            console.log(details.name + ' file size after: ' + details.stats.minifiedSize + ' bytes');
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(''))
        .pipe(notify({
            message: 'SASS task complete',
            onLast: true
        }));
});

// $ gulp scripts
gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .on('error', notify.onError(function(error) {
            return 'An error occurred while compiling JS.\nLook in the console for details.\n' + error;
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(reload({
            stream: true
        }))
        .pipe(notify({
            message: 'Scripts task complete',
            onLast: true
        }));
});

// $ gulp fileinclude (Also runs HTML CLean)
gulp.task('fileinclude', function() {
    gulp.src(['src/components/*' + fileExt, 'src/components/templates/*' + fileExt])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .on('error', notify.onError(function(error) {
            return 'An error occurred while compiling files.\nLook in the console for details.\n' + error;
        }))
        .pipe(htmlclean({
            protect: /<\!--%fooTemplate\b.*?%-->/g,
            edit: function(html) {
                return html.replace(/\begg(s?)\b/ig, 'omelet$1');
            }
        }))
        // Remove underscore filename prefix using regular expression
        .pipe(rename(function(opt) {
            opt.basename = opt.basename.replace(/_/g, '');
            return opt;
        }))
        .pipe(gulp.dest(''))
        .pipe(replace(/_/g, ''))
        .pipe(htmlv({ format: fileFormat }))
        .pipe(gulp.dest('./reports/markup-validation/'))
        .pipe(reload({
            stream: true
        }))
        .pipe(notify({
            message: 'Include files task complete',
            onLast: true
        }));
});

// $ gulp images - Image compression (Don't forget to use save for web in PS first!)
gulp.task('images', function() {
    return gulp.src('src/images/**/*.{png,jpg,gif}')
        .pipe(newer('dist/assets/img'))
        .pipe(imagemin({
            optimizationLevel: 7,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({
            message: 'Images optimised',
            onLast: true
        }));
});

// $ gulp svgs - Optimise SVGs
gulp.task('svgs', function() {
    return gulp.src('src/images/svgs/**/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('dist/assets/img/svg'))
        .pipe(notify({
            message: 'SVGs minified',
            onLast: true
        }));
});

// $ gulp fonts
gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(fontmin())
        .pipe(gulp.dest('dist/assets/fonts'))
        .pipe(notify({
            message: 'Fonts minified',
            onLast: true
        }))
        .pipe(reload({
            stream: true
        }));
});

// $ gulp docs
gulp.task('docs', function() {
    return gulp.src('src/docs/**/*')
        .pipe(gulp.dest('dist/assets/docs'))
        .pipe(notify({
            message: 'Documents task complete',
            onLast: true
        }))
        .pipe(reload({
            stream: true
        }));
});

// $ gulp favicons
gulp.task('favicons', function() {
    return gulp.src('src/favicons/**/*')
        .pipe(gulp.dest('dist/assets/favicons'))
        .pipe(notify({
            message: 'Favicons task complete',
            onLast: true
        }))
        .pipe(reload({
            stream: true
        }));
});

// $ gulp watch - This is everything that's being watched when you run the default task
gulp.task('watch', function() {
    gulp.watch('src/components/**/*' + fileExt, ['fileinclude']);
    gulp.watch('src/styles/**/*.scss', ['sass']);
    gulp.watch('src/scripts/**/*.js', ['scripts'], ['bs-reload']);
    gulp.watch('src/images/**/*', ['images']);
    gulp.watch('src/images/svgs/**/*', ['svgs']);
    gulp.watch('src/fonts/**/*', ['fonts']);
    gulp.watch('src/favicons/**/*', ['favicons']);
    gulp.watch('src/docs/**/*', ['docs']);
    gulp.watch('*' + fileExt, ['bs-reload']);
});

// $ gulp - Default task
gulp.task('default', ['fileinclude', 'sass', 'scripts', 'images', 'fonts', 'docs', 'favicons', 'browser-sync', 'watch']);



// **********************
// ***** Misc Tasks *****
// **********************

// $ gulp qs - Quick start task
gulp.task('qs', ['browser-sync', 'watch']);

// $ clean - Emptys everything in the distribution folders and the HTML in the root
gulp.task('clean', function() {
    del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img', 'maps', 'reports', '*' + fileExt, 'dist/assets/fonts', 'src/styles/_svg-symbols.scss']);
    return gulp.src("./")
        .pipe(notify({
            message: 'Folders cleaned successfully',
            onLast: true
        }));
});

// $ replace - Rename suffix e.g. change all *.html files to *.php and then delete original files
var oldExt = '.php',
    newExt = '.html',
    folders = [
        'src/components/',
        'src/components/templates/',
        'src/components/templates/partials/',
        'src/components/templates/partials/modules/',
        'src/components/templates/partials/svgs/'
    ];

gulp.task('replace', function() {
    var tasks;

    function replaceRename() {
        tasks = folders.map(function(element) {
            return gulp.src(element + '*' + oldExt)
                .pipe(ext_replace(newExt))
                .pipe(gulp.dest(element))
        });
    }

    function replaceMerge() {
        return merge(tasks);
    }

    function replaceDelete() {
        del([
            'src/components/*' + oldExt,
            'src/components/templates/*' + oldExt,
            'src/components/templates/partials/*' + oldExt,
            'src/components/templates/partials/modules/*' + oldExt,
            'src/components/templates/partials/svgs/*' + oldExt
        ]);
        return gulp.src("./")
            .pipe(notify({
                message: 'Files suffix changed from *' + oldExt + ' to *' + newExt,
                onLast: true
            }));
    }

    replaceRename();
    replaceMerge();
    // Timeout to ensure renaming is complete before deleting original files
    setTimeout(function() {
        replaceDelete();
    }, 2500);
});

// $ scss-lint - SCSS Linter
gulp.task('scss-lint', function() {
    return gulp.src(['./src/styles/*/**.scss', '!./src/styles/vendors/*.scss'])
        .pipe(scsslint({
            'reporterOutputFormat': 'Checkstyle',
            'filePipeOutput': 'scssReport.xml',
            'config': 'scss-lint.yml'
        }))
        .pipe(gulp.dest('./reports'))
});
