
export type RequsetType = 'GET' | 'POST' | 'UPLOAD';

export interface ReponsetRes {
    cookies: any[];
    data: {
        ok: boolean,
        err?: string;
        data: any,
        server_date: string;
        server_time: number;
    },
    errMsg: string;
    header: Record<string, any>;
    statusCode: number;
}

export interface ServiceConfig {
    baseURL            : string;
    timeout           ?: number;
    enableHttp2       ?: boolean;
    showLoading       ?: boolean;
    showError         ?: boolean;
    transformRequest  ?: (params: Record<string, any>, header: Record<string, any>) => void;
    transformReponset ?: (res: ReponsetRes) => ReponsetRes;
}

export interface RequestConfig {
    showLoading     ?: boolean ; /** 自动显示Loading */ 
    showError       ?: boolean ; /** 自动显示错误信息 */ 
    [key: string  ]  : any;      /** 扩展请求函数的配置 */
}

export interface TaskCallBackFn<T> {
    (task: T): void
}

export interface RequestTask {
    /**
     * 中断请求任务
     */
    abort(): void;
    /**
     * 监听 HTTP Response Header 事件
     */
    onHeadersReceived(callback: (result: any) => void): void;
    /**
     * 取消监听 HTTP Response Header 事件
     */
    offHeadersReceived(callback: (result: any) => void): void;
}

export interface UploadTask {
    /**
     * 中断上传任务
     */
    abort(): void;
    /**
     * 监听上传进度变化
     */
    onProgressUpdate(callback: (result: OnProgressUpdateResult) => void): void;
    /**
     * 取消监听上传进度变化事件
     */
    offProgressUpdate(callback: (result: any) => void): void;
    /**
     * 监听 HTTP Response Header 事件
     */
    onHeadersReceived(callback: (result: any) => void): void;
    /**
     * 取消监听 HTTP Response Header 事件
     */
    offHeadersReceived(callback: (result: any) => void): void;
}

interface OnProgressUpdateResult {
    /**
     * 上传进度百分比
     */
    progress: number;
    /**
     * 已经上传的数据长度，单位 Bytes
     */
    totalBytesSent: number;
    /**
     * 预期需要上传的数据总长度，单位 Bytes
     */
    totalBytesExpectedToSend: number;
}
