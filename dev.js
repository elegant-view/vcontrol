var server = require('dev-server');
var importOnce = require('node-sass-import-once');

server.start({
    rootPath: __dirname,
    port: 8001,
    babel: {
        include: [/\/(test|src)\/.*\.js$/],
        compileOptions: {
            presets: ['es2015', 'stage-0'],
            plugins: ['transform-es2015-modules-amd', 'transform-decorators-legacy']
        }
    },
    sass: {
        include: [/\/(test|src)\/.*\.scss$/],
        compileOptions: {
            importer: importOnce,
            importOnce: {
                index: false,
                css: false,
                bower: false
            }
        }
    }
});
