// node.js and gulp
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');

// Load all gulp plugins automatically
// and attach them to the `plugins` object
var plugins = require('gulp-load-plugins')({
    rename: {
        'gulp-ruby-sass': 'sass',
        'gulp-minify-css': 'miniCss'
    }
});
var browserSync = require('browser-sync');
var merge = require('merge-stream');

// Temporary solution until gulp 4
// https://github.com/gulpjs/gulp/issues/355
var runSequence = require('run-sequence');

// package.json
var pkg = require('./package.json');
var filename = {
    css: 'sass-f7',
    js: 'sass-f7'
};


var dirs = pkg['web-config'].dirs;
var time = {
    now: new Date(),
    year: new Date().getFullYear(),
    month: (new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1),
    day: new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate(),
    week: new Date().getDay() < 10 ? "0" + new Date().getDay() : new Date().getDay(),
    hours: new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours(),
    minutes: new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes(),
    seconds: new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds(),
    dateFormat: function () {
        return this.year.toString() + "_" + this.month.toString() + this.day.toString() + "_" + this.week + "_" + this.hours.toString() + this.minutes.toString() + this.seconds.toString()
    }
};
var banner = '/**! Released: ' + time.dateFormat() + ' * Author: ' + pkg.author + '*/';
var buildTime = time.dateFormat();

