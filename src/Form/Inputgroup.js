/**
 * @file InputGroup
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {inArray} from '../util';
import Input from './Input';

const CONVERT_PROPS = Symbol('convertProps');
const SIZE_ARRAY = ['lg', 'sm'];

export default class Inputgroup extends Component {
    getTemplate() {
        return `
            <div class="\${state.classList.concat(props.class).join(' ')}">
                <!-- if: props.prefix -->
                    <div class="${uiPrefix}-input-group-addon">\${props.prefix}</div>
                <!-- /if -->
                <ui-input d-rest="\${props}"></ui-input>
                <!-- if: props.prefix -->
                    <div class="${uiPrefix}-input-group-addon">\${props.suffix}</div>
                <!-- /if -->
            </div>
        `;
    }

    getComponentClasses() {
        return [Input];
    }

    ready() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [`${uiPrefix}-input-group`];
        if (inArray(this.props.size, SIZE_ARRAY)) {
            classList.push(`${uiPrefix}-input-group-${this.props.size}`);
        }
        this.setState({classList});
    }
}
