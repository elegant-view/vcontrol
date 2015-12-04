var Table = require('../src/Table/Table');
var vcomponent = require('vcomponent');

var Main = vcomponent.Component.extends(
    {
        tpl: require('./Table.tpl.html'),
        componentClasses: [Table],
        componentDidMount: function () {
            this.setData({
                click: function () {
                    alert('click');
                },
                skinLink: 'skin-link'
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

