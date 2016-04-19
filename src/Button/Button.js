/**
 * @file 按钮控件
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';

export default class Button extends Component {
    getTemplate() {
        return `
            <button class="${uiPrefix}-button">$\{props.children}</button>
        `;
    }
}
