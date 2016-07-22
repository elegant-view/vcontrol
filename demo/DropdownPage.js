/**
 * @file DropdownPage
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import Dropdown from 'vcontrol/Dropdown/Dropdown';

export default class DropdownPage extends Component {
    getTemplate() {
        return `<ev-dropdown title="标题" variant="danger" items="\${state.items}" split="split"></ev-dropdown>`;
    }

    init() {
        this.setState({
            items: [
                {
                    label: '123',
                    onClick() {

                    }
                }
            ]
        });
    }

    getComponentClasses() {
        return [Dropdown];
    }
}
