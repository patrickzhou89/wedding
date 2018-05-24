let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
let sass = require('gulp-sass');
let runSequence = require('run-sequence');
let del = require('del');
let useref = require('gulp-useref');
let gulpIf = require('gulp-if');
let uglify = require('gulp-uglify');
let cachebust = require('gulp-cache-bust');

gulp.task('useref',()=> {
    return gulp.src('app/*.html')
	.pipe(useref())
	.pipe(gulpIf('*.js',uglify()))
        .pipe(gulpIf('*.css',cleanCSS()))
        .pipe(cachebust({
	    type: 'timestamp'
	}))
	.pipe(gulp.dest('dist'));
});

gulp.task('sass',()=>{
    return gulp.src('app/styles/css/*.scss')
	.pipe(sass())
	.pipe(gulp.dest('app/styles/css'))
});
    
gulp.task('build',()=>{
    gulp.src("app/styles/images/**")
	.pipe(gulp.dest('dist/styles/images'));
    gulp.src("app/styles/fonts/**")
        .pipe(gulp.dest('dist/styles/fonts'));
});
gulp.task('clean',()=>{
    return del.sync('dist');
});

gulp.task('dist',(callback)=>{
    runSequence(['clean','sass'],'useref','build', callback)
});
