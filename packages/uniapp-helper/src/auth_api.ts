// TODO: getUserInfo 拒绝授权的情况下已不再弹窗, 待修改
// 需要授权 API 对应的 scope
export const AUTH_API_SCOPE: { [k: string]: AuthSettingScope } = {
    getUserInfo             : 'userInfo',
    getLocation             : 'userLocation',
    chooseLocation          : 'userLocation',
    address                 : 'address',
    invoiceTitle            : 'invoiceTitle',
    invoice                 : 'invoice',
    getWeRunData            : 'werun',
    startRecord             : 'record',
    saveImageToPhotosAlbum  : 'writePhotosAlbum',
    saveVideoToPhotosAlbum  : 'writePhotosAlbum',
};

/**
 * userInfo 是否授权用户信息，对应接口 uni.getUserInfo
 *
 * userLocation 是否授权地理位置，对应接口 uni.getLocation, uni.chooseLocation
 *
 * address 是否授权通讯地址，已取消此项授权，会默认返回true
 *
 * invoice 是否授权发票抬头，已取消此项授权，会默认返回true
 *
 * werun 是否授权微信运动步数，对应接口 uni.getWeRunData
 *
 * record 是否授权录音功能，对应接口 uni.startRecord
 *
 * writePhotosAlbum 是否授权保存到相册 uni.saveImageToPhotosAlbum, uni.saveVideoToPhotosAlbum
 *
 * camera 是否授权摄像头，对应[camera]((camera)) 组件
 */
type AuthSettingScope =
    | 'userInfo'
    | 'userLocation'
    | 'address'
    | 'invoiceTitle'
    | 'invoice'
    | 'werun'
    | 'record'
    | 'writePhotosAlbum'
    | 'camera'
    | 'saveImageToPhotosAlbum';

// 检查需要授权的API,是否已授权情况
interface ICheckAuthApi {
    (args: AuthSettingScope): Promise<{ ok: Boolean; err: String }>
}
export const checkAuthApi: ICheckAuthApi = async function (api_scope) {
    if (!api_scope) return { ok: false, err: '授权API名称不能为空' };

    const { ok, data, err } = await getSetting();
    if (!ok) return { ok: false, err };

    const scope_name = `scope.${AUTH_API_SCOPE[api_scope]}`;
    const isAuth = data.authSetting[scope_name];

    // 未申请过授权
    if (isAuth === undefined) {
        const  { ok, err } = await authorize(scope_name);
        return { ok, err };
    }

    // 拒绝授权
    if (isAuth === false) {
        const { ok, data } = await openSetting();
        if (!ok) return { ok, err: '已拒绝授权' };

        // TODO: authSetting API待调整
        return data ? { ok: data.authSetting[name as any], err: '' } : { ok, err: '已拒绝授权' };
    }

    return { ok: true, err: '' };
}

// 进行API授权操作
export function authorize(scope_name: string): Promise<{ ok: boolean; err: string }> {
    return new Promise(resolve => {
        uni.authorize({
            scope: scope_name,
            success() {
                resolve({ ok: true, err: '' });
            },
            fail(err: any) {
                resolve({ ok: false, err });
            },
        });
    });
}

// 获取设备的已授权设置
export function getSetting(): Promise<{ ok: boolean; data: any; err: string }> {
    return new Promise(resolve => {
        uni.getSetting({
            success(res: any) {
                resolve({ ok: true, data: res, err: '' });
            },
            fail(err: any) {
                resolve({ ok: false, data: null, err });
            },
        });
    });
}

// 打开设备的授权设置页面
export function openSetting(): Promise<{ ok: boolean; data?: any; err?: string }> {
    return new Promise(resolve => {
        uni.showModal({
            title: '提示',
            content: '如需正常使用小程序功能，请点击授权',
            showCancel: false,
            confirmText: '前往授权',
            success(res: any) {
                if (res.confirm) {
                    uni.openSetting({
                        success(res: any) {
                            resolve({ ok: true, data: res });
                        },
                        fail(err: any) {
                            resolve({ ok: false, err });
                        },
                    });
                } else {
                    resolve({ ok: false, err: '' });
                }
            },
        });
    });
}
