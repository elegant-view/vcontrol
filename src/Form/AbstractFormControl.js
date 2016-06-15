/**
 * @file form control的公共基类
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import {uiPrefix} from '../variables';
import {inArray} from '../util';
import {SIZE_ARRAY, CONVERT_PROPS} from '../variables';

const STATE_ARRAY = ['success', 'warning', 'danger'];

export default class AbstractFormControl extends Component {
    [CONVERT_PROPS]() {
        const classList = this.state.classList || [];
        if (this.props.type === 'file') {
            classList.push(`${uiPrefix}-form-control-file`);
        }
        else {
            classList.push(`${uiPrefix}-form-control`);
        }

        if (inArray(this.props.size, SIZE_ARRAY)) {
            classList.push(`${uiPrefix}-form-control-${this.props.size}`);
        }

        if (inArray(this.props.state, STATE_ARRAY)) {
            classList.push(`${uiPrefix}-form-control-${this.props.state}`);
        }

        this.setState({classList});
    }
}
