import type { ServiceConfig, RequestConfig, RequsetType, TaskCallBackFn, RequestTask, UploadTask, ReponsetRes } from './types';
export { ServiceConfig, RequestConfig, RequsetType }

import { isFunction, isBoolean, isString } from '@sumdoo-utils/core';
import statusCodeMap from './statusCodeMap';

abstract class Service { 
    protected   _showLoading : boolean;
    protected   _showError   : boolean;
    protected statusCodeMap  : Map<number | string, Function>;

    protected baseURL                 : string;
    protected timeout                 : number;
    protected enableHttp2             : boolean;
    protected transformRequest       ?: (params: Record<string, any>, header: Record<string, any>) => void;
    protected transformReponset      ?: (res: ReponsetRes) => ReponsetRes;

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
    protected abstract showLoading(): void 
    protected abstract hideLoading(): void
    protected abstract showErrorMsg(errMsg: string): void
    /** -- 以下方法继承实现 end --------------------------------------------------------------- */

    get(url: string, params: Record<string, any> = {}, config?: RequestConfig, taskCallback?: TaskCallBackFn<RequestTask>) {
        const { showLoading, showErrorMsg } = this.getLoadingWithErrorConfig(config);
        Reflect.deleteProperty(config || {}, 'showLoading');
        Reflect.deleteProperty(config || {}, 'showError');
        
        const header = { ...(config?.header || {}) };
        isFunction(this.transformRequest) && this.transformRequest(params, header);

        return this.createRequest('GET', url, {
            ...config   ,
            enableHttp2 : (config || {}).enableHttp2 ?? this.enableHttp2,
            timeout     : (config || {}).timeout     ?? this.timeout,
            method      : 'GET',
            data        : params,
        }, { showLoading, showErrorMsg }, taskCallback);
    }

    post(url: string, params: Record<string, any> = {}, config?: RequestConfig, taskCallback?: TaskCallBackFn<RequestTask>) {

        const { showLoading, showErrorMsg } = this.getLoadingWithErrorConfig(config);
        Reflect.deleteProperty(config || {}, 'showLoading');
        Reflect.deleteProperty(config || {}, 'showError');

        const header = { ...(config?.header || {}) };
        isFunction(this.transformRequest) && this.transformRequest(params, header);

        return this.createRequest('POST', url, {
            ...config   ,
            enableHttp2 : (config || {}).enableHttp2 ?? this.enableHttp2,
            timeout     : (config || {}).timeout     ?? this.timeout,
            method      : 'POST',
            data        :  params,
        }, { showLoading, showErrorMsg }, taskCallback);
    }

    upload(url: string, params: Record<string, any> = {}, config?: RequestConfig, taskCallback?: TaskCallBackFn<UploadTask>) {
        const { filePath, fileName } = params;
        if (!filePath) return Promise.reject({ ok: false, err: '上传文件路径不能为空' });

        const { showLoading, showErrorMsg } = this.getLoadingWithErrorConfig(config);

        Reflect.deleteProperty(params      , 'filePath');
        Reflect.deleteProperty(params      , 'fileName');
        Reflect.deleteProperty(config || {}, 'showLoading');
        Reflect.deleteProperty(config || {}, 'showError');

        const header = { ...(config?.header || {}) };
        isFunction(this.transformRequest) && this.transformRequest(params, header);

        return this.createRequest('UPLOAD', url, {
            formData: {
                filePath,
                fileName : fileName || 'data',
                ...config,
                header   ,
                timeout  : (config || {}).timeout     ?? this.timeout,
                formData : params,
            }
        }, { showLoading, showErrorMsg }, taskCallback);
    }

    /** 解析请求路径 */
    protected parseUrl(url: string) {
        return /^https?:\/\//.test(url) ? url : `${this.baseURL}${url}`;
    }

    // 获取用户配置
    protected getLoadingWithErrorConfig(config?: RequestConfig) {
        const { showLoading, showError } = config || {};
        return {
            showLoading  : isBoolean(showLoading ) ? showLoading : this._showLoading,
            showErrorMsg : isBoolean(showError   ) ? showError   : this._showError,
        };
    }

    // 创建请求
    protected createRequest(
        type         : RequsetType,
        url          : string,
        requestConfig: Record<string, any> = {},
        config       : { showLoading: boolean, showErrorMsg: boolean },
        taskCallback?: TaskCallBackFn<RequestTask> | TaskCallBackFn<UploadTask>
    ): Promise<any> {
        return new Promise((resolve) => {
            config.showLoading && this.showLoading();
            
            const Task = (type === 'UPLOAD' ? uni.uploadFile : uni.request)({
                url: this.parseUrl(url),
                ...requestConfig,
                success: (res: any) => {
                    const _res    = isFunction(this.transformReponset) ? this.transformReponset(res) : res;
                    const resData = _res.data; 

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
