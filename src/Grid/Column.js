/**
 * @file 列
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {inArray} from '../util';

const CONVERT_PROPS = Symbol('convertProps');
const SIZE_ARRAY = ['xs', 'sm', 'md', 'lg', 'xl'];

export default class Column extends Component {
    getTemplate() {
        return `
            <div class="$\{state.cssClass}">$\{props.children}</div>
        `;
    }

    init() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        let cssClass = `col-`;
        if (!inArray(this.props.size, SIZE_ARRAY)) {
            throw new Error(`Column: wrong size attribute, must be one of \`[${SIZE_ARRAY.join(',')}]\``);
        }
        cssClass += this.props.size;

        const columns = parseInt(this.props.columns, 10);
        if (!columns || columns > 12 || columns < 1) {
            throw new Error(`Column: wrong columns attribute, must be between 1 and 12`);
        }
        cssClass += '-' + columns;

        const pull = parseInt(this.props.pull, 10);
        const push = parseInt(this.props.push, 10);
        if (pull > 12 || pull < 1) {
            throw new Error('wrong `pull` attribute: ' + pull);
        }
        if (push > 12 || push < 1) {
            throw new Error('wrong `push` attribute: ' + push);
        }
        if (pull && push) {
            throw new Error(`the \`pull\` property can not be used with \`push\` property.`);
        }
        else if (pull) {
            cssClass += ` col-${this.props.size}-pull-${pull}`;
        }
        else if (push) {
            cssClass += ` col-${this.props.size}-push-${push}`;
        }

        this.setState({cssClass});
    }
}
