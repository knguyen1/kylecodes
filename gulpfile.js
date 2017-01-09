/**
 * Created by Khoa on 1/7/2017.
 */

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const babel = require('gulp-babel');

// gulp.task('es6', () => {
//     return gulp.src('src/*.js')
//         .pipe(sourcemaps.init())
//         .pipe(babel({
//             presets: ['env']
//         }))
//         .pipe(concat("app.js"))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('public/js/'));
// });

gulp.task('es60', () => {
    return gulp.src('src/app/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js/'));
});

gulp.task('es61', () => {
    return gulp.src('src/flashcards/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('flashcards.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js/'));
});

// gulp.task('react', () => {
//     return gulp.src('src/randomair/randomair.jsx')
//         .pipe(sourcemaps.init())
//         .pipe(babel({
//             presets: ['env'],
//             plugins: ['transform-react-jsx']
//         }))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('public/js/'));
// })

// gulp.task('randomair', () => {
//     const b = browserify({
//         entries: 'src/randomair/randomair.jsx',
//         debug: true,
//         transform: [babelify.configure({
//             presets: ['env']
//         })]
//     });
//
//     return b.bundle()
//         .pipe(source('src/randomair/randomair.jsx'))
//         .pipe(buffer())
//         .pipe(sourcemaps.init({ loadMaps: true }))
//         // Add other gulp transformations (eg. uglify) to the pipeline here.
//         .on('error', util.log)
//         .pipe(sourcemaps.write('./'))
//         .pipe(gulp.dest('public/js/'));
// })

gulp.task('default', ['es60', 'es61'],() => {
    gulp.watch('src/app/*.js', ['es60']);
    gulp.watch('src/flashcards/*.js', ['es61']);
    // gulp.watch('src/randomair/*.jsx', ['randomair']);
});