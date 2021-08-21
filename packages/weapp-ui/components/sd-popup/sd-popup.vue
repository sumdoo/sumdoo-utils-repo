<script>
export default {
    name: 'SdPopup',
    
    props: {
        /**
         * 显示弹窗
         */
        visible: {
            type: Boolean,
            default: false,
        },

        /**
         * 弹出模式
         */
        mode: {
            type: String,
            default: 'bottom',
        },

        /**
         * 是否显示关闭按钮
         */
        closeable: {
            type: Boolean,
            default: false,
        },

        /**
         * 关闭图标大小
         */
        closeIconSize: {
            type: [String, Number],
            default: 40,
        },

        /**
         * 弹窗标题
         */
        title: {
            type: String,
            default: '',
        },

        /**
         * 是否显示标题
         */
        showTitle: {
            type: Boolean,
            default: false,
        },

        /**
         * 弹窗宽度
         */
        width: {
            type: [Number, String],
            default: 700,
        },

        /**
         * 弹窗高度
         */
        height: {
            type: [Number, String],
            default: 'auto',
        },

        /**
         * 弹窗圆角值
         */
        borderRadius: {
            type: [Number, String],
            default: 15,
        },

        // 层叠
        zIndex: {
            type: [Number | String],
            default: 10075,
        },
    },
    data() {
        this.timer = null;
        return {
            internalVisible: this.visible,
        };
    },
    watch: {
        visible(value) {
            this.internalVisible = value;
        },

        internalVisible: {
            handler(value) {
                clearTimeout(this.timer);

                if (value) {
                    this.$emit('open');
                } else {
                    this.$emit('close');
                }

                this.timer = setTimeout(() => {
                    this.$emit('update:visible', value);
                    if (value) {
                        this.$emit('opend');
                    } else {
                        this.$emit('closed');
                    }
                }, 100);
            },
            immediate: true,
        },
    },

    methods: {
        _close() {
            this.internalVisible = false;
        },
    },
};
</script>

<template>
    <u-popup
        v-model="internalVisible"
        :mode="mode"
        :closeable="closeable"
        :width="width"
        :height="height"
        :border-radius="borderRadius"
        :zoom="false"
        :close-icon-size="closeIconSize"
        :z-index="zIndex"
        @close="_close"
    >
        <view v-if="showTitle" class="popup-title ellipsis">
            {{ title }}
        </view>
        <slot></slot>
    </u-popup>
</template>

<style lang="scss" scoped>
.popup-title {
    height: 50px;
    line-height: 50px;
    padding: 0 50px;
    font-size: 16px;
    text-align: center;
}
</style>
