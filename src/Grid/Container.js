/**
 * @file 容器
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';

const CONVERT_PROPS = Symbol('convertProps');

export default class Container extends Component {
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
        const classList = this.state.classList || [`${uiPrefix}-container`];
        if (this.props.fluid) {
            this.classList.push(`${uiPrefix}-container-fluid`);
        }
        this.setState({classList});
    }
}
