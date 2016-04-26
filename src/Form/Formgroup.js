/**
 * @file FormGroup
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import Input from './Input';
import {uiPrefix} from '../variables';

export default class Formgroup extends Component {
    getTemplate() {
        return `
            <fieldset class="${uiPrefix}-form-group">
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
}
