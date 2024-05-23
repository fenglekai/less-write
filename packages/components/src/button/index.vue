<script lang="ts">
import './index.less';
import { defineComponent, computed } from 'vue'
import { buttonProps } from './types'
</script>

<script lang="ts" setup>

defineComponent({
    name: 'lw-button',
    props: buttonProps,
    setup(props) {
        const styleClass = computed(() => { 
            return {
                [`lw-button--${props.type}`]: props.type
            }
        })

        return {
            styleClass
        };
    },
});
</script>
<template>
    <button class="lw-button">
        <slot></slot>
    </button>
</template>
<style lang="less" scoped>
</style>