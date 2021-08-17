
/** 对象转 query */
export const objToQuery = function (obj: { [key: string]: number | string }) {
    if (!obj) return '';

    let str = '';
    Object.keys(obj).forEach((k) => {
        if (obj[k]) str += str ? `&${k}=${obj[k]}` : `${k}=${obj[k]}`;
    });

    return str ? `?${str}` : str;
};

/** query 转对象 */
export const queryToObj = function (query: string) {
    const obj: Record<string, string> = {};

    if (!query) return {};

    query.split('&').forEach((q) => {
        if (typeof q !== 'string' || !q) return;

        const [key, val] = q.split('=');
        if (key && val !== undefined) {
            obj[encodeURIComponent(key)] = encodeURIComponent(val);
        }
    });

    return obj;
};
