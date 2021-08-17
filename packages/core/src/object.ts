
import { isString, isObject } from './is';

/** 字符串获取属性 */
export function getObjVal(key: string, obj: any, max: number): any {
    if (!key || !isString(key) || !isObject(obj)) return;

    // 一层直接返回
    const keys: any[] = key.split('.');
    max = max === undefined ? keys.length - 1 : max;
    max = Math.max(0, max);

    if (keys.length === 1) {
        return (obj as any)[key];
    } else {
        const val = (obj as any)[keys[0]];
        if (!max) return val;

        keys.shift();
        if (keys.length) {
            return getObjVal(keys.join('.'), val, --max);
        } else {
            return val;
        }
    }
}
