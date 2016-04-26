/**
 * @file Textarea
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import AbstractFormControl from './AbstractFormControl';

export default class Textarea extends AbstractFormControl {
    getTemplate() {
        return `
            <textarea d-rest="\${props}"
                class="\${state.classList.concat(props.class).join(' ')}"></textarea>
        `;
    }

    ready() {
        this.convertProps();
    }

    propsChange() {
        this.convertProps();
    }
}
