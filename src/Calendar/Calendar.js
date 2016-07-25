/**
 * @file Calendar
 * @author yibuyisheng(yibuyisheng@163.com)
 * @flow
 */

import Component from 'vcomponent/Component';
import Dropdown from '../Dropdown/Dropdown';
import {uiPrefix} from '../variables';
import {propsType} from 'vcomponent/decorators';
import {PropTypes} from 'vcomponent/type';
import u from 'underscore';
import Event from '../Event';
import Select from '../Select';

const GET_DAYS = Symbol('getDays');
const ON_YEAR_CHANGE = Symbol('onYearChange');
const ON_MONTH_CHANGE = Symbol('onMonthChange');
const ON_SELECT = Symbol('onSelect');
const CONVERT_YEARS = Symbol('convertYears');
const DAYS_CACHE = Symbol('daysCache');

@propsType({
    date: PropTypes.date,
    onChange: PropTypes.func,
    years: PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.number)])
})
export default class Calendar extends Component {

    /**
     * getTemplate
     *
     * @public
     * @override
     * @return {string}
     */
    getTemplate() {
        return `
            <div class="${uiPrefix}-calendar">
                <div class="head">
                    <div class="center">
                        <ev-select value="{state.selectedYear}"
                            datasource="{state.years}"
                            on-change="{state.onYearChange}"
                            ref="yearCtrl"
                            size="small"
                            width="70">
                        </ev-select>年
                        <ev-select value="{state.selectedMonth}"
                            datasource="{state.months}"
                            on-change="{state.onMonthChange}"
                            ref="monthCtrl"
                            size="small"
                            width="50">
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
                            <span class="disabled {isSelectedDate?'selected':''}">
                                {day.date.getDate()}
                            </span>
                        <!-- else -->
                            <span class="enable {isSelectedDate?'selected':''}"
                                on-click="state.onSelect(day)">
                                {day.date.getDate()}
                            </span>
                        <!-- /if -->
                    <!-- /for -->
                </div>
            </div>
        `;
    }

    /**
     * constructor
     *
     * @public
     */
    constructor() {
        super();

        // 每个月显示的“天”数据都会是固定的，所以可以缓存起来，不用每次计算
        this[DAYS_CACHE] = {};
        this.defaultDate = new Date();

        const date = this.props.date || this.defaultDate;
        this.state = {
            selectedYear: date.getFullYear(),
            selectedMonth: date.getMonth() + 1,
            selectedDay: date.getDate(),
            onYearChange: ::this[ON_YEAR_CHANGE],
            onMonthChange: ::this[ON_MONTH_CHANGE],
            onSelect: ::this[ON_SELECT],
            months: u.map(u.range(1, 12), month => ({text: '' + month, value: month})),
            days: this[GET_DAYS](date)
        };
    }

    /**
     * init
     *
     * @public
     * @override
     */
    init() {
        this[CONVERT_YEARS]();
    }

    /**
     * propsChange
     *
     * @public
     * @override
     * @param  {Object} changedProps changedProps
     */
    propsChange(changedProps) {
        if ('date' in changedProps) {
            const date = this.props.date || this.defaultDate;
            this.setState({
                days: this[GET_DAYS](date),
                selectedYear: date.getFullYear(),
                selectedMonth: date.getMonth() + 1
            });
        }

        if ('years' in changedProps) {
            this[CONVERT_YEARS]();
        }
    }

    /**
     * 转换一下年相关属性
     *
     * @private
     */
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
            years: years.map(year => ({value: year, text: '' + year}))
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

    /**
     * 年发生变化的回调函数
     *
     * @private
     * @param  {Event} event 事件对象
     */
    [ON_YEAR_CHANGE](event) {
        const selectedYear = event.get('selected').value;
        const selectedMonthItem = this.refs.monthCtrl.getSelected();
        if (!selectedMonthItem) {
            return;
        }
        const selectedMonth = selectedMonthItem.value;

        const date = new Date(selectedYear, selectedMonth, 0);
        this.setState({
            days: this[GET_DAYS](date),
            selectedYear,
            selectedDay: null
        });
    }

    /**
     * 月发生改变的回调函数
     *
     * @private
     * @param  {Event} event 事件对象
     */
    [ON_MONTH_CHANGE](event) {
        const selectedMonth = event.get('selected').value;
        const selectedYearItem = this.refs.yearCtrl.getSelected();
        if (!selectedYearItem) {
            return;
        }
        const selectedYear = selectedYearItem && selectedYearItem.value;

        const date = new Date(selectedYear, selectedMonth, 0);
        this.setState({
            days: this[GET_DAYS](date),
            selectedMonth,
            selectedDay: null
        });
    }

    /**
     * 选中天回调
     *
     * @private
     * @param  {Object} day 当前选中的天
     */
    [ON_SELECT](day) {
        this.setState({
            selectedYear: day.date.getFullYear(),
            selectedMonth: day.date.getMonth() + 1,
            selectedDay: day.date.getDate()
        });

        if (this.props.onChange) {
            const event = new Event(this, null, 'select');
            event.set('value', this.getValue());
            this.props.onChange(event);
        }
    }

    /**
     * 获取当前选中的日期
     *
     * @public
     * @return {Date}
     */
    getValue() {
        return new Date(this.state.selectedYear, this.state.selectedMonth - 1, this.state.selectedDay);
    }

    /**
     * getComponentClasses
     *
     * @public
     * @override
     * @return {Array.<Component>}
     */
    getComponentClasses() {
        return [Dropdown, Select];
    }
}
