/**
 * @file 控件事件回调中的事件对象
 * @author yibuyisheng(yibuyisheng@163.com)
 */

const COMPONENT = Symbol('component');
const ORIGINAL_EVENT = Symbol('originalEvent');
const EVENT_NAME = Symbol('eventName');
const STORE = Symbol('store');

export default class Event {
    constructor(component, originalEvent, eventName) {
        this[COMPONENT] = component;
        this[ORIGINAL_EVENT] = originalEvent;
        this[EVENT_NAME] = eventName;
        this[STORE] = {};
    }

    get target() {
        return this[COMPONENT];
    }

    set(key, value) {
        this[STORE][key] = value;
    }

    get(key) {
        return this[STORE][key];
    }

    preventDefault() {
        this[ORIGINAL_EVENT].preventDefault();
        this.isPreventDefault = true;
    }

    stopPropagation() {
        this[ORIGINAL_EVENT].stopPropagation();
        this.isStopPropagation = true;
    }
}
