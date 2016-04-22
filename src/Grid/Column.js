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

    ready() {
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
            throw new Error(`Column: wrong columns attribute, must between 1 and 12`);
        }
        cssClass += '-' + columns;

        this.setState({cssClass});
    }
}
