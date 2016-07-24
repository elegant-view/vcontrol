/**
 * @file 处理css class
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import * as util from './util';
import Data from 'vtpl/Data';

const CLASS_LIST = Symbol('classList');
const ADD = Symbol('add');
const REMOVE = Symbol('remove');

export default class CssClass extends Data {

    constructor() {
        super();
        this[CLASS_LIST] = [];
    }

    /**
     * 添加CSS类
     *
     * @private
     * @param  {string} str css类
     */
    [ADD](str) {
        if (!this.has(str)) {
            this[CLASS_LIST].push(str);
        }
    }

    /**
     * 添加CSS类
     *
     * @public
     * @param {string|Array.<string>} str CSS类
     * @return {CssClass}
     */
    add(str) {
        let cssArray;

        if (util.isString(str)) {
            cssArray = CssClass.parseFromString(str);
        }
        else if (util.isArray(str)) {
            cssArray = str;
        }
        else {
            return this;
        }

        for (let i = 0, il = cssArray.length; i < il; ++i) {
            this[ADD](cssArray[i]);
        }

        return this;
    }

    /**
     * 移除CSS类
     *
     * @private
     * @param  {string} str CSS类
     */
    [REMOVE](str) {
        for (let i = 0, il = this[CLASS_LIST].length; i < il; ++i) {
            if (this[CLASS_LIST][i] === str) {
                this[CLASS_LIST].splice(i, 1);
                break;
            }
        }
    }

    /**
     * 判断是否有某个CSS类
     *
     * @public
     * @param  {string}  str CSS类
     * @return {boolean}
     */
    has(str) {
        for (let i = 0, il = this[CLASS_LIST].length; i < il; ++i) {
            if (this[CLASS_LIST][i] === str) {
                return true;
            }
        }

        return false;
    }

    /**
     * 移除CSS类
     *
     * @public
     * @param  {string|Array.<string>} str CSS类
     * @return {CssClass}
     */
    remove(str) {
        let cssArray;

        if (util.isString(str)) {
            cssArray = CssClass.parseFromString(str);
        }
        else if (util.isArray(str)) {
            cssArray = str;
        }
        else {
            return this;
        }

        for (let i = 0, il = cssArray.length; i < il; ++i) {
            this[REMOVE](cssArray[i]);
        }

        return this;
    }

    /**
     * clone
     *
     * @public
     * @override
     * @return {CssClass}
     */
    clone() {
        const cssClass = new CssClass();
        cssClass.add(this[CLASS_LIST]);
        return cssClass;
    }

    /**
     * 判断是否相等
     *
     * @public
     * @override
     * @param  {CssClass} cssClass CssClas实例
     * @return {boolean}
     */
    equals(cssClass) {
        if (cssClass === undefined || this[CLASS_LIST].length !== cssClass[CLASS_LIST].length) {
            return false;
        }

        for (let i = 0, il = this[CLASS_LIST].length; i < il; ++i) {
            let isContain = false;
            for (let j = 0, jl = cssClass[CLASS_LIST].length; j < jl; ++j) {
                if (this[CLASS_LIST][i] === cssClass[CLASS_LIST][j]) {
                    isContain = true;
                    break;
                }
            }

            if (!isContain) {
                return false;
            }
        }

        return true;
    }

    /**
     * 格式化成字符串
     *
     * @public
     * @return {string}
     */
    toString() {
        return this[CLASS_LIST].join(' ');
    }

    /**
     * 从字符串中解析出css类名
     *
     * @static
     * @param  {string} str 待解析的字符串
     * @return {Array.<string>}     css类字符串数组
     */
    static parseFromString(str) {
        return str ? str.split(/\s+/) : [];
    }
}
