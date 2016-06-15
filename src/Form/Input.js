/**
 * @file Input
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import AbstractFormControl from './AbstractFormControl';
import {CONVERT_PROPS} from '../variables';

export default class Input extends AbstractFormControl {
    getTemplate() {
        return `
            <input d-rest="\${props}" class="\${state.classList.concat(props.class).join(' ')}" />
        `;
    }

    ready() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }
}
