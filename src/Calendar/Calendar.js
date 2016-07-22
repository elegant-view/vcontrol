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
import Event from '../Event';

const GET_DAYS = Symbol('getDays');
const CONVERT_PROPS = Symbol('convertProps');
const ON_YEAR_CHANGE = Symbol('onYearChange');
const ON_MONTH_CHANGE = Symbol('onMonthChange');
const ON_SELECT = Symbol('onSelect');
const CONVERT_YEARS = Symbol('convertYears');
const DAYS_CACHE = Symbol('daysCache');

@propsType({
    date: PropTypes.date,
    onSelect: PropTypes.func,
    years: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.number)])
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
                            onchange="\${state.onYearChange}"
                            ref="yearCtrl">
                        </ev-select>年
                        <ev-select class="${uiPrefix}-form-control"
                            value="\${state.selectedMonth}"
                            items="\${state.months}"
                            onchange="\${state.onMonthChange}"
                            ref="monthCtrl">
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
                            <span class="enable \${isSelectedDate?'selected':''}"
                                on-click="state.onSelect(day)">
                                \${day.date.getDate()}
                            </span>
                        <!-- /if -->
                    <!-- /for -->
                </div>
            </div>
        `;
    }

    init() {
        // 每个月显示的“天”数据都会是固定的，所以可以缓存起来，不用每次计算
        this[DAYS_CACHE] = {};
        this.defaultDate = new Date();

        this[CONVERT_PROPS]();
        this[CONVERT_YEARS]();

        const date = this.props.date || this.defaultDate;
        this.setState({
            selectedYear: date.getFullYear(),
            selectedMonth: date.getMonth() + 1,
            selectedDay: date.getDate(),
            onYearChange: ::this[ON_YEAR_CHANGE],
            onMonthChange: ::this[ON_MONTH_CHANGE],
            onSelect: ::this[ON_SELECT]
        });
    }

    propsChange(changedProps) {
        this[CONVERT_PROPS]();

        if ('years' in changedProps) {
            this[CONVERT_YEARS]();
        }

        // date发生了变化就要重新设置一下选择的年月日
        if ('date' in changedProps) {
            const date = this.props.date || this.defaultDate;
            this.setState({
                selectedYear: date.getFullYear(),
                selectedMonth: date.getMonth() + 1,
                selectedDay: date.getDate()
            });
        }
    }

    [CONVERT_PROPS]() {
        const date = this.props.date || this.defaultDate;
        const months = u.map(u.range(12), num => ({
            label: num + 1,
            value: num + 1
        }));
        this.setState({
            days: this[GET_DAYS](date),
            months
        });
    }

    [CONVERT_YEARS]() {
        let years;

        if (this.props.years) {
            if (u.isArray(this.props.years)) {
                years = this.props.years;
            }
            else if (u.isNumber(this.props.years.max) && u.isNumber(this.props.years.min)) {
                years = u.range(this.props.years.min, this.props.years.min, 1);
            }
        }

        if (!years) {
            const curYear = (new Date()).getFullYear();
            years = u.range(curYear - 5, curYear + 5, 1);
        }

        this.setState({
            years: years.map(year => ({value: year, label: year}))
        });
    }

    /**
     * 计算指定月份应该显示出来的“天”数据
     *
     * @private
     * @param  {Date} date 日期对象，实际上只有年和月有作用。
     * @return {Array.<Object>}
     */
    [GET_DAYS](date) {
        const cacheKey = date.getFullYear() + '-' + (date.getMonth() + 1);
        if (this[DAYS_CACHE][cacheKey]) {
            return this[DAYS_CACHE][cacheKey];
        }

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
            tempDate.setDate(tempDate.getDate() + 1);
            days.push({
                date: new Date(tempDate.getTime()),
                weekDay: getDay(tempDate),
                disabled: true
            });
        }

        this[DAYS_CACHE][cacheKey] = days;
        return days;

        function getDay(date) {
            const day = date.getDay();
            return day === 0 ? 7 : day;
        }
    }

    [ON_YEAR_CHANGE](event) {
        const selectedYear = parseInt(this.refs.yearCtrl.getValue(), 10);
        const date = new Date(selectedYear, this.refs.monthCtrl.getValue(), 0);
        this.setState({
            days: this[GET_DAYS](date),
            selectedYear,
            selectedDay: null
        });
    }

    [ON_MONTH_CHANGE](event) {
        const selectedMonth = parseInt(this.refs.monthCtrl.getValue(), 10);
        const date = new Date(this.refs.yearCtrl.getValue(), selectedMonth, 0);

        this.setState({
            days: this[GET_DAYS](date),
            selectedMonth,
            selectedDay: null
        });
    }

    [ON_SELECT](day) {
        this.setState({
            selectedYear: day.date.getFullYear(),
            selectedMonth: day.date.getMonth() + 1,
            selectedDay: day.date.getDate()
        });

        if (this.props.onSelect) {
            const event = new Event(this, null, 'select');
            event.set('value', this.getValue());
            this.props.onSelect(event);
        }
    }

    getValue() {
        return new Date(this.state.selectedYear, this.state.selectedMonth - 1, this.state.selectedDay);
    }

    getComponentClasses() {
        return [Dropdown, Select];
    }
}
