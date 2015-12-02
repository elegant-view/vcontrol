var childProcess = require('child_process');

childProcess.spawn('webpack-dev-server', [], {stdio: 'inherit'});
childProcess.spawn('webpack', ['--watch'], {stdio: 'inherit'});
