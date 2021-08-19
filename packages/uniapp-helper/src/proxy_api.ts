
import { AUTH_API_SCOPE, checkAuthApi } from './auth_api';

export function proxyUni () {
    uni.$ = new Proxy<any>(
        {},
        {
            get: function (target, propKey: keyof UniApp.Uni) {
                // 检查属性是否存在
                if (!uni[propKey]) return;

                return async function (opt: any): UniApp.Res<any> {
                    // 检查是否授权 API
                    const api_scope = AUTH_API_SCOPE[propKey];
                    if  ( api_scope ) {
                        const isAuth = await checkAuthApi(api_scope);
                        if ( !isAuth ) {
                            return Promise.resolve({
                                ok  : false,
                                err : `${api_scope}未授权`,
                                data: null,
                            });
                        }
                    }
                    
                    const fn = uni[propKey] as any;
                    if (typeof fn !== 'function') {
                        return Promise.resolve({
                            ok  : false,
                            err : `${propKey}：不是一个函数`,
                            data: null,
                        });
                    }

                    // 调用 API
                    return new Promise(resolve => {
                        fn({
                            ...(typeof opt === 'object' ? opt : {}),
    
                            success: (res: any) => {
                                resolve({
                                    ok  : true,
                                    err : '',
                                    data: res
                                });
                            },
    
                            fail: (res: any) => {
                                resolve({
                                    ok  : false,
                                    err : res.errorMsg || `${propKey}: error`,
                                    data: null
                                });
                            },
                        });
                    });
                };
            },
        },
    );
}
