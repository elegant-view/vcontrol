/**
 * @file 行
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';

export default class Row extends Component {
    getTemplate() {
        return `
            <div class="${uiPrefix}-row">$\{props.children}</div>
        `;
    }
}
