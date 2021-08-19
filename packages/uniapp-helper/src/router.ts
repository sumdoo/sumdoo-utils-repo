import { isString, isFunction, queryToObj, objToQuery } from '@sumdoo-utils/core';

// types
type RouterType = 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab';

// 路由 query 参数的格式
interface RouterQuery {
    [key: string]: string;
}

// 实例方法的参数
type RouterOption =
    | string
    | {
          path: string;
          query?: RouterQuery;
          success?: (res: any) => void;
      };

// 全局守卫函数
type BeforeEachFn = (
    to: { path: string; query?: RouterQuery },
    from: {},
    next: (result?: BeforeEachNextOption) => void,
) => void;

// 全局守卫函数的参数
type BeforeEachNextOption =
    | string
    | boolean
    | { replace?: boolean; reLaunch?: boolean; path: string; query?: RouterQuery };

// 构造函数参数
interface RouterConstructorOption {
    home: string;
}

export default class Router {
    private beforeEachFn: BeforeEachFn | null;
    private homePath: string;

    constructor(opt: RouterConstructorOption) {
        this.beforeEachFn = null;
        this.homePath = opt.home || '';
    }

    // 重置到首页
    home() {
        this.reLaunch(this.homePath);
    }

    /** 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 */
    tabBar(opt: RouterOption) {
        return this.handleRouteToFn('switchTab')(opt);
    }

    /** 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面 */
    push(opt: RouterOption) {
        return this.handleRouteToFn('navigateTo')(opt);
    }

    /** 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面 */
    replace(opt: RouterOption) {
        return this.handleRouteToFn('redirectTo')(opt);
    }

    /** 关闭所有页面，打开到应用内的某个页面 */
    reLaunch(opt: RouterOption) {
        return this.handleRouteToFn('reLaunch')(opt);
    }

    /** 关闭当前页面，返回上一页面或多级页面 */
    back = (delta = 1) => {
        const pages = getCurrentPages();
        delta = delta > pages.length ? pages.length : delta;

        uni.navigateBack({ delta });
    };

    /** 路由跳转前触发钩子 */
    beforeEach(fn: BeforeEachFn) {
        if (!isFunction(fn)) return;
        this.beforeEachFn = fn;
    }

    // 解析路由参数
    parseRouterOption(opt: RouterOption) {
        let option = {
            path: '',
            query: {},
            success: (res: any) => {},
        };

        if (isString(opt)) {
            let _path = opt;
            let [path, query] = _path.split('?');

            option.path = path;
            option.query = queryToObj(query);
        } else {
            option.path = opt.path;
            option.query = {
                ...(opt ? opt.query : {}),
            };

            if (isFunction(opt.success)) option.success = opt.success;
        }

        return option;
    }

    // 处理路由跳转及参数
    handleRouteToFn(type: RouterType) {
        const fn = uni[type];

        return async (opt: RouterOption) => {
            let { path, query, success } = this.parseRouterOption(opt);

            let _path: string;
            if (path.startsWith('plugin://')) {
                _path = path; // 插件页面不处理
            } else if (path.startsWith('/pages')) {
                _path = path; // 绝对路径不处理
            } else if (path.startsWith('./')) {
                const pages = getCurrentPages(); // 相对当前页面路径
                _path = `${pages[pages.length - 1]}${path.slice(1)}`;
            } else {
                _path = `/pages/${path}/main`;
            }

            if (isFunction(this.beforeEachFn)) {
                this.beforeEachFn({ path: _path, query }, {}, async option => {
                    // 为传入参数或为 true 则通过
                    if (option === undefined || option === true) {
                        const args = objToQuery(query);
                        if (args) _path += `?${args}`;
                        return fn({ url: _path, success });
                    }

                    if (!option) return;

                    // 字符串参数，则新开页面
                    if (isString(option)) {
                        this.push(option);
                    } else {
                        // 跳转到指定位置
                        if (option.reLaunch) {
                            this.reLaunch(option);
                        } else if (option.replace) {
                            this.replace(option);
                        } else {
                            this.push(option);
                        }
                    }
                });
            } else {
                const args = objToQuery(query);
                if (args) _path += `?${args}`;
                return fn({ url: _path, success });
            }
        };
    }
}
