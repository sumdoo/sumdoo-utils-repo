import { isFunction, isBoolean, isString } from '@sumdoo-utils/core';

type RequsetType = 'GET' | 'POST' | 'UPLOAD';

import statusCodeMap from './statusCodeMap';

interface ServiceConfig {
    baseURL           : string;
    timeout          ?: number;
    enableHttp2      ?: boolean;
    showLoading      ?: boolean;
    showError        ?: boolean;
    transformRequest ?: (params: any) => any;
    transformReponset?: (prams : any) => void;
}

export interface RequestConfig {
    showLoading     ?: boolean ; /** 自动显示Loading */ 
    showError       ?: boolean ; /** 自动显示错误信息 */ 
    [key: string  ]  : any;      /** 扩展请求函数的配置 */
}

export interface TaskCallBackFn<T> {
    (task: T): void
}

abstract class Service { 
    private   _showLoading  : boolean;
    private   _showError    : boolean;
    protected statusCodeMap : Map<number | string, Function>;

    baseURL                 : string;
    timeout                 : number;
    enableHttp2             : boolean;
    transformRequest       ?: Function;
    transformReponset      ?: Function;

    constructor(config: ServiceConfig) {
        this.statusCodeMap     = statusCodeMap;

        this._showLoading      = config.showLoading ?? false;
        this._showError        = config.showError   ?? false;
        this.enableHttp2       = config.enableHttp2 ?? true;
        this.baseURL           = config.baseURL     ?? '';
        this.timeout           = config.timeout     ?? 6 * 1000;
        this.transformRequest  = config.transformRequest; // 请求前转换 (用于补充数据)
        this.transformReponset = config.transformReponset; // 请求后转换 (用于补充数据)
    }

    /** -- 以下方法继承实现 start --------------------------------------------------------------- */
    abstract showLoading(): void 
    abstract hideLoading(): void
    abstract showErrorMsg(errMsg: string): void
    /** -- 以下方法继承实现 end --------------------------------------------------------------- */

    get(url: string, params: Record<string, any> = {}, config?: RequestConfig, taskCallback?: TaskCallBackFn<UniApp.RequestTask>) {
        const { showLoading, showErrorMsg } = this.getLoadingWithErrorConfig(config);
        Reflect.deleteProperty(config || {}, 'showLoading');
        Reflect.deleteProperty(config || {}, 'showError');
        
        const header = { ...(config?.header || {}) };
        return this.createRequest('GET', url, {
            ...config   ,
            enableHttp2 : (config || {}).enableHttp2 ?? this.enableHttp2,
            timeout     : (config || {}).timeout     ?? this.timeout,
            method      : 'GET',
            data        : isFunction(this.transformReponset) ? this.transformReponset(params, header) : params,
        }, { showLoading, showErrorMsg }, taskCallback);
    }

    post(url: string, params: Record<string, any> = {}, config?: RequestConfig, taskCallback?: TaskCallBackFn<UniApp.RequestTask>) {

        const { showLoading, showErrorMsg } = this.getLoadingWithErrorConfig(config);
        Reflect.deleteProperty(config || {}, 'showLoading');
        Reflect.deleteProperty(config || {}, 'showError');

        const header = { ...(config?.header || {}) };
        return this.createRequest('POST', url, {
            ...config   ,
            enableHttp2 : (config || {}).enableHttp2 ?? this.enableHttp2,
            timeout     : (config || {}).timeout     ?? this.timeout,
            method      : 'POST',
            data        : isFunction(this.transformReponset) ? this.transformReponset(params, header) : params,
        }, { showLoading, showErrorMsg }, taskCallback);
    }

    upload(url: string, params: Record<string, any> = {}, config?: RequestConfig, taskCallback?: TaskCallBackFn<UniApp.UploadTask>) {
        const { filePath, fileName } = params;
        if (!filePath) return Promise.reject({ ok: false, err: '上传文件路径不能为空' });

        const { showLoading, showErrorMsg } = this.getLoadingWithErrorConfig(config);

        Reflect.deleteProperty(params      , 'filePath');
        Reflect.deleteProperty(params      , 'fileName');
        Reflect.deleteProperty(config || {}, 'showLoading');
        Reflect.deleteProperty(config || {}, 'showError');

        const header = { ...(config?.header || {}) };
        return this.createRequest('UPLOAD', url, {
            formData: {
                filePath,
                fileName : fileName || 'data',
                ...config,
                header   ,
                timeout  : (config || {}).timeout     ?? this.timeout,
                formData : isFunction(this.transformReponset) ? this.transformReponset(params, header) : params,
            }
        }, { showLoading, showErrorMsg }, taskCallback);
    }

    /** 解析请求路径 */
    private parseUrl(url: string) {
        return /^https?:\/\//.test(url) ? url : `${this.baseURL}${url}`;
    }

    // 获取用户配置
    private getLoadingWithErrorConfig(config?: RequestConfig) {
        const { showLoading, showError } = config || {};
        return {
            showLoading  : isBoolean(showLoading ) ? showLoading : this._showLoading,
            showErrorMsg : isBoolean(showError   ) ? showError   : this._showError,
        };
    }

    // 创建请求
    private createRequest(
        type         : RequsetType,
        url          : string,
        requestConfig: Record<string, any> = {},
        config       : { showLoading: boolean, showErrorMsg: boolean },
        taskCallback?: TaskCallBackFn<UniApp.RequestTask> | TaskCallBackFn<UniApp.UploadTask>
    ): Promise<any> {
        return new Promise((resolve) => {
            config.showLoading && this.showLoading();
            
            const Task = (type === 'UPLOAD' ? uni.uploadFile : uni.request)({
                url: this.parseUrl(url),
                ...requestConfig,
                success: (res: any) => {
                    const resData = isFunction(this.transformReponset) ? this.transformReponset(res) : res.data;

                    config.showLoading && this.hideLoading();

                    const { ok, err, data, server_date, server_time } = resData;
                    const errorText = err ? String(err) : '内部错误，请稍后重试!';
                    if (!ok && config.showErrorMsg) this.showErrorMsg(errorText);

                    resolve({ ok, data, err, server_date, server_time });
                },
                fail: (err: any) => {
                    config.showLoading && this.hideLoading();

                    // 处理状态码
                    const statusCode         = (err.response && String(err.response.status)) || '';
                    const statusCodeHandleFn = this.statusCodeMap.get(statusCode);
                    let errorText = '未知错误';
                    if (statusCodeHandleFn) {
                        errorText = statusCodeHandleFn();
                    } else if (isString(err?.errMsg) && /timeout\sof\s\d+ms\sexceeded/.test(err.errMsg)) {
                        errorText = '网络出了点问题，请稍后重试';
                    }

                    // 自动显示错误
                    config.showErrorMsg && this.showErrorMsg(errorText);

                    resolve({
                        ok  : false,
                        err : errorText,
                        data: null,
                    });
                }
            });
            
            // 回调 task
            isFunction(taskCallback) && taskCallback(Task as any);
        });
    }
}

export { Service }
