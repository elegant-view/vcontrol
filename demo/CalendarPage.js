/**
 * @file CalendarPage
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import Calendar from 'vcontrol/Calendar/Calendar';

export default class CalendarPage extends Component {
    getTemplate() {
        return `
            <ev-calendar date="\${state.date}" on-select="\${state.onSelect}" years="\${state.years}"></ev-calendar>
        `;
    }

    getComponentClasses() {
        return [Calendar];
    }

    init() {
        this.setState({
            date: new Date(2011, 9, 1),
            years: [2011, 2012],
            onSelect(event) {
                console.log(event.get('value'));
            }
        });
    }
}
