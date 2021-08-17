/** 压缩图片 */
export async function mininfyImgByUrl(file: any) {
    const url = URL.createObjectURL(file.raw);

    const img = await loadImg(url);
    return new Promise((resolve) => {
        const canvas  = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width  = 400;
        canvas.height = 300;

        context.drawImage(img, 0, 0, 400, 300);
        canvas.toBlob((blob) => {
            resolve(blob);
        }, file.type);
    });
}

/** 加载图片 */
export function loadImg(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = function () {
            resolve(img);
        };

        img.onerror = function (err) {
            reject(err);
        };
    });
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
