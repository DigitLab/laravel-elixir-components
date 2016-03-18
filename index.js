var gulp            = require('gulp');
var extend          = require('extend');
var flatten         = require('gulp-flatten');
var inlineSource    = require('gulp-inline-source');
var Elixir          = require('laravel-elixir');

var $ = Elixir.Plugins;
var config = Elixir.config;

/*
 |----------------------------------------------------------------
 | Component Compilation Task
 |----------------------------------------------------------------
 |
 | This task will compile your html web components.
 |
 */

Elixir.extend('components', function(src, output, options) {
    config.components = extend({
        folder: 'components',
        buildFolder: 'components'
    }, config.components || {});

    options = extend({
        handlers: defaultHandler
    }, options || {});

    var paths = prepGulpPaths(src, output);

    new Elixir.Task('components', function() {
        this.log(paths.src, paths.output);

        return gulp
            .src(paths.src.path)
            .pipe(inlineSource(options))
            .pipe(flatten())
            .pipe(gulp.dest(paths.output.baseDir))
            .pipe(new Elixir.Notification('Components Compiled!'));
    })
        .watch(paths.src.path);
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
var prepGulpPaths = function(src, output) {
    src = Array.isArray(src) ? src : [src];

    return new Elixir.GulpPaths()
        .src(src, config.get('assets.components.folder'))
        .output(output || config.get('public.components.buildFolder'));
};

/**
 * The default handler for inlining components.
 *
 * @param  {string|Array} src
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
var defaultHandler = function(source, context, next) {
    if (source.type == 'js') {
        gulp.src(source.filepath)
            .pipe($.babel(config.js.babel.options))
            .on('error', function(e) {
                new Elixir.Notification().error(e, 'Babel Compilation Failed!');
                this.emit('end');
            })
            .pipe($.if(config.production, $.uglify({compress: { drop_console: true }})))
            .on('data', function(file) {
                source.content = String(file.contents);
                next();
            });
    } else if (source.type == 'css') {
        switch (source.extension) {
            case 'css':
                compileCss(source, context, next);
                break;

            case 'less':
                compileLess(source, context, next);
                break;

            case 'scss':
                compileSass(source, context, next);
                break;
        }

    } else {
        next();
    }
};

var compileCss = function(source, context, next) {
    gulp.src(source.filepath)
        .pipe($.autoprefixer())
        .pipe($.if(config.production, $.cssnano(config.css.cssnano.pluginOptions)))
        .on('data', function(file) {
            source.content = String(file.contents);
            source.tag = 'style';
            next();
        });
};

var compileLess = function(source, context, next) {
    gulp.src(source.filepath)
        .pipe($.less(config.css.less.pluginOptions))
        .pipe($.autoprefixer())
        .pipe($.if(config.production, $.cssnano(config.css.cssnano.pluginOptions)))
        .on('data', function(file) {
            source.content = String(file.contents);
            source.tag = 'style';
            next();
        });
};

var compileSass = function(source, context, next) {
    gulp.src(source.filepath)
        .pipe($.sass(config.css.sass.pluginOptions))
        .pipe($.autoprefixer())
        .pipe($.if(config.production, $.cssnano(config.css.cssnano.pluginOptions)))
        .on('data', function(file) {
            source.content = String(file.contents);
            source.tag = 'style';
            next();
        });
};