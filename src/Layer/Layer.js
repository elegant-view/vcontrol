/**
 * @file 弹层
 * @author yibuyisheng(yibuyisheng@163.com, https://github.com/yibuyisheng)
 */

var Control = require('../Control');

module.exports = Control.extends(
    {
        tpl: require('./Layer.tpl.html'),

        show: function () {
            var classList = this.getData('class', []);
            classList.push('show');
            this.setData('class', classList);
        },

        hide: function () {
            this.setData(
                'class',
                this.getData('class', []).filter(function (klass) {
                    return klass !== 'show';
                })
            );
        },

        isShow: function () {
            var classList = this.getData('class', []);
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
