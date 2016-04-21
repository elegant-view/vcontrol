/**
 * @file 按钮工具条
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';

export default class ButtonToolbar extends Component {
    getTemplate() {
        return `
            <div class="${uiPrefix}-button-toolbar">$\{props.children}</div>
        `;
    }
}
