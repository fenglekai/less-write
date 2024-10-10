<template>
  <div class="flex">
    <span>{{ value }}</span>
    <LeSlider v-model="value"></LeSlider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value = ref(0);
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  gap: 12px;

  .le-slider:nth-child(2) {
    flex-grow: 1;
  }
}
</style>
