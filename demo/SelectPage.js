/**
 * @file SelectPage
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import Select from 'vcontrol/Select';

export default class SelectPage extends Component {
    getTemplate() {
        return `
            <ev-select width="500" datasource="{state.datasource}" default-text="请输入"></ev-select>
        `;
    }

    init() {
        this.setState({
            datasource: [
                {
                    text: '1',
                    value: 1
                },
                {
                    text: '2',
                    value: 2
                },
                {
                    text: '3',
                    value: 3
                }
            ]
        });
    }

    getComponentClasses() {
        return [Select];
    }
}
