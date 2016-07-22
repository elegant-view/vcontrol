/**
 * @file ButtonPage
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import Button from 'vcontrol/Button/Button';

export default class ButtonPage extends Component {
    getTemplate() {
        return `
            <ev-button variant="primary" class="custom-class" size="sm">按钮</ev-button>
            <ev-button variant="secondary" size="sm">按钮</ev-button>
        `;
    }

    getComponentClasses() {
        return [Button];
    }
}
