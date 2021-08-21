<script>
export default {
    name: 'SdPage',

    props: {
        /** 启用自定义导航 */
        showNavbar: {
            type: Boolean,
            default: true,
        },

        /** 自定义导航背景色 */
        navbarBackground: {
            type: String,
            default: '#2AC79F',
        },

        /** 显示返回按钮 */
        showBackBtn: {
            type: Boolean,
            default: false,
        },

        /** 显示刷新按钮 */
        showRefreshBtn: {
            type: Boolean,
            default: false,
        },

        /** 页面标题 */
        title: {
            type: String,
            default: '',
        },

        /** 页面标题颜色 */
        titleColor: {
            type: String,
            default: '#fff',
        },

        /** 页面加载状态 */
        loading: {
            type: Number,
            default: 0,
        },

        /** 页面异常信息 */
        error: {
            type: String,
            default: '',
        },

        /** 锁定页面滚动 */
        lockScroll: {
            type: Boolean,
            default: false,
        },

        /** 页面背景 */
        background: {
            type: String,
            default: '#eee',
        },
    },
};
</script>

<template>
    <view :class="['sd-page', { 'is-lock': lockScroll || loading !== 0 }]">
        <sd-navbar
            v-if="showNavbar"
            :is-back="showBackBtn"
            :title="title"
            :title-color="titleColor"
            :background="navbarBackground"
            @back="$router.back"
        />

        <view :class="['sd-page__inner']" :style="{ background: background }">
            <view :class="['sd-page__content', { 'is-visible': loading === 0 }]">
                <slot></slot>
            </view>

            <view v-if="loading === 1" class="full-screen">
                <sd-loading mode="loading-2" text="加载中" />
            </view>

            <view v-else-if="loading === -1" class="full-screen">
                <view>
                    {{ error }}
                </view>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.sd-page {
    display: flex;
    flex-direction: column;
    min-height: 100%;

    &.is-lock {
        /** fixed: 主要防止ios端可上下拖拽 */
        position: fixed;
        left: 0;
        right: 0;
        height: 100vh;
        overflow: hidden;
    }

    .full-screen {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }

    &__inner {
        flex: 1;
        /** 使得 flex 容器下 height: 100% 能够起效果 */
        height: 0;
        position: relative;
    }

    &__content {
        min-height: 100%;
        opacity: 0;

        &.is-visible {
            opacity: 1;
        }
    }

    &.is-lock &__content {
        height: 100%;
    }
}
</style>
