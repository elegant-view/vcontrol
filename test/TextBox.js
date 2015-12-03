var TextBox = require('../src/TextBox/TextBox');
var vcomponent = require('vcomponent');

var Main = vcomponent.Component.extends(
    {
        tpl: require('./TextBox.tpl.html'),
        componentClasses: [TextBox],
        componentDidMount: function () {
        }
    },
    {
        $name: 'Main'
    }
);

var main = document.getElementById('main');
vcomponent.mount(
    {
        config: new vcomponent.Config(),
        startNode: main,
        endNode: main
    },
    [Main]
);
