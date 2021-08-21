import { isNumber } from '@sumdoo-utils/core';

export function  pxTransform(size: number | string) {
    return isNumber(size) ? size * 2 + 'rpx' : size;
}
