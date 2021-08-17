import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import { isBoolean, isFunction, isString        } from '@sumdoo-utils/core';

import axios         from 'axios';
import statusCodeMap from './statusCodeMap';

export interface RequestConfig {
    showLoading     ?: boolean ; /** 自动显示Loading */ 
    showErr         ?: boolean ; /** 自动显示错误信息 */ 
    onUploadProgress?: Function; /** 监听上传进度事件 */ 
}

// 因为不同模式下的 loading 及 提示不一样, 需要使用继承该类，并设置对应的 loading、显示异常的函数
abstract class Service {
    protected axios             : AxiosInstance;
    protected statusCodeMap     : Map<number | string, Function>;
    private   globalShowLoading : boolean;
    private   globalShowError   : boolean;
    private   onSuccess         : (data: any) => string | null;

    constructor(
        axiosConfig  ?: AxiosRequestConfig,
        requestConfig?: Omit<RequestConfig, 'onUploadProgress'> & { onSuccess?: Function }
    ) {

        const { showLoading, showErr, onSuccess } = requestConfig || {};

        this.axios             = axios.create(axiosConfig);
        this.statusCodeMap     = statusCodeMap;
        this.globalShowLoading = isBoolean(showLoading) ? showLoading        : true;
        this.globalShowError   = isBoolean(showErr    ) ? showErr            : true;
        this.onSuccess         = isFunction(onSuccess ) ? (onSuccess as any) : null;
    }

    /** -- 以下方法继承实现 start --------------------------------------------------------------- */
    abstract showLoading(): void 
    abstract hideLoading(): void
    abstract showErrorMsg(errMsg: string): void
    /** -- 以下方法继承实现 end --------------------------------------------------------------- */

    get(url: string, params: Record<string, any> = {}, config?: RequestConfig) {
        return this.createRequest(
            url,
            {
                method: 'get',
                params,
            },
            config
        );
    }

    post(url: string, params: Record<string, any> = {}, config?: RequestConfig) {
        return this.createRequest(
            url,
            {
                method: 'post',
                data  : params,
            },
            config
        );
    }

    put(url: string, params: Record<string, any> = {}, config?: RequestConfig) {
        return this.createRequest(
            url,
            {
                method: 'put',
                data  : params,
            },
            config
        );
    }

    del(url: string, params: Record<string, any> = {}, config?: RequestConfig) {
        return this.createRequest(
            url,
            {
                method: 'delete',
                data  : params,
            },
            config
        );
    }

    upload(url: string, params: Record<string, any> = {}, config?: RequestConfig) {
        return this.createRequest(
            url,
            {
                method : 'post',
                data   : params,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    charset       : 'utf-8',
                },
            },
            config
        );
    }

    // 创建请求
    private createRequest(
        url          : string,
        requestConfig: Record<string, any> = {},
        config      ?: RequestConfig
    ): Promise<any> {
        return new Promise((resolve) => {
            const { showLoading, showErrorMsg } = this.parseConfig(config);
            showLoading && this.showLoading();

            this.axios
                .request({ url, ...requestConfig })
                .then((res) => {
                    showLoading && this.hideLoading();

                    const { ok, err, data, server_date, server_time } = res.data;
                    let errorText = err ? String(err) : '内部错误，请稍后重试!';
                    if (isFunction(this.onSuccess)) {
                        errorText = this.onSuccess(res.data) || '';
                    }

                    if (!ok && showErrorMsg) this.showErrorMsg(errorText);
                    resolve({ ok, data, err, server_date, server_time });
                })
                .catch((err) => {
                    showLoading && this.hideLoading();

                    // 处理状态码
                    const statusCode = (err.response && String(err.response.status)) || '';
                    const statusCodeHandleFn = this.statusCodeMap.get(statusCode);
                    let errorText = '未知错误';
                    if (statusCodeHandleFn) {
                        errorText = statusCodeHandleFn();

                        // 处理网络延迟
                    } else if (isString(err?.msg) && /timeout\sof\s\d+ms\sexceeded/.test(err.msg)) {
                        errorText = '网络出了点问题，请稍后重试';
                    }

                    // 自动显示错误
                    showErrorMsg && this.showErrorMsg(errorText);

                    resolve({
                        ok: false,
                        err: errorText,
                    });
                });
        });
    }

    // 获取用户配置
    private parseConfig(config?: RequestConfig) {
        const { showLoading, showErr, onUploadProgress } = config || {};
        return {
            showLoading     : isBoolean(showLoading      ) ? showLoading      : this.globalShowLoading,
            showErrorMsg    : isBoolean(showErr          ) ? showErr          : this.globalShowError,
            onUploadProgress: isFunction(onUploadProgress) ? onUploadProgress : null,
        };
    }
}

export { Service };
