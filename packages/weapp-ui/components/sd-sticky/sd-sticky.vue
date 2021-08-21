<script>
let statusBarHeight = 0;
export default {
    name: 'SdSticky',

    props: {
        top: {
            type: [Number, String],
            default: 25,
        },

        calcStatusBar: {
            type: Boolean,
            default: true,
        },

        zIndex: {
            type: Number,
            default: 99,
        },
    },

    data() {
        return {
            statusBarHeight,
        };
    },

    computed: {
        $stickyStyle() {
            const { statusBarHeight, calcStatusBar, top } = this;
            if (!statusBarHeight) {
                return {
                    position: 'relative',
                };
            }

            return {
                top   : Number(top) + (calcStatusBar ? statusBarHeight : 0) + 'px',
                zIndex: this.zIndex,
            };
        },
    },

    async created() {
        if (statusBarHeight) {
            this.statusBarHeight = statusBarHeight;
            return;
        }

        let { ok, data } = await uni.$.getSystemInfo();
        if (!ok) return;

        this.statusBarHeight = statusBarHeight = data.statusBarHeight;
    },
};
</script>

<template>
    <view class="sticky" :style="[$stickyStyle]">
        <slot></slot>
    </view>
</template>

<style lang="scss" scoped>
.sticky {
    position: sticky;
}
</style>
