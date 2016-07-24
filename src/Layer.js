/**
 * @file Layer。Layer是一个从属控件，必须要有一个主控件。
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from './variables';
import {PropTypes} from 'vcomponent/type';
import {propsType} from 'vcomponent/decorators';
import CssClass from './CssClass';

@propsType({
    'class': PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    'onOutclick': PropTypes.func
})
export default class Layer extends Component {

    /**
     * 生成模板字符串
     *
     * @protected
     * @override
     * @return {string} 模板字符串
     */
    getTemplate() {
        return `
            <div class="{state.cssClass}"
                style="{state.mainStyle}"
                on-outclick="state.onOutClick(event)">
                {props.children}
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
        const cssClass = new CssClass();
        cssClass.add([uiPrefix + '-layer', 'hide']);
        cssClass.add(this.props.class);
        this.setState({cssClass, onOutClick: ::this.onOutClick});
    }

    /**
     * 点击外部
     *
     * @private
     * @param {Event} event 事件对象
     */
    onOutClick(event) {
        this.props.onOutclick && this.props.onOutclick(event);
    }

    /**
     * propsChange
     *
     * @public
     * @override
     * @param  {Object} changedProps changedProps
     */
    propsChange(changedProps) {
        if ('class' in changedProps) {
            this.state.cssClass.remove(changedProps.class.oldValue);
            this.state.cssClass.add(this.props.class);
            this.setState({cssClass: this.state.cssClass});
        }
    }

    /**
     * 设置主控件
     *
     * @public
     * @param {Component} main 主控件
     */
    setMain(main) {
        this.main = main;
    }

    /**
     * 计算位置
     *
     * @private
     */
    position() {
        // 必须在用主控件的情况下才能定位
        if (!this.main) {
            return;
        }

        const mainRect = this.main.getRect();
        const mainStyle = this.state.mainStyle || {};
        mainStyle.left = mainRect.left + 'px';
        mainStyle.top = (mainRect.top + mainRect.height) + 'px';
        mainStyle.minWidth = mainRect.width + 'px';
        this.setState({mainStyle});
    }

    /**
     * 判断layer是否隐藏
     *
     * @public
     * @return {boolean}
     */
    isHidden() {
        return !!this.state.cssClass.has('hide');
    }

    /**
     * 显示layer
     *
     * @public
     */
    show() {
        this.state.cssClass.add('show');
        this.state.cssClass.remove('hide');

        this.setState({cssClass: this.state.cssClass});
        this.position();
    }

    /**
     * 隐藏layer
     *
     * @public
     */
    hide() {
        this.state.cssClass.add('hide');
        this.state.cssClass.remove('show');

        this.setState({cssClass: this.state.cssClass});
    }
}
