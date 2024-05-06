const { src, dest, series, watch } = require(`gulp`),
    CSSLinter = require(`gulp-stylelint`), //need (install stylelint via npm i -D style)
    babel = require(`gulp-babel`), //need will transpile code from es6 -> es5
    htmlCompressor = require(`gulp-htmlmin`), //need
    cleanCSS = require(`gulp-clean-css`), //need
    jsCompressor = require(`gulp-uglify`),
    jsLinter = require(`gulp-eslint`),
    browserSync = require(`browser-sync`),
    reload = browserSync.reload;

let browserChoice = `default`;

///NEEDED FOR DEV
let lintJS = () => {
    return src(`dev/js/app.js`)
        .pipe(jsLinter(`.eslintrc`))
        .pipe(jsLinter.formatEach(`compact`));
};

let lintCSS = () => {
    return src(`dev/css/style.css`)
        .pipe(CSSLinter({
            failAfterError: false,
            reporters: [
                {formatter: `string`, console: true}
            ]
        }));
};

let transpileJSForDev = () => {
    return src(`dev/js/app.js`)
        .pipe(babel())
        .pipe(dest(`temp/js`));
};

let compileCSSForDev = (`minify-css`, () => {
    return src(`dev/css/style.css`)
        .pipe(cleanCSS())
        .pipe(dest(`temp/css`));
});

let copyUnprocessedAssetsForDev = () => {
    return src([
        `dev/html/index.html`    // index.html
    ], {dot: true})
        .pipe(dest(`temp`));
};

///NEEDED FOR PROD
let transpileJSForProd = () => {
    return src(`dev/js/app.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(dest(`prod/js`));
};

let compressHTML = () => {
    return src([`dev/html/index.html`])
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`prod`));
};

let compileCSSForProd = (`minify-css`, () => {
    return src(`dev/css/style.css`)
        .pipe(cleanCSS())
        .pipe(dest(`prod/css`));
});

//server is made up of the temp folder, dev folder, and HTML inside the dev folder (line 84-87)
let serve = () => {
    browserSync({
        notify: true,
        reloadDelay: 50,
        browser: browserChoice,
        server: {
            baseDir: [
                `temp`,
            ]
        }
    });
    watch(`dev/html/index.html`)
        .on(`change`, reload);

    watch(`dev/js/app.js`, series(lintJS, transpileJSForDev))
        .on(`change`, reload);

    watch(`dev/css/style.css`, series(lintCSS, compileCSSForDev))
        .on(`change`, reload);

};


exports.compressHTML = compressHTML;
exports.lintJS = lintJS;
exports.lintCSS = lintCSS;
exports.transpileJSForDev = transpileJSForDev;
exports.compileCSSForDev = compileCSSForDev;
exports.copyUnprocessedAssetsForDev = copyUnprocessedAssetsForDev;
exports.transpileJSForProd = transpileJSForProd;
exports.compileCSSForProd = compileCSSForProd;
exports.serve = series(
    copyUnprocessedAssetsForDev,
    lintJS,
    lintCSS,
    compileCSSForDev,
    transpileJSForDev,
    serve
);

exports.build = series(
    compressHTML,
    transpileJSForProd,
    compileCSSForProd
);
