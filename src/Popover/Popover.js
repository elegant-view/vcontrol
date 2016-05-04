/**
 * @file popover
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {inArray} from '../util';

const CONVERT_PROPS = Symbol('convertProps');
const POSITION = ['top', 'right', 'bottom', 'left'];

export default class Popover extends Component {
    getTemplate() {
        return `
            <div class="\${state.classList.concat(props.class).join(' ')}" ref="box">
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

        let positionComputer;
        if (inArray(this.props.position, POSITION)) {
            classList.push(`${uiPrefix}-popover-${this.props.position}`);
        }
        else {
            positionComputer = () => {
                this.refs.box.getDOMNode();
            };
        }

        this.setState({classList}, {done: positionComputer});
    }
}
