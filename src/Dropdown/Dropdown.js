/**
 * @file dropdown
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import Button from '../Button/Button';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import {uiPrefix, SIZE_ARRAY, VARIANT_ARRAY} from '../variables';
import Event from '../Event';
import {propsType} from 'vcomponent/decorators';
import {PropTypes} from 'vcomponent/type';

const CONVERT_PROPS = Symbol('convertProps');
const ON_TOGGLE = Symbol('onToggle');

const HIDE_LAYER = Symbol('hide');
const SHOW_LAYER = Symbol('show');
const ON_OUTCLICK = Symbol('onOutclick');
const ON_ITEM_CLICK = Symbol('onItemClick');

@propsType({
    direction: PropTypes.oneOf(['up', 'down']),
    size: PropTypes.oneOf(SIZE_ARRAY),
    variant: PropTypes.oneOf(VARIANT_ARRAY),
    title: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object)
})
export default class Dropdown extends Component {
    getTemplate() {
        return `
            <ev-button-group class="\${state.classList}" onoutclick="\${state.onOutclick}">
                <!-- if: props.split -->
                    <ev-button size="\${props.size}"
                        variant="\${props.variant}">
                        \${props.title}
                    </ev-button>
                    <ev-button size="\${props.size}"
                        variant="\${props.variant}"
                        class="${uiPrefix}-dropdown-toggle"
                        onclick="\${state.onToggle}">
                    </ev-button>
                <!-- else -->
                    <ev-button variant="\${props.variant}"
                        size="\${props.size}"
                        class="${uiPrefix}-dropdown-toggle"
                        onclick="\${state.onToggle}">
                        $\{props.title}
                    </ev-button>
                <!-- /if -->

                <!-- if: props.items && props.items.length -->
                    <div class="${uiPrefix}-dropdown-menu">
                        <!-- for: props.items as item -->
                            <!-- if: item.type === 'divider' -->
                                <div class="${uiPrefix}-dropdown-divider"></div>
                            <!-- elif: item.href -->
                                <a class="${uiPrefix}-dropdown-item"
                                    href="\${item.href}">
                                    \${item.label}
                                </a>
                            <!-- else -->
                                <a class="${uiPrefix}-dropdown-item"
                                    on-click="\${state.onItemClick(item, event)}">
                                    \${item.label}
                                </a>
                            <!-- /if -->
                        <!-- /for -->
                    </div>
                <!-- /if -->
            </ev-button-group>
        `;
    }

    getComponentClasses() {
        return [Button, ButtonGroup];
    }

    ready() {
        this.setState({
            onToggle: ::this[ON_TOGGLE],
            onOutclick: ::this[ON_OUTCLICK],
            onItemClick: ::this[ON_ITEM_CLICK]
        });
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [];
        if (this.props.direction) {
            classList.push(`${uiPrefix}-drop${this.props.direction}`);
        }
        this.setState({classList});
    }

    [ON_TOGGLE]() {
        const classList = this.state.classList || [];
        const restKlass = classList.filter(klass => klass !== 'open');
        if (restKlass.length !== classList.length) {
            this.setState({classList: restKlass});
        }
        else {
            this.setState({classList: restKlass.concat('open')});
        }
    }

    [ON_OUTCLICK]() {
        this[HIDE_LAYER]();
    }

    [ON_ITEM_CLICK](item, event) {
        if (item.onClick instanceof Function) {
            const event = new Event(this, event, 'itemclick');
            event.set('item', item);
            item.onClick(event);

            if (!event.isPreventDefault) {
                this[HIDE_LAYER]();
            }
        }
    }

    [HIDE_LAYER]() {
        this.setState({classList: (this.state.classList || []).filter(klass => klass !== 'open')});
    }

    [SHOW_LAYER]() {
        this.setState({classList: (this.state.classList || []).concat('open')});
    }
}
