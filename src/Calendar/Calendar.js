/**
 * @file Calendar
 * @author yibuyisheng(yibuyisheng@163.com)
 * @flow
 */

import Component from 'vcomponent/Component';
import Dropdown from '../Dropdown/Dropdown';
import Select from '../Form/Select';
import {uiPrefix} from '../variables';
import {propsType} from 'vcomponent/decorators';
import {PropTypes} from 'vcomponent/type';
import u from 'underscore';

const GET_DAYS = Symbol('getDays');
const CONVERT_PROPS = Symbol('convertProps');
const ON_YEAR_CHANGE = Symbol('onYearChange');
const ON_MONTH_CHANGE = Symbol('onMonthChange');

@propsType({
    date: PropTypes.date.required
})
export default class Calendar extends Component {
    getTemplate() {
        return `
            <div class="${uiPrefix}-calendar">
                <div class="head">
                    <div class="center">
                        <ev-select class="${uiPrefix}-form-control"
                            value="\${state.selectedYear}"
                            items="\${state.years}"
                            onchange="\${onYearChange}">
                        </ev-select>年
                        <ev-select class="${uiPrefix}-form-control"
                            value="\${state.selectedMonth}"
                            items="\${state.months}"
                            onchange="\${onMonthChange}">
                        </ev-select>月
                    </div>
                </div>
                <div class="week">
                    <span>一</span>
                    <span>二</span>
                    <span>三</span>
                    <span>四</span>
                    <span>五</span>
                    <span>六</span>
                    <span>日</span>
                </div>
                <div class="day">
                    <!-- for: state.days as day -->
                        <!-- var: isSelectedDate = state.selectedYear === day.date.getFullYear()
                            && state.selectedMonth === day.date.getMonth() + 1
                            && state.selectedDay === day.date.getDate()
                        -->
                        <!-- if: day.disabled -->
                            <span class="disabled \${isSelectedDate?'selected':''}">
                                \${day.date.getDate()}
                            </span>
                        <!-- else -->
                            <span class="enable \${isSelectedDate?'selected':''}">
                                \${day.date.getDate()}
                            </span>
                        <!-- /if -->
                    <!-- /for -->
                </div>
            </div>
        `;
    }

    ready() {
        this[CONVERT_PROPS]();

        this.setState({
            selectedYear: this.state.years[1].label,
            selectedMonth: 6,
            selectedDay: 1,
            onYearChange: ::this[ON_YEAR_CHANGE],
            onMonthChange: ::this[ON_MONTH_CHANGE]
        });
    }

    propsChange() {
        this[CONVERT_PROPS]();
    }

    [CONVERT_PROPS]() {
        const date = this.props.date;
        const years = [
            {
                label: date.getFullYear() - 1
            },
            {
                label: date.getFullYear()
            },
            {
                label: date.getFullYear() + 1
            }
        ];
        const months = u.map(u.range(12), num => ({label: num + 1}));
        this.setState({
            days: this[GET_DAYS](date),
            years,
            months
        });
    }

    [GET_DAYS](date) {
        const days = [];
        let tempDate = new Date(date.getTime());
        for (tempDate.setDate(1);
            tempDate.getMonth() === date.getMonth();
            tempDate.setDate(tempDate.getDate() + 1)
        ) {
            days.push({
                date: new Date(tempDate.getTime()),
                weekDay: getDay(tempDate),
                disabled: false
            });
        }

        // 补足前面几天
        tempDate = new Date(date.getTime());
        // 拿到上一个月的最后一天
        tempDate.setDate(0);
        for (let i = days[0].weekDay - 1; i >= 1; --i) {
            days.splice(0, 0, {
                date: new Date(tempDate.getTime()),
                weekDay: getDay(tempDate),
                disabled: true
            });
            tempDate.setDate(tempDate.getDate() - 1);
        }

        // 补足后面几天
        tempDate = new Date(date.getTime());
        // 拿到下一个月的第一天
        tempDate.setMonth(tempDate.getMonth() + 1, 0);
        for (let i = days[days.length - 1].weekDay + 1; i <= 7; ++i) {
            days.push({
                date: new Date(tempDate.getTime()),
                weekDay: getDay(tempDate),
                disabled: true
            });
            tempDate.setDate(tempDate.getDate() + 1);
        }
        return days;

        function getDay(date) {
            const day = date.getDay();
            return day === 0 ? 7 : day;
        }
    }

    [ON_YEAR_CHANGE](event) {
        this.setState({
            selectedYear: event.get('item').label
        });
    }

    [ON_MONTH_CHANGE](event) {
        this.setState({
            selectedMonth: event.get('item').label
        });
    }

    getComponentClasses() {
        return [Dropdown, Select];
    }
}
