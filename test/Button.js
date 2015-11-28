var Button = require('../src/Button/Button');
var vcomponent = require('vcomponent');

var Main = vcomponent.Component.extends(
    {
        tpl: require('./button.tpl.html'),
        componentClasses: [Button],
        literalAttrReady: function () {
            this.setData({
                click: function () {
                    alert('click');
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

