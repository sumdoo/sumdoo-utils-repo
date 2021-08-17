import { preventDefault } from './dom_event';

// 屏蔽右键菜单
export function closeContextMenu() {
    document.oncontextmenu = function () {
        return false;
    };
}

// 屏蔽文本选中
export function closeTextSelected() {
    document.onselectstart = function () {
        return false;
    };
}

// 监听程序异常
function watchBowerErr() {
    try {
        if (window.addEventListener) {
            window.addEventListener('error', preventDefault);
            window.addEventListener('unhandledrejection', preventDefault);
        } else {
            // window.onerror(preventDefault);
        }
    } catch (e) {
        throw new Error(e);
    }
}

/** 打开新窗口 */
export function openWindow(
    url: string,
    opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean }
) {
    const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
    const feature: string[] = [];

    noopener && feature.push('noopener=yes');
    noreferrer && feature.push('noreferrer=yes');

    window.open(url, target, feature.join(','));
}

export function handleBowerErr() {
    watchBowerErr();
}
