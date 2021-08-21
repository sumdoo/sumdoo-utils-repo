<script>
import { pxTransform } from '../../src/utils/helper';

export default {
    name: 'SdBadge',

    props: {
        // default, mini
        size: {
            type: String,
            default: 'default',
        },

        //是否是圆点
        isDot: {
            type: Boolean,
            default: false,
        },

        // 显示的数值内容
        count: {
            type: Number,
            default: 0,
        },

        // 展示封顶的数字值
        overflowCount: {
            type: Number,
            default: 99,
        },

        // 当数值为 0 时，是否展示 Badge
        showZero: {
            type: Boolean,
            default: false,
        },

        // 位置偏移
        offset: {
            type: Array,
            default: () => {
                return [10, 10];
            },
        },

        // 是否开启绝对定位，开启了offset才会起作用
        absolute: {
            type: Boolean,
            default: true,
        },

        // 字体大小
        fontSize: {
            type: Number,
            default: 12,
        },

        // 字体颜色
        color: {
            type: String,
            default: '#fff',
        },

        // badge的背景颜色
        bgColor: {
            type: String,
            default: '#f56c6c',
        },

        // 是否让badge组件的中心点和父组件右上角重合，配置的话，offset将会失效
        isCenter: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        $badgeStyle() {
            return {
                top        : pxTransform(this.offset[0]),
                right      : pxTransform(this.offset[1]),
                fontSize   : pxTransform(this.fontSize),
                position   : this.absolute ? 'absolute' : 'static',
                color      : this.color,
                background : this.bgColor,
            };
        },

        $boxStyle() {
            const style = {};

            if (this.isCenter) {
                style.top   = 0;
                style.right = 0;
                // Y轴-50%，意味着badge向上移动了badge自身高度一半，X轴50%，意味着向右移动了自身宽度一半
                style.transform = 'translateY(-50%) translateX(50%)';
            } else {
                style.top       = pxTransform(this.offset[0]);
                style.right     = pxTransform(this.offset[1]);
                style.transform = 'translateY(0) translateX(0)';
            }

            // 如果尺寸为mini，后接上scal()
            if (this.size == 'mini') {
                style.transform = style.transform + ' scale(0.8)';
            }

            return style;
        },

        // isDot类型时，不显示文字
        $showText() {
            if (this.isDot) {
                return '';
            } else {
                if (this.count > this.overflowCount) {
                    return `${this.overflowCount}+`;
                } else {
                    return this.count;
                }
            }
        },

        // 是否显示组件
        $show() {
            // 如果count的值为0，并且showZero设置为false，不显示组件
            if (this.count == 0 && this.showZero == false) {
                return false;
            } else {
                return true;
            }
        },
    },
};
</script>

<template>
    <view
        v-if="$show"
        class="sd-badge"
        :class="[isDot ? 'is-dot' : '', size == 'mini' ? 'sd-badge--mini' : '']"
        :style="[$badgeStyle, $boxStyle]"
    >
        {{ $showText }}
    </view>
</template>

<style lang="scss" scoped>
.sd-badge {
    line-height: 12px;
    min-width: 6px;
    padding: 2px 5px;
    border-radius: 50px;
    background-color: $color-red;

    &.is-dot {
        height: 8px;
        width: 8px;
        border-radius: 50px;
        line-height: 1;
    }

    &--mini {
        transform: scale(0.8);
        transform-origin: center center;
    }
}
</style>
