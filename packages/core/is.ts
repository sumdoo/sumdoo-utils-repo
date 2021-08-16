const toString = Object.prototype.toString;

// =================================
// === 数据用途判断 start ===========
// =================================
export function is(val: unknown, type: string) {
    return toString.call(val) === `[object ${type}]`;
}

export function isDef<T = unknown>(val?: T): val is T {
    return typeof val !== 'undefined';
}

export function isUnDef<T = unknown>(val?: T): val is T {
    return !isDef(val);
}

export function isUndefined<T = unknown>(val?: T): val is T {
    return !isDef(val);
}

export function isObject(val: any): val is Record<any, any> {
    return val !== null && is(val, 'Object');
}
export function isEmptyObject(val: any): val is {} {
    return isObject(val) && Object.keys(val).length === 0;
}

export function isEmpty<T = unknown>(val: T): val is T {
    if (isArray(val) || isString(val)) {
        return val.length === 0;
    }

    if (val instanceof Map || val instanceof Set) {
        return val.size === 0;
    }

    if (isObject(val)) {
        return Object.keys(val).length === 0;
    }

    return false;
}

export function isDate(val: unknown): val is Date {
    return is(val, 'Date');
}

export function isNull(val: unknown): val is null {
    return val === null;
}

export function isNullAndUnDef(val: unknown): val is null | undefined {
    return isUnDef(val) && isNull(val);
}

export function isNullOrUnDef(val: unknown): val is null | undefined {
    return isUnDef(val) || isNull(val);
}

export function isNumber(val: unknown): val is number {
    return is(val, 'Number');
}

export function isPromise<T = any>(val: unknown): val is Promise<T> {
    return is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);
}

export function isString(val: unknown): val is string {
    return is(val, 'String');
}

export function isFunction(val: unknown): val is Function {
    return typeof val === 'function';
}

export function isBoolean(val: unknown): val is boolean {
    return is(val, 'Boolean');
}

export function isRegExp(val: unknown): val is RegExp {
    return is(val, 'RegExp');
}

export function isArray(val: any): val is Array<any> {
    return val && Array.isArray(val);
}

export function isWindow(val: any): val is Window {
    return typeof window !== 'undefined' && is(val, 'Window');
}

export function isElement(val: unknown): val is Element {
    return isObject(val) && !!val.tagName;
}

// =================================
// === 数据用途判断 end =============
// =================================

// =================================
// === 数据用途判断 start ===========
// =================================

/** 是否 SSR */
export const isServer = typeof window === 'undefined';

/** 是否 客户端 */
export const isClient = !isServer;

/** 检查返回参数的格式 */
export function isValidMap(map: any[] | { [key: string]: any }): boolean {
    return isArray(map) || isObject(map);
}

/** 是否本地环境 */
export function isLocahost() {
    return window.location.hostname === 'localhost';
}

/** 检查是否为 Base64 格式 */
export function isBase64(val: any): val is String {
    if (!val || !isString(val)) return false;

    const reg = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    return reg.test(val);
}

/** 检查是否为外链 */
export function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path);
}

/** 检查是否路径是否为绝对路径格式 */
export function isAbsoultePath(val: string): boolean {
    return !!val && /^[a-zA-Z]:(([a-zA-Z]*)||([a-zA-Z]*\\))*/.test(val);
}

/** 是否为身份证号码 */
export function isIdCard(val: string | number): boolean {
    return !!val && /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(String(val));
}

/** 是否为网址 */
export function isUrl(path: string): boolean {
    const reg =
        /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
    return reg.test(path);
}

/** 是否为手机号 */
export function isMobileNumber(val: string | number): boolean {
    return !!val && /^1[3|4|5|7|8][0-9]\d{8}$/.test(String(val));
}

/** 是否为邮箱 */
export function isEmail(val: string): boolean {
    return !!val && /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(val);
}

// =================================
// === 数据用途判断 end ===========
// =================================
