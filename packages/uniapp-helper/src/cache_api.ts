import { isFunction, isArray, isObject } from '@sumdoo-utils/core';

interface CacheApi {
    data: any;
    time: number;
}

const NameSpace = 'cache_api/';
async function fetchApiData(actions: Function[], params = {} , config = {}) {
    try {
        const rest = await Promise.all(actions.map(action => action(params, config)));
        if (rest.length === 1) return rest[0];

        let data = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < rest.length; i++) {
            let res = rest[i];
            if (!res.ok) {
                return { ok: false, err: res.err || '未知错误' };
            } else {
                data.push(res.data);
            }
        }

        return { ok: true, data };
    } catch (error) {
        return { ok: false, err: error };
    }
}

/**
 * @method 构造自缓存API
 * @param {function|array} 接口函数
 * @param {number} 超时时间
 */
const threeHour = 1000 * 60 * 60 * 3;
export default function generateCacheApi(
    actions: Function | Function[],
    returnKey: () => string,
    timeout = threeHour,
) {
    if (!isArray(actions) && !isFunction(actions)) throw new Error('执行函数有误');
    if (isFunction(actions)) actions = [actions];

    return async function (reload = false, params = {}, config = {}) {
        // 构造缓存 key
        let key = (typeof returnKey === 'function' && returnKey()) || '';
        if (key) key = NameSpace + key;

        // 获取当前时间戳
        const time = Number(new Date());

        // 清除超时无效的缓存数据
        releaseInvalidCache(time);

        // 检查缓存是否过期
        let cache: CacheApi | null = null;
        try {
            cache = uni.getStorageSync(key) as CacheApi;
        } catch (error) {}
        
        let cache_data;
        let isTimeout;
        if (isObject(cache) && cache.time) {
            isTimeout = Math.abs(time - cache.time) > timeout;
            cache_data = cache.data;
        }

        // 缓存且未过期返回缓存数据
        if (!reload && !isTimeout && cache_data) {
            return { ok: true, data: cache_data, cache: true };
        }

        // 请求数据,请求失败则视情况使用缓存数据
        let res = await fetchApiData(actions as Function[], params, config);
        if (!res.ok) {
            if (!reload && cache_data) {
                return { ok: true, data: cache, cache: true };
            } else {
                return res;
            }
        }

        // 缓存此次请求数据和返回
        if (key && res.data) {
            
            // 单个 key 允许存储的最大数据长度为 1MB，所有数据存储上限为 10MB
            // https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorage.html
            try {
                uni.setStorageSync(key, { data: res.data, time });
            } catch (error) {
                uni.removeStorageSync(key);
            }
        }

        return res;
    };
}

// 超过百分之70的占用则清除7天前的缓存
const SevenDayTime = 1000 * 60 * 60 * 24 * 7;
let isChecked = false;
function releaseInvalidCache(time: number) {
    try {
        if (isChecked) return;
        time = time || Number(new Date());
        isChecked = true;

        // 缓存利用率超过百分之70开始释放空间
        let { keys, currentSize, limitSize } = uni.getStorageInfoSync();
        if (currentSize / limitSize > 0.7) {
            keys = keys.filter(k => k.startsWith(NameSpace));
            keys.forEach(k => {
                let cache: CacheApi = uni.getStorageSync(k);
                if (!isObject(cache) || Math.abs(time - cache.time) >= SevenDayTime) {
                    uni.removeStorageSync(k);
                }
            });
        }
    } catch (e) {}
}
