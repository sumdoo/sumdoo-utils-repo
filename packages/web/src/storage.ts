import { isNumber, isObject } from "@sumdoo-utils/core";

interface CreateStorageParams {
    storage  : Storage;
    prefixKey: string;
    timeout  : number;
}

// @ts-ignore
export function CreateStorage({ prefixKey, storage, timeout }: Partial<CreateStorageParams>) {
    
    // Stoage 类
    class StorageCache {
        private storage  : Storage;
        private prefixKey: string;
        private timeout  : number;
        
        constructor() {
            this.storage   = storage   || sessionStorage;
            this.prefixKey = prefixKey || '';
            this.timeout   = timeout   || 0;
            
            this.cleanUp();
        }
        
        /** 转换为大写字母 KEY */
        private getKey(key: string) {
            return `${this.prefixKey}:${key}`;
        }
        
        set(key: string, value: any, expire: number = this.timeout): boolean {
            try {
                const stringData = JSON.stringify({
                    value, 
                    time  : Date.now(),
                    expire,
                });
                
                this.storage.setItem(this.getKey(key), stringData)
                return true;
            } catch (error) {
                return false;
            }
        }
        
        get<T>(key: string): T | null {
            
            try {
                const val = this.storage.getItem(this.getKey(key));
                if (!val) return null;
                
                // 不符合格式，清除缓存
                const obj = JSON.parse(val);
                if (!isObject(obj)) {
                    this.remove(key);
                    return null;
                }
                const { value, time, expire } = obj;
                if (value === undefined || !isNumber(time) || !isNumber(expire)) {
                    this.remove(key);
                    return null;
                }
                
                // 缓存过期，清除缓存。
                if (expire && Date.now() > (expire * 1000) + time) {
                    this.remove(key);
                    return null;
                }
                
                return value;
            } catch (e) {
                this.remove(key);
                return null;    
            }
        }
        
        remove(key: string) {
            this.storage.removeItem(this.getKey(key));
        }
        
        /** 获取指定前缀的 keys */
        getKeys() {
            const pKey = this.getKey('');
            
            const keys: string[] = [];
            for (let i = 0; i < this.storage.length; i++ ) {
                const key = this.storage.key(i);
                if (key && key.startsWith(pKey)) {
                    keys.push(key.slice(pKey.length));
                }
            }
            
            return keys;
        }
        
        /** 清空缓存 */
        clear(): void {
            this.getKeys().forEach(key => {
                this.remove(key);
            });
        }
        
        /** 清除过期缓存 */
        cleanUp(): void {
            this.getKeys().forEach(key => {
                this.get(key);
            });
        }
    }
    
    // 返回实例
    return new StorageCache()
}
