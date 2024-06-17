<script lang="ts" setup>
import { useMap } from "less-write-ui";
const { width, zoomIn, zoomOut, resetZoom } = useMap();

const tempData = [
  {
    x: 1000,
    y: 1000,
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 10000,
    y: 1000,
    data: {
      cooX: 100,
      cooY: 10,
      type: "device",
    },
  },
];
</script>
<template>
  <div>
    <LeButton @click="zoomIn(width / 2, 850 / 2)">放大</LeButton>
    <LeButton @click="zoomOut(width / 2, 850 / 2)">缩小</LeButton>
    <LeButton @click="resetZoom()">还原</LeButton>
    <LeMap
      :height="850"
      :size="{ width: 12300, height: 6150 / 1.1 }"
      :point-list="tempData"
      style="margin-top: 20px;border: 1px solid #000"
    ></LeMap>
  </div>
</template>
<style lang="less" scoped>
.le-button:not(:last-child) {
  margin-right: 5px;
}
</style>
