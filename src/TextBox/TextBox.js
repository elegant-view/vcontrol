/**
 * @file 文本输入框
 * @author yibuyisheng(yibuyisheng@163.com)
 */

var Control = require('../Control');

module.exports = Control.extends(
    {
        tpl: require('./TextBox.tpl.html')
    },
    {
        $name: 'TextBox',
        getStyle: function () {
            return require('./TextBox.less')[0][1];
        }
    }
);
