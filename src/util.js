/**
 * @file 一些工具方法
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import * as util from 'vcomponent/utils';

export function inArray(value, arr) {
    let ret = false;
    arr.find(item => {
        if (item === value) {
            ret = true;
            return true;
        }
    });
    return ret;
}

export function isString(value) {
    return util.isClass(value, 'String');
}

export * from 'vcomponent/utils';
