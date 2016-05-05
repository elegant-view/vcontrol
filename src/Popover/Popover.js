/**
 * @file popover
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {inArray} from '../util';

const CONVERT_PROPS = Symbol('convertProps');
const POSITION = ['left', 'top', 'right', 'bottom'];

export default class Popover extends Component {
    getTemplate() {
        return `
            <div class="\${state.classList.concat(props.class).join(' ')}"
                style="\${state.style}"
                ref="box">
                <div class="popover-arrow"></div>
                <h3 class="popover-title">\${props.title}</h3>
                <div class="popover-content">
                    \${props.children}
                </div>
            </div>
        `;
    }

    ready() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [`${uiPrefix}-popover`];
        const style = this.state.style || {};

        if (inArray(this.props.position, POSITION)) {
            classList.push(`${uiPrefix}-popover-${this.props.position}`);
        }

        style.left = this.props.left;
        style.top = this.props.top;

        this.setState({classList, style});
    }
}
