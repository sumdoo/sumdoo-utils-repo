/** 转换单词首字母大写 */
export const upperFirst = (word: string) => {
    return !word ? '' : word.replace(word[0], word[0].toLocaleUpperCase());
};

/**
 * 分隔字符
 * : 分隔的都是字符
 * _ 左侧字符、右侧数字
 */
 export function splitStr(str: string) {
    str = str.trim();
    if (!str) return [];

    let arr: string[] = [];
    const toNumber = str.indexOf('_') !== -1;
    if (str.indexOf(':') !== -1) {
        arr = str.split(':');
    } else if (str.indexOf('：') !== -1) {
        arr = str.split('：');
    } else if (toNumber) {
        arr = str.split('_');
    } else {
        return [str, ''];
    }

    if (!toNumber) {
        return [arr[0].trim(), arr[1].trim()];
    } else {
        return [arr[0].trim(), Number(arr[1].trim())];
    }
}
