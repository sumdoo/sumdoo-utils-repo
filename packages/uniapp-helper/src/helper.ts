import type { RequestConfig } from './service';
import { isArray } from '@sumdoo-utils/core';

// 选择图片
export const chooseImage = () => {
    return new Promise((resolve) => {
        uni.chooseImage({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album', 'camera'],
            success(res: any) {
                resolve({
                    ok  : true,
                    data: res.tempFilePaths[0],
                });
            },
            fail() {
                resolve({
                    ok  : false,
                    data: ''
                });
            }
        });
    });
};

// 生成对象的 api
type IApiSchema = Record<string, Record<string, string[]> | string[]>;
type IApiRecord = Record<string, Record<string, Function> | Function>;
export const genApiBySchema = (http: any, api_schema: IApiSchema, urlPrefix: string) => {
    const api: IApiRecord = {};

    load(api_schema, api);
    
    function load(_api_schema: IApiSchema, _api: IApiRecord) {
        Object.keys(_api_schema).forEach(k => {
            const val = _api_schema[k];
            if (isArray(val)) {
                _api[k] = (params: Record<string, any>, config: RequestConfig) => {
                    const act = val[1] ? `&act=${val[1]}` : '';
                    const url = `${urlPrefix}?api=${val[0]}${act}`;
                    return http.post(url, params, config);
                }
            } else {
                _api[k] = {}; 
                load(val, api[k] as IApiRecord);
            }
        });
    }   

    return api;
}
