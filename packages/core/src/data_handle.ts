import { isObject } from './is';

/** 将后端返回的 rows cols 转换成前端可用的列表 */
export function rowsWithColsToList(data?: { rows: any[]; cols: string[] }) {
    if (!isObject(data)) return [];
    
    const { rows, cols } = data;
    if (!rows || !cols) return [];

    return rows.map((r) => {
        const obj: Record<string, any> = {};
        cols.forEach((c, i) => {
            obj[c] = r[i];
        });

        return obj;
    });
}

// 排序列表：默认倒叙
export function sortBy(list: any[], prop: string, is_flashback = true) {
    list.sort((a, b) => {
        if (a[prop] > b[prop]) return is_flashback ? -1 : 1;
        if (a[prop] < b[prop]) return is_flashback ? 1 : -1;
        return 0;
    });

    return list;
}

/** 数组转 options 列表 */
export function arrToOptions(...rest: any[]) {
    return rest.map((arr) => {
        return { label: arr[0], value: arr[1] };
    });
}

/** 字符串转 options 列表：仅适合label，value 都是string类型 */
export function strToOptions(...rest: string[]) {
    return rest.map((str) => {
        const [label, value] = str.split(':');
        return { label: label.trim(), value: value.trim() };
    });
}

// 生成 Options [[label, value, childrens[] ]
export function genDeepOptions(options: any[]) {
    return options.map((arr) => {
        // 数组形式
        if (Array.isArray(arr)) {
            const o: any = { label: arr[0], value: arr[1] };

            if (Array.isArray(arr[2])) {
                o.children = genDeepOptions(arr[2]);
            }

            return o;
        }

        return arr;
    });
}

/** 查询列表中字段的最大值 */
export function findListMaxVal(list = [], prop = '') {
    if (!Array.isArray(list)) {
        throw new Error('list must a array');
    }
    if (!prop) {
        throw new Error('list must a string');
    }

    let max = (list[0] && list[0][prop]) || 0;
    list.forEach((item) => {
        if (item[prop] > max) max = item[prop];
    });

    return Number(max);
}
