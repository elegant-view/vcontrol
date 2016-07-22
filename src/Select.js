/**
 * @file Select
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import VComponent from 'vcomponent';
import Layer from './Layer';
import {uiPrefix} from './variables';

export default class Select extends Component {
    getTemplate() {
        return `
            <div class="${uiPrefix}-select"></div>
        `;
    }

    init() {
        if (this.props.children) {
            this.getLayer().setData('children', this.props.children);
        }
    }

    propsChange(changedProps) {
        if ('children' in changedProps) {
            this.getLayer().setData('children', this.props.children);
        }
    }

    getLayer() {
        if (!this.layer) {
            this.divNode = document.createElement('div');
            this.divNode.innerHTML = '<ev-layer>\${children}</ev-layer>';
            document.body.appendChild(this.divNode);

            this.layer = new VComponent({startNode: this.divNode, endNode: this.divNode});
            this.layer.registerComponents([Layer]);
            this.layer.render();
        }

        return this.layer;
    }

    destroy() {
        if (this.layer) {
            this.layer.destroy();
        }
    }
}
