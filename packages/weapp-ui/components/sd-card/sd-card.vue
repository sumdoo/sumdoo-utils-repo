<script>
import { isNumber    } from '@sumdoo-utils/core';
import { pxTransform } from '../../src/utils/helper';

export default {
    name: 'SdCard',

    props: {
        /** 是否显示 Icon */
        showIcon: {
            type: Boolean,
            default: false,
        },

        /** icon 名称, 只能在 sd-icon 中有的 */
        iconName: {
            type: String,
            default: '',
        },

        /** 标题大小 */
        iconSize: {
            type: [String, Number],
            default: 26,
        },

        /** 标题颜色 */
        iconColor: {
            type: String,
            default: '',
        },

        /** 标题 */
        title: {
            type: String,
            default: '',
        },

        /** 标题大小 */
        titleSize: {
            type: [String, Number],
            default: 14,
        },

        /** 标题颜色 */
        titleColor: {
            type: String,
            default: '',
        },

        /** 副标题 */
        subTitle: {
            type: String,
            default: '',
        },

        /** 副标题大小 */
        subTitleSize: {
            type: [String, Number],
            default: 14,
        },

        /** 副标题颜色 */
        subTitleColor: {
            type: String,
            default: '',
        },

        /** 卡片圆角 */
        borderRadius: {
            type: [String, Number],
            default: 5,
        },

        /** 是否显示头部 */
        showHead: {
            type: Boolean,
            default: true,
        },

        /** 是否显示头部下边框 */
        headBorderBottom: {
            type: Boolean,
            default: true,
        },

        /** 是否显示主体 */
        showBody: {
            type: Boolean,
            default: true,
        },

        /** 是否显示底部 */
        showFoot: {
            type: Boolean,
            default: true,
        },

        /** 是否显示底部上边框 */
        footBorderTop: {
            type: Boolean,
            default: true,
        },

        /** 上下边框线的样式 solid 实现 dashed 虚线 */
        borderStyle: {
            type: String,
            default: 'solid',
        },

        /** 自定义头部样式 */
        headStyle: {
            type: Object,
            default() {
                return {};
            },
        },

        /** 自定义主体样式 */
        bodyStyle: {
            type: Object,
            default() {
                return {};
            },
        },

        /** 自定义底部样式 */
        footStyle: {
            type: Object,
            default() {
                return {};
            },
        },

        arrow: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        $cardStyle() {
            const borderRadius = isNumber(this.borderRadius)
                ? pxTransform(this.borderRadius)
                : this.borderRadius;

            return {
                borderRadius,
            };
        },

        // 标题样式
        $titleStyle() {
            let style = {};
            if (this.titleColor) style.color = this.titleColor;
            if (this.titleSize) {
                if (isNumber(this.titleSize)) {
                    style.fontSize = pxTransform(this.titleSize);
                } else {
                    style.fontSize = this.titleSize;
                }
            }

            return style;
        },

        // 副标题样式
        $subTitleStyle() {
            let style = {};
            if (this.subTitleColor) style.color = this.subTitleColor;
            if (this.subTitleSize) {
                if (isNumber(this.subTitleSize)) {
                    style.fontSize = pxTransform(this.subTitleSize);
                } else {
                    style.fontSize = this.subTitleSize;
                }
            }

            return style;
        },

        $iconStyle() {
            let style = {};
            if (this.iconColor) style.color = this.iconColor;
            if (this.iconSize) {
                if (isNumber(this.iconSize)) {
                    style.fontSize = pxTransform(this.iconSize);
                } else {
                    style.fontSize = this.iconSize;
                }
            }

            return style;
        },

        // 头部样式
        $headStyle() {
            return {
                borderBottomStyle: this.borderStyle,
                ...(this.headStyle || {}),
            };
        },

        // 头部样式
        $footStyle() {
            return {
                borderTopStyle: this.borderStyle,
                ...(this.footStyle || {}),
            };
        },
    },
};
</script>

<template>
    <view class="sd-card" :style="[$cardStyle]">
        <view
            v-if="showHead"
            :class="['sd-card__head', { 'hairline--bottom': headBorderBottom }]"
            :style="[$headStyle]"
            @tap="$emit('tap-head')"
        >
            <slot name="head">
                <text
                    v-if="showIcon"
                    :class="['sd-icon', `icon-${iconName}`, 'title-icon']"
                    :style="[$iconStyle]"
                />
                <view class="sd-card__head-title" :style="[$titleStyle]">
                    {{ title }}
                </view>
                <view class="sd-card__head-sub-title" :style="[$subTitleStyle]">
                    {{ subTitle }}
                </view>
                <text v-if="arrow" class="sd-icon icon-chevron-right f14_i ml5" />
            </slot>
        </view>
        <view v-if="showBody" class="sd-card__body" :style="[bodyStyle]">
            <slot name="body"></slot>
        </view>
        <view
            v-if="showFoot"
            :class="['sd-card__foot', { 'hairline--top': footBorderTop }]"
            :style="[$footStyle]"
        >
            <slot name="foot"></slot>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.sd-card {
    background-color: #fff;

    &__head {
        display: flex;
        align-items: center;
        padding: 15px 10px;

        .title-icon {
            margin-right: 5px;
        }

        &-title {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 5px;
        }
    }

    &__body {
        padding: 10px;
    }

    &__foot {
        padding: 15px 10px;
    }

    & + & {
        margin-top: 10px;
    }
}
</style>
