<script>
import { pxTransform } from '../../src/utils/helper';

export default {
    name: 'SdStepper',

    props: {
        defaultValue: {
            type: Number,
            default: 0,
        },

        theme: {
            type: String,
            default: '',
        },

        /** 最小值 */
        min: {
            type: Number,
            default: 0,
        },

        /** 最大值 */
        max: {
            type: Number,
            default: 99,
        },

        /** 步长，每次点击时改变的值 */
        step: {
            type: Number,
            default: 1,
        },

        /** 输入框宽度，默认单位为px */
        inputWidth: {
            type: Number,
            default: 28,
        },

        /** 按钮大小以及输入框高度，默认单位为px */
        buttonSize: {
            type: Number,
            default: 22,
        },

        /** 是否禁用步进器 */
        disabled: {
            type: Boolean,
            default: false,
        },

        /** 是否禁用增加按钮 */
        disabledPlus: {
            type: Boolean,
            default: false,
        },

        /** 是否禁用减少按钮 */
        disabledMinus: {
            type: Boolean,
            default: false,
        },

        /** 是否禁用输入框 */
        disableInput: {
            type: Boolean,
            default: false,
        },

        /** 是否只读输入框 */
        onlyReadInput: {
            type: Boolean,
            default: false,
        },

        /** 是否显示增加按钮 */
        showPlus: {
            type: Boolean,
            default: true,
        },

        /** 是否显示减少按钮 */
        showMinus: {
            type: Boolean,
            default: true,
        },

        /** 是否显示输入框 */
        showInput: {
            type: Boolean,
            default: true,
        },

        /** 是否显示输入框边框 */
        showInputBorder: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        $buttonStyle() {
            return {
                width : pxTransform(this.buttonSize),
                height: pxTransform(this.buttonSize),
            };
        },

        $inputStyle() {
            return {
                width : pxTransform(this.inputWidth),
                height: pxTransform(this.buttonSize),
            };
        },

        $themeClass() {
            return this.theme === 'round' ? 'sd-stepper--round' : '';
        },
    },

    methods: {
        // 处理减少按钮
        _tapMinus() {
            if (!this.showMinus || this.disabled || this.disabledMinus) return;
            this.$emit('minus');
        },

        // 处理增加按钮
        _tapPlus() {
            if (!this.showPlus || this.disabled || this.disabledPlus) return;
            this.$emit('plus');
        },

        // 处理input
        _tapInput() {
            if (!this.showInput || this.disabled || this.disableInput) return;
            this.$emit('tap-input');
        },
    },
};
</script>

<template>
    <view :class="['sd-stepper', $themeClass]" :hover-stop-propagation="true">
        <view
            :class="['sd-stepper__minus', { 'is-disabled': disabled || disabledMinus }]"
            :style="[$buttonStyle, { display: showMinus ? 'block' : 'none' }]"
            @tap="_tapMinus"
        >
            <view class="sd-stepper__minus-before" />
        </view>

        <input
            :value="defaultValue"
            :class="[
                'sd-stepper__input',
                {
                    'is-disabled': disabled || disableInput,
                    'sd-stepper__input--border': showInputBorder,
                },
            ]"
            :style="[$inputStyle, { display: showInput ? 'block' : 'none' }]"
            :disabled="disabled || disableInput || onlyReadInput"
            @tap="_tapInput"
        />

        <view
            :class="['sd-stepper__plus', { 'is-disabled': disabled || disabledPlus }]"
            :style="[$buttonStyle, { display: showPlus ? 'block' : 'none' }]"
            @tap="_tapPlus"
        >
            <view class="sd-stepper__plus-before" />
            <view class="sd-stepper__plus-after" />
        </view>
    </view>
</template>

<style lang="scss" scoped>
.sd-stepper {
    display: flex;

    &__minus,
    &__plus {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 28px;
        height: 28px;
        color: $text-color-regular;
        background-color: $bg-color;

        &-before {
            width: 50%;
            height: 1px;
        }

        &-after {
            width: 1px;
            height: 50%;
        }

        &-before,
        &-after {
            position: absolute;
            top: 50%;
            left: 50%;
            background-color: currentColor;
            transform: translate(-50%, -50%);
            content: '';
        }

        &.is-disabled {
            color: $color-grey-5;
            background-color: $color-grey-1;
            cursor: not-allowed;
        }
    }

    &__minus {
        border-radius: 4px 0 0 4px;
    }

    &__plus {
        border-radius: 0 4px 4px 0;
    }

    &__input {
        box-sizing: border-box;
        width: 32px;
        height: 28px;
        margin: 0 2px;
        padding: 0;
        line-height: normal;
        text-align: center;
        vertical-align: middle;
        color: $text-color-regular;
        background-color: $bg-color;
        border: 0;
        border-width: 1px 0;
        border-radius: 0;

        &.is-disabled {
            color: $color-grey-5;
            background-color: $color-grey-1;
        }
    }

    &--round {
        .sd-stepper__plus,
        .sd-stepper__minus {
            border-radius: 100%;

            &-before {
                height: 2px;
                border-radius: 4px;
            }

            &-after {
                width: 2px;
                border-radius: 4px;
            }

            &.is-disabled {
                &,
                &:active {
                    opacity: 0.3;
                }
            }
        }

        .sd-stepper__plus {
            color: $color-white;
            background-color: $color-theme;
        }

        .sd-stepper__minus {
            color: $color-theme;
            background-color: $color-white;
            border: 1px solid $color-theme;
        }

        .sd-stepper__input {
            background-color: transparent;
            box-sizing: border-box;

            &--border {
                border: 1px solid $color-theme;
                border-radius: 2px;
                margin: 0 4px;
            }

            &.is-disabled {
                opacity: 0.3;
            }
        }
    }
}
</style>
