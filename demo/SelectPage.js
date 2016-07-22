/**
 * @file SelectPage
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import Select from 'vcontrol/Select';

export default class SelectPage extends Component {
    getTemplate() {
        return `<ev-select>layer<a on-click="state.onclick()">\${state.content}</a></ev-select>`;
    }

    init() {
        const me = this;
        this.setState({
            onclick() {
                me.setState({content: Date.now()});
            },
            content: '变'
        });
    }

    getComponentClasses() {
        return [Select];
    }
}
