exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var babelCompiler = require('edp-webserver/lib/handlers/babel')(
    {
        presets: [require("babel-preset-es2015")],
        plugins: [require("babel-plugin-transform-es2015-modules-amd")]
    },
    {
        babel: require('babel-core')
    }
);
exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: home('test/main.html')
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
                    compiler(fs.readFileSync(file).toString()).then(function (code) {
                        context.header['content-type'] = 'text/javascript; charset=utf-8';
                        context.content = code;
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
