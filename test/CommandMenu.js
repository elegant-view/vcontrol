var CommandMenu = require('../src/CommandMenu/CommandMenu');
var vcomponent = require('vcomponent');

var Main = vcomponent.Component.extends(
    {
        tpl: require('./CommandMenu.tpl.html'),
        componentClasses: [CommandMenu],
        literalAttrReady: function () {
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

