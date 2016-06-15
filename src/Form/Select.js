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
                on-change="\${state.onChange(event, item)}"
                ref="ctrl">
                <!-- if: props.items && props.items.length -->
                    <!-- for: props.items as item -->
                        <option value="\${item.label}">\${item.label}</option>
                    <!-- /for -->
                <!-- else -->
                    \${props.children}
                <!-- /if -->
            </select>
        `;
    }

    ready() {
        this[CONVERT_PROPS]();

        this.setState({
            onChange: ::this[ON_CHANGE]
        });
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        super[CONVERT_PROPS]();
        this.refs.ctrl.setValue(this.props.value);
    }

    [ON_CHANGE](event, item) {
        if (this.props.onchange) {
            event.set('item', item);
            this.props.onchange(new Event(event, 'change'));
        }
    }
}
