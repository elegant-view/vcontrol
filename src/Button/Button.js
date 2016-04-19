/**
 * @file 按钮控件
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {inArray} from '../util';

const CONVERT_PROPS = Symbol('convertProps');

const SIZE_ARRAY = ['sm', 'lg'];
const TYPE_ARRAY = ['primary', 'secondary', 'info', 'success', 'warning', 'danger'];
const OUTLINE_ARRAY = TYPE_ARRAY;

export default class Button extends Component {
    getTemplate() {
        return `
            <button class="$\{state.classList.join(' ')}">$\{props.children}</button>
        `;
    }

    ready() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [`${uiPrefix}-button`];
        if (inArray(this.props.type, TYPE_ARRAY)) {
            classList.push(`${uiPrefix}-button-${this.props.type}`);
        }
        if (inArray(this.props.size, SIZE_ARRAY)) {
            classList.push(`${uiPrefix}-button-${this.props.size}`);
        }
        if (inArray(this.props.outline, OUTLINE_ARRAY)) {
            classList.push(`${uiPrefix}-${this.props.outline}-outline`);
        }
        this.setState({classList});
    }
}
