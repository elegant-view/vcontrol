/**
 * @file Select
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import AbstractFormControl from './AbstractFormControl';
import {CONVERT_PROPS} from '../variables';
import {propsType} from 'vcomponent/decorators';
import {PropTypes} from 'vcomponent/type';
import Event from '../Event';

const ON_CHANGE = Symbol('onChange');

@propsType({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    items: PropTypes.arrayOf(PropTypes.object),
    onchange: PropTypes.func
})
export default class Select extends AbstractFormControl {
    getTemplate() {
        return `
            <select class="\${state.classList.concat(props.class).join(' ')}"
                on-change="\${state.onChange(event)}"
                ref="ctrl">
                <!-- if: props.items && props.items.length -->
                    <!-- for: props.items as item -->
                        <option value="\${item.value}">\${item.label}</option>
                    <!-- /for -->
                <!-- else -->
                    \${props.children}
                <!-- /if -->
            </select>
        `;
    }

    init() {
        this[CONVERT_PROPS]();

        this.setState({
            onChange: ::this[ON_CHANGE]
        });

        this.refs.ctrl.setValue(this.props.value);
    }

    propsChange(changedProps) {
        this[CONVERT_PROPS]();
    }

    propsChangeMounted(changedProps) {
        if (changedProps.items || 'value' in changedProps) {
            this.refs.ctrl.setValue(this.props.value);
        }
    }

    [CONVERT_PROPS]() {
        super[CONVERT_PROPS]();
    }

    [ON_CHANGE](event) {
        if (this.props.onchange) {
            const wrapEvent = new Event(this, event, 'change');
            this.props.onchange(wrapEvent);
        }
    }

    getValue() {
        return this.refs.ctrl.getValue();
    }
}
