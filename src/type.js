/**
 * @file 类型检测
 * @author yibuyisheng(yibuyisheng@163.com)
 */

import u from 'underscore';

const STRING = Symbol('string');
const NUMBER = Symbol('number');

const REQUIRED = Symbol('required');
const TYPE = Symbol('type');


export const PropTypes = {
    string: {
        [TYPE]: STRING,
        [REQUIRED]: false,
        isRequired: {
            [TYPE]: STRING,
            [REQUIRED]: true
        }
    }
};

const typeCheckFns = {
    [STRING](value) {
        return u.isString(value);
    }
};

export default function (type) {
    if (!type || !(REQUIRED in type) || !(TYPE in type)) {
        throw new Error('wrong type');
    }

    return function (value) {
        return (type[REQUIRED] && value && typeCheckFns[type[TYPE]](value))
            || (!type[REQUIRED] && typeCheckFns[type[TYPE]](value));
    };
}
