var path = require('path');

module.exports = {
    entry: {
        main: "./src/main.js",
        Button: "./test/Button.js",
        CommandMenu: "./test/CommandMenu.js",
        TextBox: "./test/TextBox.js"
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "[name].js"
    },
    module: {
        loaders: [
            {test: /\.less$/, loader: "css!less"},
            {test: /\.tpl.html$/, loader: "html"}
        ]
    },
    devtool: 'inline-source-map'
};
