
/**
 * 获取顶部弹窗容器
 * 2000 ~ 3000 属性弹窗专用
 */
 function getTopDiv() {
    const divs = document.querySelectorAll('div[style*="z-index"]');
    if (!divs || !divs.length) return document;

    const list: HTMLDivElement[] = [];
    for (let i = 0; i < divs.length; i++) {
        const item: any = divs[i];
        const zIndex = Number(item.style.zIndex) || 0;

        if (isVisible(item) && zIndex >= 2000 && zIndex <= 3000) {
            list.push(divs[i] as HTMLDivElement);
        }
    }
    if (!list || !list.length) return document;

    // 排序顶部弹窗容器
    list.sort((a, b) => {
        const aIndex = a.style.zIndex || 0;
        const bIndex = b.style.zIndex || 0;
        return Number(bIndex) - Number(aIndex);
    });

    return list[0];
}

/** 获取元素样式属性  */
export function getStyle(el: any, attr: any) {
    if (el.currentStyle) return el.currentStyle[attr];
    return document.defaultView && document.defaultView.getComputedStyle(el, null)[attr];
}

/** 检查当前元素是否可视 */
export function isVisible(el: any): boolean {
    const visible = getStyle(el, 'display') !== 'none' && getStyle(el, 'visibility') !== 'hidden';
    if (!visible) return false;

    const p = el.parentNode;
    if (p === document.body) return true;

    return isVisible(p);
}

/** 获取元素上一个/下一个焦点元素 */
export function focusNext(isShift: boolean) {
    const $f = document.activeElement;
    if ($f) return;

    const topDiv = getTopDiv();
    const arr = topDiv.querySelectorAll('input, select, textarea, radio, checkbox, [tabIndex]');
    if (!arr || !arr.length) return;

    const list: HTMLFormElement[] = [];
    for (let i = 0; i < arr.length; i++) {
        const item: any = arr[i];
        const tabIndex = Number(item.tabIndex) || 0;
        const isUpload = item.className.indexOf('el-upload') !== -1;

        if (isVisible(item) && !item.disabled && tabIndex >= 0 && !isUpload) {
            list.push(arr[i] as HTMLFormElement);
        }
    }
    if (isShift) list.reverse();

    let $ne: HTMLElement | null = null;
    for (let i = 0; i < list.length; i++) {
        const $e = list[i];
        if ($e === $f) {
            $ne = list[i + 1];
            break;
        }
    }

    $ne = $ne || list[0];
    $ne && $ne !== $f && $ne.focus();
}

export function getBoundingClientRect(element: Element): DOMRect | number {
    if (!element || !element.getBoundingClientRect) {
        return 0;
    }
    return element.getBoundingClientRect();
}

/**
 * 获取当前元素的左偏移量和上偏移量
 * left：最左边的元素与文档左侧之间的距离
 * top：从元素顶部到文档顶部的距离
 * right：从元素最右边到文档右边的距离
 * bottom：从元素底部到文档底部的距离
 * rightIncludeBody：最左边的元素和文档右侧之间的距离
 * bottomIncludeBody：从元素底部到文档底部的距离
 */
export interface ViewportOffsetResult {
    left             : number;
    top              : number;
    right            : number;
    bottom           : number;
    rightIncludeBody : number;
    bottomIncludeBody: number;
}
export function getViewportOffset(element: Element): ViewportOffsetResult {
    const doc = document.documentElement;

    const docScrollLeft = doc.scrollLeft;
    const docScrollTop  = doc.scrollTop;
    const docClientLeft = doc.clientLeft;
    const docClientTop  = doc.clientTop;

    const pageXOffset = window.pageXOffset;
    const pageYOffset = window.pageYOffset;

    const box = getBoundingClientRect(element);

    const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect;

    const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
    const scrollTop  = (pageYOffset || docScrollTop) - (docClientTop || 0);
    const offsetLeft = retLeft + pageXOffset;
    const offsetTop  = rectTop + pageYOffset;

    const left = offsetLeft - scrollLeft;
    const top  = offsetTop - scrollTop;

    const clientWidth  = window.document.documentElement.clientWidth;
    const clientHeight = window.document.documentElement.clientHeight;
    return {
        left             : left,
        top              : top,
        right            : clientWidth  - rectWidth - left,
        bottom           : clientHeight - rectHeight - top,
        rightIncludeBody : clientWidth  - left,
        bottomIncludeBody: clientHeight - top,
    };
}
