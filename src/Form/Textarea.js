/**
 * @file Textarea
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import AbstractFormControl from './AbstractFormControl';
import {CONVERT_PROPS} from '../variables';

export default class Textarea extends AbstractFormControl {
    getTemplate() {
        return `
            <textarea d-rest="\${props}"
                class="\${state.classList.concat(props.class).join(' ')}"></textarea>
        `;
    }

    init() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }
}
