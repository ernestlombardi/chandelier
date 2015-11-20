"use strict";

var browserSync = require("browser-sync");
var del = require("del");
var gulp = require("gulp");
var concat = require("gulp-concat");
var htmlreplace = require("gulp-html-replace");
var jasmine = require("gulp-jasmine");
var jshint = require("gulp-jshint");
var less = require("gulp-less");
var ngHtml2Js = require("gulp-ng-html2js");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var gutil = require("gulp-util");
var zip = require("gulp-zip");
var karma = require("karma");
var karmaParseConfig = require("karma/lib/config").parseConfig;
var path = require("path");
var proxy = require("proxy-middleware");
var url = require("url");

gulp.task("clean", function () {
    del([
        "dist",
        ".tmp",
        "templates"
    ]);
});

gulp.task("lint", function () {
    return gulp.src(["webclient/scripts/**/*.js",
            "!webclient/scripts/*-spec.js",
            "webclient/components/**/*.js",
            "!webclient/components/**/*-spec.js"])
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("default"));
});

// Process LESS files
gulp.task("less", function () {
    gulp.src(["styles/*.less",
            "node_modules/angular-material/angular-material.min.css",
            "webclient/components/**/*.less",
            "webclient/scripts/**/*.less"])
        .pipe(less())
        .pipe(concat("style.css"))
        .pipe(gulp.dest(".tmp/styles"))
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest(".tmp/styles"));
});

// Copy local source to .tmp directory for pre-processing
gulp.task("copy", function () {
    gulp.src("webclient/components/**/*.html")
        .pipe(gulp.dest(".tmp/components"));
    gulp.src("webclient/images/**/*.*")
        .pipe(gulp.dest(".tmp/images"));
    gulp.src("webclient/styles/fonts/**/*.*")
        .pipe(gulp.dest(".tmp/styles/fonts"));
});

// Replace annotations in HTML with paths to processed resources
gulp.task("htmlreplace", function () {
    gulp.src("webclient/index.html")
        .pipe(htmlreplace({
            "css": "styles/style.min.css",
            "lib": "scripts/lib.min.js",
            "app": "scripts/app.js"
        }))
        .pipe(gulp.dest(".tmp"));
});

// Concatenate, rename, and uglify JS dependencies
gulp.task("lib", function () {
    return gulp.src(["node_modules/angular/angular.js",
        "node_modules/angular-animate/angular-animate.js",
        "node_modules/angular-aria/angular-aria.js",
        "node_modules/angular-material/angular-material.js",
        "node_modules/angular-resource/angular-resource.js",
        "node_modules/angular-route/angular-route.js"])
        .pipe(concat("lib.js"))
        .pipe(gulp.dest(".tmp/scripts"))
        .pipe(rename("lib.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(".tmp/scripts"));
});

// Concatenate, rename, and uglify application JS
gulp.task("scripts", function () {
    return gulp.src(["webclient/scripts/*.js",
        "!webclient/scripts/*-spec.js",
        "webclient/components/**/*.js",
        "!webclient/components/**/*-spec.js"])
        .pipe(concat("app.js"))
        .pipe(gulp.dest(".tmp/scripts"))
        .pipe(rename("app.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest(".tmp/scripts"));
});

// Process HTML templates/views into JS for testing
gulp.task("preprocessHTML", function () {
    gulp.src("webclient/components/**/*.html")
        .pipe(ngHtml2Js({
            moduleName: "templates",
            prefix: "components/"
        }))
        .pipe(concat("templates.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("templates"));
});

// Run local server with watches on specified flies
gulp.task("browser-sync", function () {
    var files = [
        "**/*.html",
        "styles/**/*.*",
        "images/**/*.png",
        "scripts/**/*.js",
        "components/**/*.html",
        "components/**/*.js",
        "!components/**/*-spec.js"
    ];

    var proxyOptions = url.parse("http://localhost:8082/");
    proxyOptions.route = "/api";

    browserSync.init(files, {
        server: {
            baseDir: "./.tmp/",
            middleware: [proxy(proxyOptions)]
        }
    });

    gulp.watch("components/**/*.less", ["less"]);
    gulp.watch("styles/*.less", ["less"]);
    gulp.watch("scripts/**/*.js", ["lint", "scripts", "copy"]);
    gulp.watch("components/**/*.js", ["lint", "scripts", "copy"]);
});

// Karma test runner
function runKarma(configFilePath, options, cb) {

    configFilePath = path.resolve(configFilePath);

    var server = karma.server;
    var log = gutil.log, colors = gutil.colors;
    var config = karmaParseConfig(configFilePath, {});

    Object.keys(options).forEach(function (key) {
        config[key] = options[key];
    });

    server.start(config, function (exitCode) {
        log("Karma has exited with " + colors.red(exitCode));
        cb();
        process.exit(exitCode);
    });
}

gulp.task("karma", function (cb) {
    runKarma("karma.conf.js", {
        autoWatch: false,
        singleRun: true
    }, cb);
});

gulp.task("test", [
    "lint",
    "preprocessHTML",
    "karma"
]);

gulp.task("default",
    [
        "less",
        "lib",
        "scripts",
        "htmlreplace",
        "copy",
        "browser-sync"
    ]);

gulp.task("build",
    [
        "less",
        "lib",
        "scripts",
        "htmlreplace",
        "copy"
    ]);

gulp.task("package", ["build"], function () {
    return gulp.src(".tmp/**/*.*")
        .pipe(zip("package.zip"))
        .pipe(gulp.dest("dist"));
});