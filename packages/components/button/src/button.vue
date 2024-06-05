<script lang="ts" setup>
const COMPONENT_NAME = "LeButton";
defineOptions({
  name: COMPONENT_NAME,
});
</script>
<template>
  <button class="le-button">
    <slot></slot>
  </button>
</template>
<style lang="less" scoped></style>
