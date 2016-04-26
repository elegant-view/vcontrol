/**
 * @file Select
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import AbstractFormControl from './AbstractFormControl';

export default class Select extends AbstractFormControl {
    getTemplate() {
        return `
            <select d-rest="\${props}"
                class="\${state.classList.concat(props.class).join(' ')}">
                \${props.children}
            </select>
        `;
    }

    ready() {
        this.convertProps();
    }

    propsChange() {
        this.convertProps();
    }
}
