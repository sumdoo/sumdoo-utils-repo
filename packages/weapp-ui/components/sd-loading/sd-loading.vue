<script>
export default {
    name: 'SdLoading',

    props: {
        /** loading的类型 */
        mode: {
            type: String,
            default: 'loading-1',
        },

        /** loading的颜色 */
        color: {
            type: String,
            default: '#2AC79F',
        },

        /** loading图标的大小 */
        size: {
            type: Number,
            default: 30,
        },

        /** loading提示文字 */
        text: {
            style: String,
            default: '',
        },

        // 是否显示Loading
        show: {
            type: Boolean,
            default: true,
        },
    },

    computed: {
        LoadingStyle() {
            return {
                fontSize : this.size + 'px',
                color    : this.color,
            };
        },
    },
};
</script>
<template>
    <view v-if="show" class="sd-loading">
        <view class="icon-wrap">
            <text :class="['sd-icon', `icon-${mode}`]" :style="[LoadingStyle]" />
        </view>
        <view v-if="text" style="margin-top: 10px">{{ text }}</view>
    </view>
</template>

<style lang="scss" scoped>
.sd-loading {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .icon-wrap {
        display: flex;
        justify-content: center;
        align-items: center;
        animation: circle 1s linear infinite;
    }
}

@keyframes circle {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
