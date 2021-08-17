/* istanbul ignore next */
export function on(
    element: Element | HTMLElement | Document | Window,
    event: string,
    handler: EventListenerOrEventListenerObject
): void {
    if (element && event && handler) {
        element.addEventListener(event, handler, false);
    }
}

/* istanbul ignore next */
export function off(
    element: Element | HTMLElement | Document | Window,
    event: string,
    handler: Fn
): void {
    if (element && event && handler) {
        element.removeEventListener(event, handler, false);
    }
}

/* istanbul ignore next */
export function once(el: HTMLElement, event: string, fn: EventListener): void {
    const listener = function (this: any, ...args: unknown[]) {
        if (fn) {
            // @ts-ignore
            fn.apply(this, args);
        }
        off(el, event, listener);
    };
    on(el, event, listener);
}

/** 阻止默认事件 */
export function preventDefault(e: Event) {
    e && e.preventDefault();
}
