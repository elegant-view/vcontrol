var Control = require('../Control');

module.exports = Control.extends(
    {
        tpl: require('./button.tpl.html')
    },
    {
        $name: 'Button',

        getStyle: function () {
            return require('./button.less')[0][1];
        }
    }
);
