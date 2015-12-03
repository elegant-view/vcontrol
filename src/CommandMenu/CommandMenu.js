/**
 * @file 下拉命令菜单
 * @author yibuyisheng(yibuyisheng@163.com, https://github.com/yibuyisheng)
 */

var Control = require('../Control');
var Button = require('../Button/Button');
var Layer = require('../Layer/Layer');

module.exports = Control.extends(
    {
        tpl: require('./CommandMenu.tpl.html'),
        componentClasses: [Button, Layer],

        literalAttrReady: function () {
            var me = this;
            var layer = me.ref('layer');
            this.setData({
                toggleLayer: function () {
                    if (layer.isShow()) {
                        layer.hide();
                    }
                    else {
                        layer.show();
                    }
                },
                onOutClick: function (event) {
                    layer.hide();
                },
                onLayerClick: function (event) {
                    me.setData('title', event.target.innerText);
                    layer.hide();
                }
            });
        }
    },
    {
        $name: 'CommandMenu',
        getStyle: function () {
            return require('./CommandMenu.less')[0][1];
        }
    }
);
