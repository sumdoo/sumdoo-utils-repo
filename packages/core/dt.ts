import { isDate } from './is';

export const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六'];

type DateParams = string | number | Date;

/** 转换为 Date 实例  */
export function toDate(t: any) {
    if (!t) return null;
    if (t instanceof Date) return t;

    // 兼容ios日期只支持/的问题
    if (typeof t === 'string') {
        t = t.replace(/-/g, '/');
    }

    const d = new Date(t);
    // 检查日期对象是否为Invalid Date
    if (isNaN(d.getTime())) return null;

    return d;
}

/**
 * 格式化日期
 *
 * YY	18	    两位数的年份
 * YYYY	2018	四位数的年份
 * M	1-12	月份，从 1 开始
 * MM	01-12	月份，两位数
 * D	1-31	月份里的一天
 * DD	01-31	月份里的一天，两位数
 * H	0-23	小时
 * HH	00-23	小时，两位数
 * h	1-12	小时, 12 小时制
 * hh	01-12	小时, 12 小时制, 两位数
 * m	0-59	分钟
 * mm	00-59	分钟，两位数
 * s	0-59	秒
 * ss	00-59	秒 两位数
 */
export function format(t: Date | string, fmt = 'YYYY-MM-DD') {
    const d = toDate(t) || new Date();

    const year = String(d.getFullYear());
    const month = String(d.getMonth() + 1);
    const date = String(d.getDate());
    const hours = String(d.getHours());
    const minutes = String(d.getMinutes());
    const seconds = String(d.getSeconds());

    const map: { [key: string]: string } = {
        // YY: year.slice(-2),
        YYYY: year,
        // M: month,
        MM: repair(month),
        // D: date,
        DD: repair(date),
        // H: hours,
        HH: repair(hours),
        // h: hours, // 预留 12小时制 (不补零)
        // hh: hours, // 预留 12小时制 (补零)
        // m: minutes,
        mm: repair(minutes),
        // s: seconds,
        ss: repair(seconds),
    };

    for (const k in map) {
        if (map.hasOwnProperty(k)) {
            fmt = fmt.replace(k, map[k]);
        }
    }

    return fmt;

    function repair(n: number | string): string {
        return (Number(n) < 10 && '0' + n) || String(n);
    }
}

/** 日期构造函数 */
export function newDate(y: number, m: number, d: number) {
    const date = new Date(y, m - 1, d);
    return format(date);
}

/** 获取年 */
export function getYear(date: DateParams) {
    return new Date(date).getFullYear();
}

/** 获取月 */
export function getMonth(date: DateParams) {
    return new Date(date).getMonth() + 1;
}

/** 获取日 */
export function getDay(date: DateParams) {
    return new Date(date).getDate();
}

/** 今日 */
export function getToday() {
    return format(new Date());
}

/** 返回星期几的数字, 星期日返回 7 */
export function getWeekday(date: DateParams) {
    let w = new Date(date).getDay();
    if (w === 0) w = 7;
    return w;
}

/** 返回星期几中文标识 */
export function getWeekName(date: DateParams) {
    const w = new Date(date).getDay();
    return WEEK_DAYS[w];
}

/** 上日 */
export function prevDate(date: DateParams, amount = 1) {
    const d = new Date(date);
    d.setDate(d.getDate() - amount);
    return format(d);
}

/** 下日 */
export function nextDate(date: DateParams, amount = 1) {
    const d = new Date(date);
    d.setDate(d.getDate() + amount);
    return format(d);
}

/** 上月同日 */
export function prevMonthSameDate(date: DateParams) {
    const y = getYear(date);
    const m = getMonth(date) - 1;
    const d = getDay(date);

    date = newDate(y, m, d);

    const Y = getYear(date);
    const M = getMonth(date);
    if (y * 12 + m === Y * 12 + M) return date;

    return newDate(y, m + 1, 0);
}

/** 下月同日 */
export function nextMonthSameDate(date: DateParams) {
    const y = getYear(date);
    const m = getMonth(date) + 1;
    const d = getDay(date);

    date = newDate(y, m, d);

    const Y = getYear(date);
    const M = getMonth(date);
    if (y * 12 + m === Y * 12 + M) return date;

    return newDate(y, m + 1, 0);
}

/** 周的第一天 */
export function firstDateOfWeek(date: DateParams) {
    const day = getWeekday(date);
    return prevDate(date, day - 1);
}

/** 周的最后一天 */
export function lastDateOfWeek(date: DateParams) {
    const day = getWeekday(date);
    return nextDate(date, 7 - day);
}

/** 月的第一天 */
export function firstDateOfMonth(date: DateParams) {
    const y = getYear(date);
    const m = getMonth(date);
    return newDate(y, m, 1);
}

/** 月的最后一天 */
export function lastDateOfMonth(date: DateParams) {
    const y = getYear(date);
    const m = getMonth(date);
    return newDate(y, m + 1, 0);
}

/** 获得某月的天数 */
export function getMonthDays(y: number, m: number) {
    const d1 = new Date(newDate(y, m, 1));
    const d2 = new Date(newDate(y, m + 1, 1));
    return (Number(d2) - Number(d1)) / (1000 * 60 * 60 * 24);
}

/** 获得两天之间天数： 当天返回 0 含当天需加一 */
export function getDiffDays(d1: DateParams, d2: DateParams) {
    d1 = new Date(d1);
    d2 = new Date(d2);
    return (Number(d2) - Number(d1)) / (1000 * 60 * 60 * 24);
}

/** 获取月份第一天星期几 */
export const getFirstDayOfMonth = function (date: Date) {
    const temp = new Date(date.getTime());
    temp.setDate(1);
    return temp.getDay();
};

/** 获取当前周为一年的第几周 */
export const getWeekNumberOfYear = function (src: Date) {
    if (!isDate(src)) return null;
    const date = new Date(src.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return (
        1 +
        Math.round(
            ((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
        )
    );
};

// 生成数字数组
export const range = function (n: number) {
    return Array.from({ length: n }).map((_, n) => n);
};

// 补齐上月天数
export const getPrevMonthLastDays = (date: Date, amount: number) => {
    if (amount <= 0) return [];
    const temp = new Date(date.getTime());
    temp.setDate(0);
    const lastDay = temp.getDate();
    return range(amount).map((_, index) => lastDay - (amount - index - 1));
};
