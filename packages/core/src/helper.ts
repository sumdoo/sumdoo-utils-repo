const TIMERS: Record<string, ReturnType<typeof setTimeout>> = {};
export function sleep(time: number, key?: string) {
    // 清除相同key的timer
    if (key) {
        const timer = TIMERS[key];
        if (timer) {
            clearTimeout(timer);
            delete TIMERS[key];
        }
    }

    // 未指明时间
    if (!time) return Promise.resolve(true);

    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            if (!key) {
                resolve(true);
            } else if (TIMERS[key] === timer) {
                delete TIMERS[key];
                resolve(true);
            }
        }, time);

        if (key) {
            TIMERS[key] = timer;
        }
    });
}

/** 计算已上传进度的百分比 */
export function getPercentage(loaded: number, total: number) {
    return Math.round((loaded / total) * 10000) / 100;
}

/**
 * thumbnail 缩放
 * foramt 转换格式
 * interlace 开启jpg渐进模式，需要图片为 jpg格式
 * quality 图片质量  0 - 100
 * gravity/center 居中裁剪
 * crop 输出图片尺寸
 */
/** cos 转换 */
export function imgMore2(size: number, position = 'center', format = 'webp') {
    const [w, h] = Array.isArray(size) ? size : [size, size];

    const thumbnail = `thumbnail/!${w}x${h}r`;
    const output = `crop/${w}x${h}`;
    const gravity = `gravity/${position}`;
    return `imageMogr2/${thumbnail}/${format}quality/100/${gravity}/${output}`;
}
