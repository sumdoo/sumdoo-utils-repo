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

