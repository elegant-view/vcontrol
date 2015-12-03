var CommandMenu = require('../src/CommandMenu/CommandMenu');
var vcomponent = require('vcomponent');

var Main = vcomponent.Component.extends(
    {
        tpl: require('./CommandMenu.tpl.html'),
        componentClasses: [CommandMenu],
        componentDidMount: function () {
            var me = this;
            this.setData({
                title: '请选择',
                onItemSelected: function (event, item) {
                    me.setData({title: item.label});
                }
            });
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

