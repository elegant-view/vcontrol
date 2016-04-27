/**
 * @file InputGroup
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {inArray} from '../util';
import Input from './Input';
import Button from '../Button/Button';

const CONVERT_PROPS = Symbol('convertProps');
const SIZE_ARRAY = ['lg', 'sm'];

export default class Inputgroup extends Component {
    getTemplate() {
        return `
            <div class="\${state.classList.concat(props.class).join(' ')}">
                <!-- if: props.prefixType === 'checkbox' -->
                    <span class="${uiPrefix}-input-group-addon">
                        <ui-input type="checkbox" />
                    </span>
                <!-- elif: props.prefixType === 'radio' -->
                    <span class="${uiPrefix}-input-group-addon">
                        <ui-input type="radio" />
                    </span>
                <!-- elif: props.prefixType === 'button' -->
                    <span class="${uiPrefix}-input-group-btn">
                        <ui-button variant="secondary">\${props.prefix}</ui-button>
                    </span>
                <!-- elif: props.prefix -->
                    <div class="${uiPrefix}-input-group-addon">\${props.prefix}</div>
                <!-- /if -->
                <ui-input d-rest="\${props}"></ui-input>
                <!-- if: props.suffixType === 'button' -->
                    <span class="${uiPrefix}-input-group-btn">
                        <ui-button variant="secondary">\${props.suffix}</ui-button>
                    </span>
                <!-- elif: props.suffix -->
                    <div class="${uiPrefix}-input-group-addon">\${props.suffix}</div>
                <!-- /if -->
            </div>
        `;
    }

    getComponentClasses() {
        return [Input, Button];
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