// framework7 configs
var f7ParentPath = './node_modules/framework7';
var f7Version = require('./' + f7ParentPath + '/package.json').version;
var f7 = {
    less: f7ParentPath + '/src/less',
    scripts: f7ParentPath + '/src/js',
    filename: 'f7',
    jsFiles: [
        './' + f7ParentPath + '/src/js/wrap-start.js',
        './' + f7ParentPath + '/src/js/wrap-start.js',
        './' + f7ParentPath + '/src/js/f7-intro.js',
        './' + f7ParentPath + '/src/js/views.js',
        './' + f7ParentPath + '/src/js/navbars.js',
        './' + f7ParentPath + '/src/js/searchbar.js',
        './' + f7ParentPath + '/src/js/messagebar.js',
        './' + f7ParentPath + '/src/js/xhr.js',
        './' + f7ParentPath + '/src/js/pages.js',
        './' + f7ParentPath + '/src/js/router.js',
        './' + f7ParentPath + '/src/js/modals.js',
        './' + f7ParentPath + '/src/js/panels.js',
        './' + f7ParentPath + '/src/js/lazy-load.js',
        './' + f7ParentPath + '/src/js/material-preloader.js',
        './' + f7ParentPath + '/src/js/messages.js',
        './' + f7ParentPath + '/src/js/swipeout.js',
        './' + f7ParentPath + '/src/js/sortable.js',
        './' + f7ParentPath + '/src/js/smart-select.js',
        './' + f7ParentPath + '/src/js/virtual-list.js',
        './' + f7ParentPath + '/src/js/pull-to-refresh.js',
        './' + f7ParentPath + '/src/js/infinite-scroll.js',
        './' + f7ParentPath + '/src/js/scroll-toolbars.js',
        './' + f7ParentPath + '/src/js/material-tabbar.js',
        './' + f7ParentPath + '/src/js/tabs.js',
        './' + f7ParentPath + '/src/js/accordion.js',
        './' + f7ParentPath + '/src/js/fast-clicks.js',
        './' + f7ParentPath + '/src/js/clicks.js',
        './' + f7ParentPath + '/src/js/resize.js',
        './' + f7ParentPath + '/src/js/forms-storage.js',
        './' + f7ParentPath + '/src/js/forms-ajax.js',
        './' + f7ParentPath + '/src/js/forms-textarea.js',
        './' + f7ParentPath + '/src/js/material-inputs.js',
        './' + f7ParentPath + '/src/js/push-state.js',
        './' + f7ParentPath + '/src/js/swiper-init.js',
        './' + f7ParentPath + '/src/js/photo-browser.js',
        './' + f7ParentPath + '/src/js/picker.js',
        './' + f7ParentPath + '/src/js/calendar.js',
        './' + f7ParentPath + '/src/js/notifications.js',
        './' + f7ParentPath + '/src/js/template7-templates.js',
        './' + f7ParentPath + '/src/js/plugins.js',
        './' + f7ParentPath + '/src/js/init.js',
        './' + f7ParentPath + '/src/js/f7-outro.js',
        './' + f7ParentPath + '/src/js/dom7-intro.js',
        './' + f7ParentPath + '/src/js/dom7-methods.js',
        './' + f7ParentPath + '/src/js/dom7-ajax.js',
        './' + f7ParentPath + '/src/js/dom7-utils.js',
        './' + f7ParentPath + '/src/js/dom7-outro.js',
        './' + f7ParentPath + '/src/js/proto-support.js',
        './' + f7ParentPath + '/src/js/proto-device.js',
        './' + f7ParentPath + '/src/js/proto-plugins.js',
        './' + f7ParentPath + '/src/js/template7.js',
        './' + f7ParentPath + '/src/js/swiper.js',
        './' + f7ParentPath + '/src/js/wrap-end.js'
    ],
    modules: require('./' + f7ParentPath + '/modules.json'),
    pkg: require('./' + f7ParentPath + '/package.json'),
    banner: '/** version：' + f7Version + ' | time：' + buildTime + ' */\n',
    customBanner: '/** version：' + f7Version + ' | custom time：' + buildTime + ' */\n',

};
function addJSIndent(file, t) {
    function addJSIndent(file, t) {
        var addIndent = '        ';
        var filename = file.path.split('./' + f7ParentPath + '/src/js/')[1];
        if (filename === 'wrap-start.js' || filename === 'wrap-end.js') {
            addIndent = '';
        }
        var add4spaces = ('f7-intro.js f7-outro.js proto-device.js proto-plugins.js proto-support.js dom7-intro.js dom7-outro.js template7.js swiper.js').split(' ');
        if (add4spaces.indexOf(filename) >= 0) {
            addIndent = '    ';
        }
        var add8spaces = ('dom7-methods.js dom7-ajax.js dom7-utils.js').split(' ');
        if (add8spaces.indexOf(filename) >= 0) {
            addIndent = '        ';
        }
        if (addIndent !== '') {
            var fileLines = fs.readFileSync(file.path).toString().split('\n');
            var newFileContents = '';
            for (var i = 0; i < fileLines.length; i++) {
                newFileContents += addIndent + fileLines[i] + (i === fileLines.length ? '' : '\n');
            }
            file.contents = new Buffer(newFileContents);
        }
    }
}
gulp.task('f7-custom', function () {
    var modules = process.argv.slice(3);
    modules = modules.toString();
    if (modules === '') {
        modules = [];
    }
    else {
        modules = modules.substring(1).replace(/ /g, '').replace(/,,/g, ',');
        modules = modules.split(',');
    }
    var modulesJs = [];
    var i, module;
    modulesJs.push.apply(modulesJs, f7.modules.core_intro.js);
    for (i = 0; i < modules.length; i++) {
        module = f7.modules[modules[i]];
        if (module.dependencies.length > 0) {
            modules.push.apply(modules, module.dependencies);
        }
    }
    for (i = 0; i < modules.length; i++) {
        module = f7.modules[modules[i]];
        if (!(module)) continue;

        if (module.js.length > 0) {
            modulesJs.push.apply(modulesJs, module.js);
        }
    }
    modulesJs.push.apply(modulesJs, f7.modules.core_outro.js);
    // Unique
    var customJsList = [];
    for (i = 0; i < modulesJs.length; i++) {
        if (customJsList.indexOf(modulesJs[i]) < 0) customJsList.push(modulesJs[i]);
    }
    // JS
    console.log('共加载模块' + modules.length);
    gulp.src(customJsList)
        .pipe(plugins.tap(function (file, t) {
            addJSIndent(file, t);
        }))
        .pipe(plugins.concat(f7.filename + '.js'))
        .pipe(plugins.header(f7.customBanner))
        .pipe(plugins.rename(f7.filename + '.js'))
        .pipe(gulp.dest(dirs.src + '/js/'))
});
gulp.task('f7-scripts', function () {
    gulp.src(f7.jsFiles)
        .pipe(plugins.tap(function (file, t) {
            addJSIndent(file, t);
        }))
        .pipe(plugins.concat(f7.filename + '.js'))
        .pipe(plugins.header(f7.banner))
        .pipe(gulp.dest(dirs.src + '/js/'))
});


