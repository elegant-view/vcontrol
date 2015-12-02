/**
 * @file 弹层
 * @author yibuyisheng(yibuyisheng@163.com, https://github.com/yibuyisheng)
 */

var Control = require('../Control');

module.exports = Control.extends(
    {
        tpl: require('./Layer.tpl.html'),
        show: function () {
            var classList = this.getData('classList', []);
            classList.push('show');
            this.setData('classList', classList);
        },
        hide: function () {
            this.setData(
                'classList',
                this.getData('classList', []).filter(function (klass) {
                    return klass !== 'show';
                })
            );
        },
        isShow: function () {
            var classList = this.getData('classList', []);
            for (var i = 0, il = classList.length; i < il; ++i) {
                if (classList[i] === 'show') {
                    return true;
                }
            }
            return false;
        }
    },
    {
        $name: 'Layer',
        getStyle: function () {
            return require('./Layer.less')[0][1];
        }
    }
);
