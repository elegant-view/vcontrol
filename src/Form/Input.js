/**
 * @file Input
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import AbstractFormControl from './AbstractFormControl';

export default class Input extends AbstractFormControl {
    getTemplate() {
        return `
            <input d-rest="\${props}" class="\${state.classList.concat(props.class).join(' ')}" />
        `;
    }

    ready() {
        this.convertProps();
    }

    propsChange() {
        this.convertProps();
    }
}
