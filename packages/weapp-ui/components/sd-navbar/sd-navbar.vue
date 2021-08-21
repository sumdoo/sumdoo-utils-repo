<script>
const systemInfo     = uni.getSystemInfoSync();
const menuButtonInfo = uni.getMenuButtonBoundingClientRect();

export default {
    name: 'SdNavbar',

    props: {
        // 导航栏高度，单位 px
        height: {
            type: [String, Number],
            default: '',
        },

        // 导航栏是否固定在顶部
        isFixed: {
            type: Boolean,
            default: true,
        },

        // 是否沉浸式，允许fixed定位后导航栏塌陷，仅fixed定位下生效
        immersive: {
            type: Boolean,
            default: false,
        },

        // 是否显示导航栏的下边框
        borderBottom: {
            type: Boolean,
            default: true,
        },

        // 层叠值
        zIndex: {
            type: [String, Number],
            default: '',
        },

        // 对象形式，因为用户可能定义一个纯色，或者线性渐变的颜色
        background: {
            type: String,
            default: '#2AC79F',
        },

        //  是否显示返回
        isBack: {
            type: Boolean,
            default: true,
        },

        // 返回箭头的颜色
        backIconColor: {
            type: String,
            default: '#fff',
        },

        // 左边返回的图标
        backIconName: {
            type: String,
            default: 'icon-chevron-left',
        },

        // 左边返回图标的大小，rpx
        backIconSize: {
            type: Number,
            default: 38,
        },

        // 导航栏标题
        title: {
            type: String,
            default: '',
        },

        // 标题的宽度，如果需要自定义右侧内容，且右侧内容很多时，可能需要减少这个宽度，单位rpx
        titleWidth: {
            type: Number,
            default: 220,
        },

        // 标题的颜色
        titleColor: {
            type: String,
            default: '#fff',
        },

        // 标题的字体大小 rpx
        titleSize: {
            type: Number,
            default: 32,
        },
    },

    data() {
        return {
            statusBarHeight: systemInfo.statusBarHeight,
        };
    },

    computed: {
        navbarHeight() {
            // 小程序特别处理，让导航栏高度 = 胶囊高度 + 两倍胶囊顶部与状态栏底部的距离之差(相当于同时获得了导航栏底部与胶囊底部的距离)
            // 此方法有缺陷，暂不用(会导致少了几个px)，采用直接固定值的方式
            // return menuButtonInfo.height + (menuButtonInfo.top - this.statusBarHeight) * 2;//导航高度
            const height = systemInfo.platform == 'ios' ? 44 : 48;
            return this.height ? this.height : height;
        },

        // 导航栏内部盒子的样式
        navbarInnerStyle() {
            const rightButtonWidth = systemInfo.windowWidth - menuButtonInfo.left;
            return {
                // 导航栏宽度，如果在小程序下，导航栏宽度为胶囊的左边到屏幕左边的距离
                height: this.navbarHeight + 'px',

                // 如果是小程序，导航栏内部的宽度需要减少右边胶囊的宽度
                marginRight: rightButtonWidth + 'px',
            };
        },

        // 整个导航栏的样式
        navbarStyle() {
            return {
                zIndex          : this.zIndex ? this.zIndex : $app.config.zIndex.navbar,
                backgroundColor : this.background,
            };
        },

        // 导航中间的标题的样式
        titleStyle() {
            const { windowWidth } = systemInfo;

            const rightButtonWidth = windowWidth - menuButtonInfo.left;
            const left = (windowWidth - this.titleWidth) / 2 + 'px';
            const right =
                rightButtonWidth - (windowWidth - this.titleWidth) / 2 + rightButtonWidth + 'px';

            const width = this.titleWidth + 'px';
            return {
                left,
                right,
                width,
                color: this.titleColor,
                fontSize: this.titleSize + 'rpx',
            };
        },
    },

    methods: {
        handleBack() {
            if (!this.isBack) return;
            this.$emit('back');
        },
    },
};
</script>

<template>
    <view>
        <view
            class="sd-navbar"
            :style="[navbarStyle]"
            :class="{ 'is-fixed': isFixed, 'is-border-bottom': borderBottom }"
        >
            <view class="sd-navbar__status-bar" :style="{ height: statusBarHeight + 'px' }" />
            <view class="sd-navbar__inner" :style="[navbarInnerStyle]">
                <view class="back-wrap" v-if="isBack" @tap="handleBack">
                    <text
                        :class="['sd-icon', backIconName]"
                        :style="{
                            color: backIconColor,
                            fontSize: backIconSize + 'rpx',
                        }"
                    />
                </view>
                <view class="navbar-content-title ellipsis" v-if="title" :style="[titleStyle]">
                    {{ title }}
                </view>
                <view class="slot-content">
                    <slot></slot>
                </view>
            </view>
        </view>
        <!-- 解决fixed定位后导航栏塌陷的问题 -->
        <view
            v-if="isFixed && !immersive"
            :style="{ width: '100%', height: Number(navbarHeight) + statusBarHeight + 'px' }"
        />
    </view>
</template>

<style lang="scss" scoped>
.sd-navbar {
    width: 100%;

    &.is-fixed {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 991;
    }

    // 顶部状态栏
    &__status-bar {
        width: 100%;
    }

    // 内容容器
    &__inner {
        display: flex;
        justify-content: space-between;
        position: relative;
        align-items: center;
    }

    .back-wrap {
        display: flex;
        align-items: center;
        flex: 1;
        flex-grow: 0;
        padding: 7px 7px 7px 12px;
    }

    .navbar-content-title {
        position: absolute;
        left: 0;
        right: 0;
        line-height: 30px;
        font-size: 16px;
        text-align: center;
    }

    .slot-content {
        flex: 1;
        display: flex;
        align-items: center;
    }
}
</style>
