
/** 警告日志输出 */
export function warn(name: string, message: string) {
    console.warn(`[${name} warn]:${message}`);
}

/** 异常日志输出 */
export function error(name: string, message: string) {
    throw new Error(`[${name} error]:${message}`);
}
