<script lang="ts" setup>
import { Button, Map } from "less-write-ui";
import { useMap } from "less-write-ui/hook";

const { WIDTH, zoomIn, zoomOut, resetZoom } = useMap;

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
    <Button @click="zoomIn(WIDTH / 2, 850 / 2)">放大</Button>
    <Button @click="zoomOut(WIDTH / 2, 850 / 2)">缩小</Button>
    <Button @click="resetZoom()">还原</Button>
    <Map
      :height="850"
      :size="{ width: 12300, height: 6150 / 1.1 }"
      :point-list="tempData"
    ></Map>
  </div>
</template>
<style lang="less" scoped>
.lw-button:not(:last-child) {
  margin-right: 5px;
}
</style>
