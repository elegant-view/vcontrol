/**
 * @file Input
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {propsType} from 'vcomponent/decorators';
import {PropTypes} from 'vcomponent/type';
import u from 'underscore';
import {SIZE_ARRAY, uiPrefix} from '../variables';

const STATE_ARRAY = ['success', 'warning', 'danger'];

@propsType({
    readonly: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    type: PropTypes.oneOf(['file']),
    size: PropTypes.oneOf(SIZE_ARRAY),
    state: PropTypes.oneOf(STATE_ARRAY)
})
export default class Input extends Component {

    /**
     * getTemplate
     *
     * @protected
     * @override
     * @return {string}
     */
    getTemplate() {
        return `
            <input ev-rest="\${props}"
                readonly="\${state.readonly}"
                class="\${state.classList}" />
        `;
    }

    /**
     * init
     *
     * @protected
     * @override
     */
    init() {
        this.convertReadonly();
        this.convertType();
        this.convertSize();
        this.convertState();

        this.setState({
            classList: ['form-control']
        });
    }

    /**
     * propsChange
     *
     * @protected
     * @override
     * @param {Object} changedProps changedProps
     */
    propsChange(changedProps) {
        ('readonly' in changedProps) && this.convertReadonly();
        ('type' in changedProps) && this.convertType();
        ('state' in changedProps) && this.convertState();
    }

    /**
     * 转换一下readonly属性
     *
     * @private
     */
    convertReadonly() {
        if (!u.isUndefined(this.props.readonly)) {
            const readonly = u.isString(this.props.readonly)
                ? (this.props.readonly === 'true')
                : this.props.readonly;
            this.setState({readonly});
        }
    }

    /**
     * 转换一下type属性
     *
     * @private
     */
    convertType() {
        if (!u.isUndefined(this.props.type)) {
            const classList = this.state.classList || [];
            classList.push(`${uiPrefix}-form-control-file`);
            this.setState({classList});
        }
    }

    /**
     * 转换一下size属性
     *
     * @private
     */
    convertSize() {
        if (!u.isUndefined(this.props.size)) {
            const classList = this.state.classList || [];
            classList.push(`${uiPrefix}-form-control-${this.props.size}`);
            this.setState({classList});
        }
    }

    /**
     * 转换一下state属性
     *
     * @private
     */
    convertState() {
        if (!u.isUndefined(this.props.state)) {
            const classList = this.state.classList || [];
            classList.push(`${uiPrefix}-form-control-${this.props.state}`);
            this.setState({classList});
        }
    }
}
