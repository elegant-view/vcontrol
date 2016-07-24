/**
 * @file Option。目前仅用于Select的children
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from './variables';
import {PropTypes} from 'vcomponent/type';
import {propsType} from 'vcomponent/decorators';

@propsType({
    value: PropTypes.any,
    onSelect: PropTypes.func
})
export default class Option extends Component {

    /**
     * getTemplate
     *
     * @public
     * @override
     * @return {string}
     */
    getTemplate() {
        return `<div class="${uiPrefix}-option" on-click="state.onClick()">{props.children}</div>`;
    }

    /**
     * init
     *
     * @public
     * @override
     */
    init() {
        this.setState({
            onClick: ::this.onClick
        });
    }

    /**
     * 点击回调
     *
     * @private
     */
    onClick() {
        this.props.onSelect && this.props.onSelect(this.props.value);
    }
}
