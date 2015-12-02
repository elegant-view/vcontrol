/**
 * @file 按钮控件
 * @author yibuyisheng(yibuyisheng@163.com, https://github.com/yibuyisheng)
 */

var Control = require('../Control');

module.exports = Control.extends(
    {
        tpl: require('./Button.tpl.html')
    },
    {
        $name: 'Button',

        getStyle: function () {
            return require('./Button.less')[0][1];
        }
    }
);
