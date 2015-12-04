/**
 * @file 弹层
 * @author yibuyisheng(yibuyisheng@163.com, https://github.com/yibuyisheng)
 */

var Control = require('../Control');

module.exports = Control.extends(
    {
        tpl: require('./Table.tpl.html')
    },
    {
        $name: 'Table',
        getStyle: function () {
            return require('./Table.less')[0][1];
        }
    }
);
