const gulp = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const browserSync = require('browser-sync')

// 引入gulp-sass并指定sass编译器（sass或node-sass）
const sass = require('gulp-sass')(require('sass'))

//需要自动编译的文件
const filePath = {
    sass:'./src/sass/*.scss',
    js:'./src/js/*.js',
    html:'./src/**/*.html',
    css:'./src/css/*.css'
}

// 创建任务 sass->css 依赖：gulp-sass+sass
const compileSass = function(done){
    // 匹配文件
    gulp.src(filePath.sass)

    // 编译处理 
    .pipe(sass({
        // outputStyle:'compressed'//expanded(展开，默认)
    }).on('error',sass.logError))

    // 输出
    .pipe(gulp.dest('./src/css'))

    done()
}

// 创建任务 es6->es5 依赖：gulp-babel+@babel/core+babel/preset-env
const compileJS = function(done){
    // 匹配文件
    gulp.src(filePath.js)

    //编译处理
    .pipe(babel({
        presets:["@babel/preset-env"]
    }))

    // 合并:gulp-concat
    .pipe(concat('all.js'))

    // 输出：未压缩
    .pipe(gulp.dest('./src/js'))

    // 压缩：gulp-uglify
    .pipe(uglify())

    // 重命名：gulp-rename
    .pipe(rename({
        //dirname:"main/text/ciao",
        // basename:"aloha",
        // prefix:"page-",//page-all.js
        // extname:".md"
        suffix:".min"//all.min.js
    }))

    .pipe(gulp.dest('./src/js'))

    done()
}

// 将编译后导出
exports.compileSass = compileSass;
exports.compileJS = compileJS;

// 默认任务
// 调用方式：gulp
exports.default = function(){
    console.log('default');

    // 监听sass
    gulp.watch(filePath.sass,compileSass)

    gulp.watch(filePath.js,compileJS)

    // 开启一个本地服务器
    // 监听所有文件修改，浏览器自动刷新
    browserSync({
        // 监听src目录
        server:'./src',

        // 代理服务器node服务器
        // proxy:'http://localhost:2108'

        // 监听端口
        port:10086,

        // 监听文件类型
        files:[filePath.css,filePath.html,filePath.js]
    })
}