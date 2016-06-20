/**
 * @file 按钮控件
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {distinctArr} from '../util';
import Event from '../Event';
import {propsType} from 'vcomponent/decorators';
import {PropTypes} from 'vcomponent/type';
import {SIZE_ARRAY, VARIANT_ARRAY} from '../variables';

const CONVERT_PROPS = Symbol('convertProps');
const OUTLINE_ARRAY = VARIANT_ARRAY;

const ON_CLICK = Symbol('onClick');

@propsType({
    variant: PropTypes.oneOf(VARIANT_ARRAY),
    size: PropTypes.oneOf(SIZE_ARRAY),
    outline: PropTypes.oneOf(OUTLINE_ARRAY),
    onClick: PropTypes.func
})
export default class Button extends Component {
    getTemplate() {
        return `
            <button class="\${state.classList.concat(props.class).join(' ')}"
                on-click="state.onClick(event)">
                \${props.children}
            </button>
        `;
    }

    init() {
        this.setState({
            onClick: ::this[ON_CLICK]
        });
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [`${uiPrefix}-button`];
        if (this.props.variant) {
            classList.push(`${uiPrefix}-button-${this.props.variant}`);
        }
        if (this.props.size) {
            classList.push(`${uiPrefix}-button-${this.props.size}`);
        }
        if (this.props.outline) {
            classList.push(`${uiPrefix}-${this.props.outline}-outline`);
        }
        this.setState({classList: distinctArr(classList)});
    }

    [ON_CLICK](event) {
        if (this.props.onclick) {
            this.props.onclick(new Event(this, event, 'click'));
        }
    }
}
