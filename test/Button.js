var Button = require('../src/Button/Button');
var vcomponent = require('vcomponent');

var Main = vcomponent.Component.extends(
    {
        tpl: require('./Button.tpl.html'),
        componentClasses: [Button],
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

