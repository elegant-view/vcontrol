/**
 * @file Calendar
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import Component from 'vcomponent/Component';
import u from 'underscore';
import Dropdown from '../Dropdown/Dropdown';
import {uiPrefix} from '../variables';
import {propsType} from 'vcomponent/decorators';
import {PropTypes} from 'vcomponent/type';

const GET_DAYS = Symbol('getDays');
const CONVERT_PROPS = Symbol('convertProps');

@propsType({
    date: PropTypes.date.required
})
export default class Calendar extends Component {
    getTemplate() {
        return `
            <div class="${uiPrefix}-calendar">
                <div class="head">
                    <div class="left">
                        <span class="glyphicon glyphicon-chevron-left"></span>
                    </div>
                    <div class="center">
                            <ev-dropdown items="\${state.years}"
                                on-item-selected="\${state.onYearChange}">
                            </ev-dropdown>
                            年
                            <!-- <ev-dropdown items="\${state.months}"
                                type="default"
                                on-item-selected="\${state.onMonthChange}">
                            </ev-dropdown>
                            月 -->
                    </div>
                    <div class="right">
                        <span class="glyphicon glyphicon-chevron-right"></span>
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
                        <!-- if: day.disabled -->
                            <span class="disabled">\${day.date.getDate()}</span>
                        <!-- else -->
                            <span class="enable">\${day.date.getDate()}</span>
                        <!-- /if -->
                    <!-- /for -->
                </div>
            </div>
        `;
    }

    constructor() {
        super();
        this.state.years = [];
    }

    ready() {
        this[CONVERT_PROPS]();
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
        this.setState({
            days: this[GET_DAYS](date),
            years
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

    getComponentClasses() {
        return [Dropdown];
    }
}