// 压缩项目文件，并进行发布
gulp.task('archive:zip', function (done) {
    fs.exists('./archive',function(exists){
        if(!exists) fs.mkdirSync(path.resolve(dirs.archive), '0755');
    });
    var archiveName = path.resolve('./'+dirs.archive, pkg.name + '_v' + pkg.version + '_' + time.dateFormat() + '.zip');
    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
        'cwd': dirs.dist,
        'dot': true // include hidden files
    });
    var output = fs.createWriteStream(archiveName);

    archiver.on('error', function (error) {
        done();
        throw error;
    });

    output.on('close', done);

    files.forEach(function (file) {

        var filePath = path.resolve(dirs.dist, file);

        // `archiver.bulk` does not maintain the file
        // permissions, so we need to add files individually
        archiver.append(fs.createReadStream(filePath), {
            'name': file,
            'mode': fs.statSync(filePath)
        });

    });

    archiver.pipe(output);
    archiver.finalize();

});


// clean
gulp.task('clean', function (done) {
    require('del')([
        dirs.dist
    ], done);
});


/*
 * ====== Develop
 * */

// sass编译
gulp.task('sass', function () {
    return plugins.sass(dirs.src + '/sass/main.scss', {sourcemap: true, noCache: true, style: 'expanded'})
        .on('error', function (err) {
            console.log('Error!', err.message);
        })
        .pipe(plugins.rename(filename.css + '.css'))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(dirs.src + '/css/'))
        .pipe(browserSync.stream({match: '**/*.css'}))
});


// build files
gulp.task('dist:styles', ['sass'], function () {
    gulp.src(dirs.src + '/css/*.css')
        .pipe(plugins.autoprefixer())
        .pipe(plugins.miniCss({
            advanced: false,
            aggressiveMerging: false
        }))
        .pipe(plugins.header(banner))
        .pipe(gulp.dest(dirs.dist + '/css/'))
});

gulp.task('dist:scripts', function () {
    gulp.src(dirs.src + '/js/lib/*')
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dirs.dist + '/js/lib/'));

    gulp.src(dirs.src + '/js/*.js')
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dirs.dist + '/js/'))
});

gulp.task('dist:misc', function () {
    return gulp.src([
        dirs.src + '/**/*',

        '!' + dirs.src + '/js/',
        '!' + dirs.src + '/js/*',
        '!' + dirs.src + '/js/lib/*',
        '!' + dirs.src + '/js/lib/',
        '!' + dirs.src + '/css/*.css',
        '!' + dirs.src + '/sass/*',
        '!' + dirs.src + '/sass/',
        '!' + dirs.src + '/sass/**/*',
        '!' + dirs.src + '/framework7/',
        '!' + dirs.src + '/framework7/**/*'


    ], {
        dot: true
    }).pipe(gulp.dest(dirs.dist))
});


// 复制依赖资源库文件

gulp.task('copy:sass-f7', function () {
    return gulp.src('bower_components/sass-f7/sass/**/*', {
        dot: true
    }).pipe(gulp.dest(dirs.src + '/sass'))
});
gulp.task('copy:framework7', function () {
    return gulp.src(['node_modules/framework7/src/**/*', 'node_modules/framework7/src/{modules.json,package.json}'], {
        dot: true
    })
        .pipe(gulp.dest('framework7/'))
});
gulp.task('copy:requirejs', function () {
    return gulp.src('bower_components/requirejs/require.js', {
        dot: true
    })
        .pipe(gulp.dest(dirs.src + '/js'))
});


// 主任务

gulp.task('copy', ['copy:sass-f7', 'copy:requirejs']);

gulp.task('archive', function (done) {
    runSequence(['clean'],
        'dist',
        'archive:zip',
        done)
});

gulp.task('reload', ['sass'], function () {
    browserSync.init({
        server: {
            baseDir: ['src', 'dist']
        },
        files: [dirs.src + '/images/**/*', dirs.src + '/js/**/*', dirs.src + '/*.html', dirs.src + '/fonts/*']
    });
    gulp.watch([dirs.src + '/sass/**/*', dirs.src + '/sass/main.scss'], ['sass']);
});

gulp.task('dist', function (done) {
    runSequence(
        ['clean'],
        'dist:scripts',
        'dist:styles',
        'dist:misc',
        done);
});

gulp.task('default', ['init']);
