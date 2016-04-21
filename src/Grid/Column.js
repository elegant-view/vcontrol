/**
 * @file 列
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {inArray} from '../util';

const CONVERT_PROPS = Symbol('convertProps');
const SIZE_ARRAY = ['xs', 'sm', 'md', 'lg', 'xl'];

export default class Column extends Component {
    getTemplate() {
        return `
            <div class="$\{klass}">$\{props.children}</div>
        `;
    }

    ready() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        debugger
        let klass = `${uiPrefix}-`;
        if (!inArray(this.props.size, SIZE_ARRAY)) {
            throw new Error(`Column: wrong size attribute, must be one of \`[${SIZE_ARRAY.join(',')}]\``);
        }
        klass += this.props.size;

        const columns = parseInt(this.props.columns, 10);
        if (!columns || columns > 12 || columns < 1) {
            throw new Error(`Column: wrong columns attribute, must between 1 and 12`);
        }
        klass += '-' + columns;

        this.setState({klass});
    }
}
