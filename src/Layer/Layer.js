/**
 * @file Layer
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {propsType} from 'vcomponent/decorators';
import {PropTypes} from 'vcomponent/type';

const CONVERT_PROPS = Symbol('convertProps');

const rectType = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
@propsType({
    position: PropTypes.oneOf(['absolute', 'fixed']).required,
    top: rectType,
    left: rectType,
    width: rectType,
    height: rectType
})
export default class Layer extends Component {
    getTemplate() {
        return `
            <div class="${uiPrefix}-layer" style="\${state.style}"></div>
        `;
    }

    ready() {
        this[CONVERT_PROPS]();
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const style = this.state.style || {};
        style.top = this.props.top;
        style.left = this.props.left;
        style.width = this.props.width;
        style.height = this.props.height;
        style.position = this.props.position;
        this.setState({style});
    }
}
