<script lang="ts" setup>
import { ref } from "vue";
import { MapInstance } from "less-write-ui";

const mapRef = ref<MapInstance>();

const handleZoomIn = () => {
  mapRef.value?.zoomIn(mapRef.value?.width / 2, 850 / 2);
};
const handleZoomOut = () => {
  mapRef.value?.zoomOut(mapRef.value?.width / 2, 850 / 2);
};
const handleResetZoom = () => {
  mapRef.value?.resetZoom();
};

const tempData = ref([
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
    x: 1000,
    y: 1100,
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 1000,
    y: 1200,
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 1000,
    y: 1300,
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 1000,
    y: 1400,
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 1000,
    y: 1500,
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 1000,
    y: 1600,
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 1000,
    y: 1700,
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 1000,
    y: 1800,
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 1000,
    y: 1900,
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
  {
    x: 1000,
    y: 2000,
    width: 30,
    height: 30,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
    data: {
      cooX: 100,
      cooY: 10,
      type: "device",
    },
  },
  {
    x: 1000,
    y: 3000,
    width: 50,
    height: 50,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
    data: {
      cooX: 100,
      cooY: 10,
      type: "device",
    },
  },
  {
    x: 1000,
    y: 4000,
    width: 70,
    height: 70,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
    data: {
      cooX: 100,
      cooY: 10,
      type: "device",
    },
  },
]);
</script>
<template>
  <div>
    <LeButton @click="handleZoomIn">放大</LeButton>
    <LeButton @click="handleZoomOut">缩小</LeButton>
    <LeButton @click="handleResetZoom">还原</LeButton>
    <LeMap
      ref="mapRef"
      :height="850"
      :size="{ width: 12300, height: 6150 }"
      :point-list="tempData"
      background="https://raw.githubusercontent.com/fenglekai/image-bed/master/wallhaven-85128j.png"
      style="margin-top: 20px; border: 1px solid #000"
    ></LeMap>
  </div>
</template>
<style lang="less" scoped>
.le-button:not(:last-child) {
  margin-right: 5px;
}
</style>
