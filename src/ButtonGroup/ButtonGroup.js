/**
 * @file 按钮组
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {inArray} from '../util';

const CONVERT_PROPS = Symbol('convertProps');
const SIZE_ARRAY = ['sm', 'lg'];

export default class ButtonGroup extends Component {
    getTemplate() {
        return `
            <div class="$\{state.classList.join(' ')}">$\{props.children}</div>
        `;
    }

    ready() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [`${uiPrefix}-button-group`];
        if (inArray(this.props.size, SIZE_ARRAY)) {
            classList.push(`${uiPrefix}-button-group-${this.props.size}`);
        }
        if (this.props.direction === 'vertical') {
            classList.push(`${uiPrefix}-button-group-vertical`);
        }
        this.setState({classList});
    }
}
