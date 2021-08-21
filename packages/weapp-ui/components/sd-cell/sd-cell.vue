<script>
import { isNumber    } from '@sumdoo-utils/core';
import { pxTransform } from '../../src/utils/helper';

export default {
    name: 'SdCell',

    props: {
        /** 图标 */
        icon: {
            type: String,
            default: '',
        },

        /** 图标自定义大小 */
        iconSize: {
            type: [String, Number],
            default: 34,
        },

        /** 图标自定义样式 */
        iconStyle: {
            type: Object,
            default() {
                return {};
            },
        },

        /** 标题 */
        title: {
            type: [Number, String],
            default: '',
        },

        /** 标题宽度 */
        titleWidth: {
            type: [Number, String],
            default: '',
        },

        /** 标题自定义样式 */
        titleStyle: {
            type: Object,
            default() {
                return {};
            },
        },

        /** 内容 */
        value: {
            type: [Number, String],
            default: '',
        },

        /** 内容自定义样式 */
        valueStyle: {
            type: Object,
            default() {
                return {};
            },
        },

        /** 开启箭头 */
        arrow: {
            type: Boolean,
            default: false,
        },

        /** 箭头方向 */
        arrowDirection: {
            type: String,
            default: 'right',
        },

        /** 背景色 */
        bgColor: {
            type: String,
            default: '',
        },

        /** 是否开启点击反馈 */
        clickable: {
            type: Boolean,
            default: false,
        },

        /** 自定义点击反馈, 必须是全局样式中的 */
        hoverClass: {
            type: String,
            default: 'bg-color-hover',
        },

        /** 显示下边框 */
        borderBottom: {
            type: Boolean,
            default: false,
        },

        /** 显示上边框 */
        borderTop: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        // 图标样式
        $iconStyle() {
            const fontSize = isNumber(this.iconSize)
                ? pxTransform(this.iconSize)
                : this.iconSize;
            return {
                fontSize,
                ...(this.iconStyle || {}),
            };
        },

        // 标题样式
        $titleStyle() {
            const width = isNumber(this.titleWidth)
                ? pxTransform(this.titleWidth)
                : this.titleWidth;

            return {
                width: width || 'auto',
            };
        },
    },
};
</script>

<template>
    <view
        class="sd-cell-item"
        hover-stay-time="150"
        :hover-class="(clickable && hoverClass) || ''"
        :class="{
            'hairline--top': borderTop,
            'hairline--bottom': borderBottom,
        }"
        :style="{
            backgroundColor: bgColor,
        }"
    >
        <view class="sd-cell-item__icon-wrap">
            <slot name="icon">
                <text v-if="icon" :class="['sd-icon', `icon-${icon}`]" :style="[$iconStyle]" />
            </slot>
        </view>

        <view class="sd-cell-item__title" :style="[$titleStyle]">
            <block v-if="title">{{ title }}</block>
            <slot name="title" v-else></slot>
        </view>

        <view class="sd-cell-item__value" :style="[valueStyle]">
            <block v-if="value" class="sd-cell-item__alue">{{ value }}</block>
            <slot v-else></slot>
        </view>

        <view class="sd-cell-item__right">
            <slot name="right-icon">
                <view v-if="arrow" class="sd-cell-item__right-icon-wrap">
                    <text :class="['sd-icon', `icon-chevron-${arrowDirection}`]" />
                </view>
            </slot>
        </view>
    </view>
</template>

<style lang="scss">
.sd-cell-item {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 16px;
    line-height: 27px;
    text-align: left;

    &__icon-wrap {
        margin-right: 5px;
        font-size: 16px;
    }

    &__title {
        font-size: 14px;
    }

    &__right {
        line-height: 1;
    }

    &__right-icon-wrap {
        margin-left: 5px;
        color: $text-color-secondary;
        font-size: 14px;
    }

    &__left-icon-wrap,
    &__right-icon-wrap {
        display: flex;
        align-items: center;
        height: 24px;
    }

    &__value {
        overflow: hidden;
        text-align: right;
        color: $text-color-secondary;
        font-size: 14px;
    }

    &__title,
    &__value {
        flex: 1;
    }
}
</style>
