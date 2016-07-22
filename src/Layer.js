/**
 * @file layer
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from './variables';

export default class Layer extends Component {
    getTemplate() {
        return `
            <div class="${uiPrefix}-layer">\${children}</div>
        `;
    }
}
