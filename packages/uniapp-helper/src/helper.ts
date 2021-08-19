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
