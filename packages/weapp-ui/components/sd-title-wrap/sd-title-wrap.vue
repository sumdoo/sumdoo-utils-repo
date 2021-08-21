<script>
export default {
    name: 'SdTitleWrap',

    props: {
        /** 标题 */
        title: String,

        /** 提示  */
        tips: String,

        /** 颜色 */
        bgColor: String,
    },
    
    computed: {
        $styles() {
            return {
                backgroundColor: this.bgColor || '#f5f5f5',
            };
        },
    },
};
</script>

<template>
    <view class="p10 title" :style="[$styles]">
        <view class="flex-x-between">
            <view class="title-text pt5 pb5 f15 flex1 flex-yc ellipsis">
                {{ title }}
            </view>
            <view>
                <slot name="titleRight"></slot>
            </view>
        </view>
        <view v-if="tips" class="color-gray f12 mt7">
            {{ tips }}
        </view>
    </view>
</template>

<style lang="scss" scoped>
.title-text {
    &::before {
        content: '';
        background: $color-theme;
        width: 10rpx;
        height: 75%;
        border-radius: 5rpx;
        margin-right: 18rpx;
    }
}
</style>
