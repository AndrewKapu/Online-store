let gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglifyes'),
    autoPrefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    bs = require('browser-sync'),
    htmlMin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
    delFiles = require('del'),
    cssMin = require('gulp-csso');

const paths = {
    devHtml: 'app/html/**/*.html',
    devSass: 'app/scss/**/*.scss',
    devJs: 'app/js/**/*.js', 
    project: 'dist',
    projectCss: 'dist/css',
    projectJs: 'dist/js',
    devLibs: 'app/libs',
    projectLibs: 'dist/libs',
    devImg: 'app/img/**/*',
    projectImg: 'dist/img'
};

gulp.task('test', () => {
    return console.log('Gulp works!');
});

gulp.task('html', () => {
    return gulp.src(paths.devHtml)
        .pipe(htmlMin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(paths.project))
});

gulp.task('img', () => {
    return gulp.src(paths.devImg)
        .pipe(gulp.dest(paths.projectImg))
});

gulp.task('sass', () => {
    return gulp.src(paths.devSass)
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssMin())
        .pipe(gulp.dest(paths.projectCss))
});

gulp.task('js:es6', () => {
    return gulp.src(paths.devJs)
        .pipe(gulp.dest(paths.projectJs))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.projectJs))
});

gulp.task('libsToDist', () => {
    return gulp.src(paths.devLibs + '/**')
        .pipe(gulp.dest(paths.projectLibs))
});

gulp.task('clean', () => {
   return delFiles(['dist/**', '!dist'])
});

gulp.task('server', () => {
    return bs({
        browser: 'firefox',
        server: {
            baseDir: 'dist'
        }
    })
 });

 gulp.task('sass:watch', () => {
    return gulp.watch('app/scss/**/*.scss', gulp.series('sass', (done) => {
        bs.reload();
        done();
    }))
 });

 gulp.task('js:watch', () => {
    return gulp.watch('app/js/**/*.js', gulp.series('js:es6', (done) => {
        bs.reload();
        done();
    }))
 });

gulp.task('html:watch', () => {
    return gulp.watch('app/html/**/*.html', gulp.series('html', (done) => {
        bs.reload();
        done();
    }))
});



gulp.task('default', gulp.series('clean', gulp.parallel('html', 'sass', 'js:es6', 'server', 'sass:watch', 'html:watch', 'js:watch', 'libsToDist', 'img')));
