/**
 * @file Select
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import VComponent from 'vcomponent';
import Layer from './Layer';
import {uiPrefix} from './variables';
import {PropTypes} from 'vcomponent/type';
import {propsType} from 'vcomponent/decorators';
import * as util from './util';
import CssClass from './CssClass';
import Option from './Option';
import u from 'underscore';

@propsType({
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    datasource: PropTypes.arrayOf(PropTypes.shape({text: PropTypes.string, value: PropTypes.any})),
    defaultText: PropTypes.string,
    size: PropTypes.oneOf(['large', 'normal', 'small']),
    onChange: PropTypes.func
})
export default class Select extends Component {

    /**
     * getTemplate
     *
     * @public
     * @override
     * @return {string}
     */
    getTemplate() {
        return `
            <div class="{state.cssClass}"
                ref="main"
                on-click="state.onClick()"
                style="{state.mainStyle}">
                {state.selectedItem ? state.selectedItem.text : state.defaultText}
                <i class="fa fa-caret-down {state.isOpen ? 'up' : 'down'}"></i>
            </div>
        `;
    }

    /**
     * init
     *
     * @public
     * @override
     */
    init() {
        this.getLayer().setData('datasource', this.props.datasource);

        const cssClass = new CssClass();
        cssClass.add(`${uiPrefix}-select`);
        if (this.props.size) {
            cssClass.add(`${uiPrefix}-${this.props.size}`);
        }
        else {
            cssClass.add(`${uiPrefix}-normal`);
        }

        this.setState({
            onClick: ::this.onClick,
            cssClass,
            defaultText: this.props.defaultText || '请选择'
        });

        this.convertWidth();
    }

    /**
     * 点击回调
     *
     * @private
     * @param  {Event} event 事件对象
     */
    onClick(event) {
        const layerComponent = this.getLayerComponent();
        if (layerComponent.isHidden()) {
            this.showLayer();
        }
        else {
            this.hideLayer();
        }
    }

    /**
     * propsChange
     *
     * @public
     * @override
     * @param  {Object} changedProps changedProps
     */
    propsChange(changedProps) {
        if ('width' in changedProps) {
            this.convertWidth();
        }

        if ('class' in changedProps) {
            this.state.cssClass.remove(changedProps.class.oldValue);
            this.state.cssClass.add(this.props.class);
            this.setState({cssClass: this.state.cssClass});
        }

        if ('datasource' in changedProps) {
            this.getLayer().setData('datasource', this.props.datasource);
        }

        if ('defaultText' in changedProps) {
            this.setState({defaultText: this.props.defaultText || '请选择'});
        }

        if ('size' in changedProps) {
            u.each(::this.state.cssClass.remove);
            if (this.props.size) {
                this.state.cssClass.add(`${uiPrefix}-${this.props.size}`);
            }
            else {
                this.state.cssClass.add(`${uiPrefix}-normal`);
            }
            this.setState({cssClass: this.state.cssClass});
        }
    }

    /**
     * 转换一下宽度
     *
     * @private
     */
    convertWidth() {
        if (this.props.width !== undefined) {
            this.setState({mainStyle: util.extend({}, this.state.mainStyle, {width: this.props.width + 'px'})});
        }
    }

    /**
     * layer模板
     *
     * @return {string}
     */
    getLayerTemplate() {
        return `
            <ev-layer class="${uiPrefix}-select-layer"
                ref="layer"
                on-outclick="{onOutClick}">
                <!-- for: datasource as item -->
                    <ev-option value="{item.value}" on-select="{onSelect}">{item.text}</ev-option>
                <!-- /for -->
            </ev-layer>
        `;
    }

    /**
     * 获取layer
     *
     * @private
     * @return {VComponent}
     */
    getLayer() {
        if (!this.layer) {
            this.divNode = document.createElement('div');
            this.divNode.innerHTML = this.getLayerTemplate();

            this.layer = new VComponent({startNode: this.divNode, endNode: this.divNode});
            this.layer.registerComponents([Layer, Option]);
            this.layer.setData({onOutClick: ::this.onLayerOutClick, onSelect: ::this.onItemSelect});
            this.layer.render(() => document.body.appendChild(this.divNode));

            const layerComponent = this.layer.ref('layer');
            layerComponent.hide();
            layerComponent.setMain(this);
        }

        return this.layer;
    }

    /**
     * layer外部点击
     *
     * @private
     * @param  {Event} event 事件对象
     */
    onLayerOutClick(event) {
        // 判断一下，如果点击的不是是Select主元素地盘里面的东西，就直接做隐藏操作等。
        if (!this.refs.main.equal(event.target) && !this.refs.main.contains(event.target)) {
            this.hideLayer();
        }
    }

    /**
     * 条目选中
     *
     * @private
     * @param  {*} value 选中条目的数据
     */
    onItemSelect(value) {
        const itemData = u.find(this.props.datasource, item => item.value === value);
        if (!this.state.selectedItem || this.state.selectedItem.value !== value) {
            this.props.onChange && this.props.onChange(itemData);
            this.setState({selectedItem: itemData});
        }
        this.hideLayer();
    }

    /**
     * 获取当前选中的
     *
     * @public
     * @return {Object}
     */
    getSelected() {
        return this.state.selectedItem;
    }

    /**
     * 获取layer下面的layer组件实例
     *
     * @private
     * @return {Component}
     */
    getLayerComponent() {
        return this.getLayer().ref('layer');
    }

    /**
     * 获取当前显示区域
     *
     * @public
     * @return {Object}
     */
    getRect() {
        return this.refs.main.getBoundingClientRect();
    }

    /**
     * 显示layer
     *
     * @private
     */
    showLayer() {
        this.getLayerComponent().show();
        this.state.cssClass.remove(uiPrefix + '-close').add(uiPrefix + '-open');
        this.setState({isOpen: true, cssClass: this.state.cssClass});
    }

    /**
     * 隐藏layer
     *
     * @private
     */
    hideLayer() {
        this.getLayerComponent().hide();
        this.state.cssClass.remove(uiPrefix + '-open').add(uiPrefix + '-close');
        this.setState({isOpen: false, cssClass: this.state.cssClass});
    }

    /**
     * destroy
     *
     * @public
     * @override
     */
    destroy() {
        if (this.layer) {
            this.layer.destroy();
            this.divNode.parentNode && this.divNode.parentNode.removeChild(this.divNode);
            this.divNode = null;
        }
    }
}
