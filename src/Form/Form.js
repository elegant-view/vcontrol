/**
 * @file form
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';

const CONVERT_PROPS = Symbol('convertProps');

export default class Form extends Component {
    getTemplate() {
        return `
            <form class="\${state.classList.concat(props.class).join(' ')}">\${props.children}</form>
        `;
    }

    ready() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const classList = this.state.classList || [];
        if ('inline' in this.props) {
            classList.push(`${uiPrefix}-form-inline`);
        }
        this.setState({classList});
    }
}
