var gulp = require('gulp');
var postcss = require('gulp-postcss');
var pxtounits = require('postcss-px2units');
gulp.task('css', function () {
    return gulp.src(['miniprogram_npm/@vant/weapp/**/*.wxss'])
        .pipe(postcss([pxtounits({
            multiple: 2,
            targetUnits: 'rpx'
        })]))
        .pipe(gulp.dest('miniprogram_npm/@vant/weapp/'));
});