/**
 * @file 按钮组
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix, SIZE_ARRAY} from '../variables';
import {distinctArr} from '../util';
import {propsType} from 'vcomponent/decorators';
import {PropTypes} from 'vcomponent/type';

const CONVERT_PROPS = Symbol('convertProps');
const ON_OUTCLICK = Symbol('onOutclick');

@propsType({
    size: PropTypes.oneOf(SIZE_ARRAY),
    direction: PropTypes.oneOf(['vertical']),
    onOutclick: PropTypes.func
})
export default class ButtonGroup extends Component {
    getTemplate() {
        return `
            <div class="$\{state.classList.concat(props.class).join(' ')}"
                on-outclick="\${state.onOutclick(event)}">
                $\{props.children}
            </div>
        `;
    }

    init() {
        this.setState({
            onOutclick: ::this[ON_OUTCLICK]
        });
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [`${uiPrefix}-button-group`];
        if (this.props.size) {
            classList.push(`${uiPrefix}-button-group-${this.props.size}`);
        }
        if (this.props.direction === 'vertical') {
            classList.push(`${uiPrefix}-button-group-vertical`);
        }
        this.setState({classList: distinctArr(classList)});
    }

    [ON_OUTCLICK](event) {
        if (this.props.onoutclick) {
            this.props.onoutclick(new Event(this, event, 'outclick'));
        }
    }
}
