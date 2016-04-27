/**
 * @file label
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {inArray} from '../util';

const CONVERT_PROPS = Symbol('convertProps');
const VARIANT_ARRAY = ['default', 'primary', 'success', 'info', 'warning', 'danger'];

export default class Label extends Component {
    getTemplate() {
        return `
            <span class="\${state.classList.concat(props.class).join(' ')}">Default</span>
        `;
    }

    ready() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [`${uiPrefix}`];
        if (inArray(this.props.variant, VARIANT_ARRAY)) {
            classList.push(`${uiPrefix}-label-${this.props.variant}`);
        }
        else if (this.props.pill) {
            classList.push(`${uiPrefix}-label-pill`);
        }
        this.setState({classList});
    }
}
