/**
 * @file FormGroup
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import Input from './Input';
import {uiPrefix} from '../variables';
import {inArray} from '../util';

const STATE_ARRAY = ['success', 'warning', 'danger'];
const CONVERT_PROPS = Symbol('convertProps');

export default class Formgroup extends Component {
    getTemplate() {
        return `
            <fieldset class="\${state.classList.concat(props.class).join(' ')}" d-rest="\${props}">
                <!-- if: props.label -->
                    <label>\${props.label}</label>
                <!-- /if -->
                \${props.children}
                <!-- if: props.tip -->
                    <small class="${uiPrefix}-text-muted">\${props.tip}</small>
                <!-- /if -->
            </fieldset>
        `;
    }

    getComponentClasses() {
        return [Input];
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [`${uiPrefix}-form-group`];
        if (inArray(this.props.state, STATE_ARRAY)) {
            classList.push(`${uiPrefix}-has-${this.props.state}`);
        }
        this.setState({classList});
    }
}
