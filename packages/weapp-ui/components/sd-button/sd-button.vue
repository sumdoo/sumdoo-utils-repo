<script>
export default {
    name: 'SdButton',

    props: {
        // 按钮类型
        type: {
            type: String,
            default: 'primary',
        },

        // 按钮大小
        size: String,

        // 是否圆角
        round: {
            type: Boolean,
            default: true,
        },

        // 是否缕空
        plain: {
            type: Boolean,
            default: false,
        },

        // 是否圆形
        circle: {
            type: Boolean,
            default: false,
        },

        // 禁用按钮
        disabled: {
            type: Boolean,
            default: false,
        },

        // 开放接口类型
        openType: String,
    },

    computed: {
        btnClass() {
            let className = `sd-button`;

            if (['primary', 'danger', 'info', 'warning'].includes(this.type)) {
                className += ` sd-button--${this.type}`;
            }

            if (this.size) {
                className += ` sd-button--${this.size}`;
            }

            if (this.disabled) {
                className += ' is-disabled';
            }

            if (this.round) {
                className += ` is-round`;
            }

            if (this.plain) {
                className += ` is-plain`;
            }

            if (this.circle) {
                className += ' is-circle';
            }

            return className;
        },
    },
};
</script>

<template>
    <button
        :class="btnClass"
        :disabled="disabled"
        :open-type="openType"
        hover-class="hover"
        @getphonenumber="$emit('getphonenumber', $event)"
    >
        <slot></slot>
    </button>
</template>

<style lang="scss" scoped>
@import './mixin.scss';

@include b(button) {
    /* 重置默认样式 */
    display: block;
    line-height: 1;
    white-space: nowrap;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: 0.1s;
    font-weight: $--button-font-weight;

    &::after {
        display: none;
    }

    // 默认颜色
    background: $--button-default-background-color;
    border: $--border-base;
    border-color: $--button-default-border-color;
    color: $--button-default-font-color;

    // 默认大小
    @include button-size(
        $--button-padding-vertical,
        $--button-padding-horizontal,
        $--button-font-size,
        $--button-border-radius
    );

    // 设置交互时样式
    &.hover {
        color: $--color-primary;
        border-color: $--color-primary-light-7;
        background-color: $--color-primary-light-9;
    }

    // 缕空样式
    @include when(plain) {
        &.hover {
            background: $--color-white;
            border-color: $--color-primary;
            color: $--color-primary;
        }
    }

    // 禁用样式
    @include when(disabled) {
        &,
        &.hover {
            color: $--button-disabled-font-color;
            background-color: $--button-disabled-background-color;
            border-color: $--button-disabled-border-color;
        }

        &.com-button--text {
            background-color: transparent;
        }

        &.is-plain {
            &,
            &.hover {
                background-color: $--color-white;
                border-color: $--button-disabled-border-color;
                color: $--button-disabled-font-color;
            }
        }
    }

    // 设置不同类型颜色
    @include m(primary) {
        @include button-variant(
            $--button-primary-font-color,
            $--button-primary-background-color,
            $--button-primary-border-color
        );
    }

    @include m(success) {
        @include button-variant(
            $--button-success-font-color,
            $--button-success-background-color,
            $--button-success-border-color
        );
    }

    @include m(warning) {
        @include button-variant(
            $--button-warning-font-color,
            $--button-warning-background-color,
            $--button-warning-border-color
        );
    }

    @include m(danger) {
        @include button-variant(
            $--button-danger-font-color,
            $--button-danger-background-color,
            $--button-danger-border-color
        );
    }

    @include m(info) {
        @include button-variant(
            $--button-info-font-color,
            $--button-info-background-color,
            $--button-info-border-color
        );
    }

    // 按钮椭圆
    @include when(round) {
        border-radius: 20px;
        padding: 12px 23px;
    }

    // 按钮圆圈
    @include when(circle) {
        border-radius: 50%;
        padding: $--button-padding-vertical;
    }

    // 按钮大小
    @include m(large) {
        @include button-size(
            $--button-large-padding-vertical,
            $--button-large-padding-horizontal,
            $--button-large-font-size,
            $--button-large-border-radius
        );

        @include when(circle) {
            padding: $--button-large-padding-vertical;
        }
    }

    @include m(medium) {
        @include button-size(
            $--button-medium-padding-vertical,
            $--button-medium-padding-horizontal,
            $--button-medium-font-size,
            $--button-medium-border-radius
        );

        @include when(circle) {
            padding: $--button-medium-padding-vertical;
        }
    }

    @include m(small) {
        @include button-size(
            $--button-small-padding-vertical,
            $--button-small-padding-horizontal,
            $--button-small-font-size,
            $--button-small-border-radius
        );

        @include when(circle) {
            padding: $--button-small-padding-vertical;
        }
    }

    @include m(mini) {
        @include button-size(
            $--button-mini-padding-vertical,
            $--button-mini-padding-horizontal,
            $--button-mini-font-size,
            $--button-mini-border-radius
        );

        @include when(circle) {
            padding: $--button-mini-padding-vertical;
        }
    }

    @include m(text) {
        border-color: transparent;
        color: $--color-primary;
        background: transparent;
        padding-left: 0;
        padding-right: 0;

        &.hover {
            color: mix($--color-white, $--color-primary, $--button-hover-tint-percent);
            border-color: transparent;
            background-color: transparent;
        }

        &.is-disabled,
        &.is-disabled.hover {
            border-color: transparent;
        }
    }
}
</style>
