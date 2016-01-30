var path = require('path');
var sass = require('node-sass');

exports.port = 7000;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var babelCompiler = require('edp-webserver/lib/handlers/babel')(
    {
        "stage": 0,
        "modules": "amd",
        "compact": false,
        "ast": false,
        "blacklist": ["strict"],
        "externalHelpers": true,
        "sourceMaps": "inline"
    }
);
exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: home('test/main.html')
        },
        {
            location: /\.scss$/,
            handler: function (context) {
                var docRoot  = context.conf.documentRoot;
                var pathname = context.request.pathname;
                var file = docRoot + pathname;

                context.header['content-type'] = 'text/css; charset=utf-8';
                try {
                    context.content = sass.renderSync({file: file}).css.toString();
                }
                catch (error) {
                    console.error(error.stack);
                    context.status = 500;
                }
            }
        },
        {
            location: /\.js$/,
            handler: function (context) {
                var docRoot  = context.conf.documentRoot;
                var pathname = context.request.pathname;
                var file = docRoot + pathname;

                var fs = require('fs');
                if (fs.existsSync(file)) {
                    return babelCompiler(context);
                }

                file = file.replace(/\.js$/, '.hcj');
                if (fs.existsSync(file)) {
                    var compiler = require('vhcj');
                    context.stop();
                    compiler(fs.readFileSync(file).toString(), path.dirname(file)).then(function (code) {
                        context.header['content-type'] = 'text/javascript; charset=utf-8';
                        context.content = code;
                        context.start();
                    }).catch(function (error) {
                        context.content = 'Server Error';
                        context.status = 500;
                        context.start();
                    });
                }
                else {
                    context.status = 404;
                }
            }
        },
        {
            location: /^\/redirect-local/, 
            handler: redirect('redirect-target', false) 
        },
        {
            location: /^\/redirect-remote/, 
            handler: redirect('http://www.baidu.com', false) 
        },
        { 
            location: /^\/redirect-target/, 
            handler: content('redirectd!') 
        },
        { 
            location: '/empty', 
            handler: empty() 
        },
        { 
            location: /\.css($|\?)/, 
            handler: [
                autocss()
            ]
        },
        { 
            location: /\.less($|\?)/, 
            handler: [
                file(),
                less()
            ]
        },
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file(),
                stylus()
            ]
        },
        { 
            location: /^.*$/, 
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
