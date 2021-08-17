
import { isUndefined, dt } from '@sumdoo-utils/core';
import { openWindow      } from './window'

/** Base64 转 blob */
export function dataURLtoBlob(base64Buf: string): Blob {
    const arr      = base64Buf.split(',');
    const typeItem = arr[0];
    const mime     = typeItem.match(/:(.*?);/)![1];
    const bstr     = atob(arr[1]);

    let n       = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

/** 图片链接转 base64 */
export function urlToBase64(url: string, mineType?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let canvas = document.createElement('CANVAS') as Nullable<HTMLCanvasElement>;
        const ctx  = canvas!.getContext('2d');

        const img = new Image();

        img.crossOrigin = '';
        img.onload = function () {
            if (!canvas || !ctx) {
                return reject();
            }
            canvas.height = img.height;
            canvas.width  = img.width;
            ctx.drawImage(img, 0, 0);
            
            const dataURL = canvas.toDataURL(mineType || 'image/png');
            canvas = null;
            resolve(dataURL);
        };
        img.src = url;
    });
}



/**下载在线图片 */
export function downloadByOnlineUrl(url: string, filename: string, mime?: string, bom?: BlobPart) {
    urlToBase64(url).then((base64) => {
        downloadByBase64(base64, filename, mime, bom);
    });
}

/**基于base64下载图片 */
export function downloadByBase64(buf: string, filename: string, mime?: string, bom?: BlobPart) {
    const base64Buf = dataURLtoBlob(buf);
    downloadByData(base64Buf, filename, mime, bom);
}

/** 根据后台接口文件流下载 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
    const blobData = typeof bom !== 'undefined' ? [bom, data] : [data];
    const blob     = new Blob(blobData, { type: mime || 'application/octet-stream' });
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        const blobURL  = window.URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href          = blobURL;
        tempLink.setAttribute('download', filename);

        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }

        document.body.appendChild(tempLink);
        tempLink.click();

        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
    }
}

/** 根据文件地址下载文件 */
export function downloadByUrl({
    url,
    target = '_blank',
    fileName,
}: {
    url: string;
    target?: TargetContext;
    fileName?: string;
}): boolean {
    const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
    const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1;

    if (/(iP)/g.test(window.navigator.userAgent)) {
        console.error('Your browser does not support download!');
        return false;
    }
    if (isChrome || isSafari) {
        const link  = document.createElement('a');
        link.href   = url;
        link.target = target;

        if (link.download !== undefined) {
            link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length);
        }

        if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initEvent('click', true, true);
            link.dispatchEvent(e);
            return true;
        }
    }
    if (url.indexOf('?') === -1) {
        url += '?download';
    }

    openWindow(url, { target });
    return true;
}

// 导出 json 数据为 csv 文件
export function downloadExcelByData(
    title: { title: string; field: number; prop: string }[],
    data: any[],
    fileName?: string
): { ok: boolean; err: string } {
    if (!Array.isArray(title)) throw new Error('【JSONToExcelConvertor】 title 必须是个数组');
    if (!Array.isArray(data)) throw new Error('【JSONToExcelConvertor】 data 必须是个数组');
    if (!title.length) return { ok: false, err: '标题不能为空' };
    if (!data.length) return { ok: false, err: '暂无数据下载' };

    fileName = fileName || dt.format(new Date()); // 默认使用当前日期作为文件名

    let CSV = '';
    let title_row = ''; // 读取 title 行
    title.forEach((t) => {
        if (t.title) title_row += t.title + ',';
    });
    CSV += title_row + '\r\n';

    data.forEach((d) => {
        let row = '';
        title.forEach((t) => {
            let val: any = d[t.field];
            if (isUndefined(val)) val = '';

            if (t.title) row += `"${val}"\t,`;
        });
        CSV += row + '\r\n';
    });
    if (CSV === '') return { ok: false, err: '无效数据' };

    const url = new Blob(['\ufeff' + CSV], { type: 'text/csv' });
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(CSV, fileName + '.csv'); // 兼容 IE
    } else {
        const link: any = document.createElement('a');
        link.href = URL.createObjectURL(url);
        link.style = 'visibility:hidden';
        link.download = fileName + '.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return { ok: true, err: '' };
}
