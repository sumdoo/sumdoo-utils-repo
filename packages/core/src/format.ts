import { isNumber, isString, isBoolean } from './is';

/** 格式化千分份,和小数位 */
export function formatThousands(value: string | number) {
    return String(value).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
}

/** 格式化金额类 */
export function formatPrice(val: string | number, emptyText = '') {
    val = Number(val);
    if (!isNumber(val)) return emptyText;

    return !val ? '' : val.toFixed(2);
}

/** 格式化比率类 */
export function formatRate(val: string | number, emptyText = '') {
    val = Number(val);
    if (!isNumber(val)) return emptyText;

    return (val * 100).toFixed(2) + '%';
}

/** 格式化比较比率类 */
export function formatDiffRate(val: string | number, emptyText = '-') {
    if (!val || !isNumber(val)) return emptyText;

    return val > 0 ? `+ ${val}%` : `- ${Math.abs(val)}%`;
}

/** 格式化勾选类 */
export function formatChecked(val: string | number | boolean, emptyText = '') {
    val = (isNumber(val) && !!val) || (isString(val) && !!Number(val)) || (isBoolean(val) && val);

    if (!isBoolean(val)) return emptyText;

    return (!!val && '√') || '';
}

/** 格式化字符串类 */
export function formatStr(val: string | number | boolean, trueVal = '是', falseVal = '否') {
    val = (isNumber(val) && !!val) || (isString(val) && !!Number(val)) || (isBoolean(val) && val);

    if (!isBoolean(val)) return '';

    return val ? trueVal : falseVal;
}
