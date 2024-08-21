<script lang="ts" setup>
import { ref } from "vue";
import type { BezierConfig, MapInstance, PointConfig } from "less-write-ui";

const mapRef = ref<MapInstance>();

const handleZoomIn = () => {
  mapRef.value?.zoomIn();
};
const handleZoomOut = () => {
  mapRef.value?.zoomOut();
};
const handleResetZoom = () => {
  mapRef.value?.resetZoom();
};

const tempData = ref<PointConfig[]>([
  {
    x: 1000,
    y: 1000,
    fill: "black",
  },
  {
    x: 1000,
    y: 1200,
    fill: "black",
  },

  {
    x: 1000,
    y: 1400,
    fill: "black",
  },

  {
    x: 1000,
    y: 1600,
    fill: "black",
  },

  {
    x: 1000,
    y: 1800,
    fill: "black",
  },

  {
    x: 10000,
    y: 1000,
    fill: "black",
  },
  {
    x: 1000,
    y: 2000,
    width: 30,
    height: 30,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
  },
  {
    x: 1000,
    y: 3000,
    width: 50,
    height: 50,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
  },
  {
    x: 1000,
    y: 4000,
    width: 70,
    height: 70,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
  },
]);

const pathData = ref<BezierConfig[]>([
  {
    start: {
      x: 5000,
      y: 2000,
    },
    controlStart: {
      x: 4000,
      y: 2000,
    },
    controlEnd: {
      x: 4000,
      y: 3000,
    },
    end: {
      x: 4000,
      y: 3000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 5000,
      y: 2000,
    },
    controlStart: {
      x: 6000,
      y: 2000,
    },
    controlEnd: {
      x: 6000,
      y: 3000,
    },
    end: {
      x: 6000,
      y: 3000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 6000,
      y: 3000,
    },
    end: {
      x: 7000,
      y: 3000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 5000,
      y: 2000,
    },
    end: {
      x: 9000,
      y: 3000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 4000,
      y: 3000,
    },
    end: {
      x: 4000,
      y: 5000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 4000,
      y: 3000,
    },
    end: {
      x: 6000,
      y: 3000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 4000,
      y: 3000,
    },
    end: {
      x: 6000,
      y: 3000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 4000,
      y: 5000,
    },
    end: {
      x: 7000,
      y: 5000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 8000,
      y: 4000,
    },
    controlStart: {
      x: 8000,
      y: 3000,
    },
    controlEnd: {
      x: 7000,
      y: 3000,
    },
    end: {
      x: 7000,
      y: 3000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 8000,
      y: 4000,
    },
    controlStart: {
      x: 8000,
      y: 5000,
    },
    controlEnd: {
      x: 7000,
      y: 5000,
    },
    end: {
      x: 7000,
      y: 5000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 8000,
      y: 4000,
    },
    controlStart: {
      x: 8000,
      y: 3000,
    },
    controlEnd: {
      x: 9000,
      y: 3000,
    },
    end: {
      x: 9000,
      y: 3000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 8000,
      y: 4000,
    },
    controlStart: {
      x: 8000,
      y: 5000,
    },
    controlEnd: {
      x: 9000,
      y: 5000,
    },
    end: {
      x: 9000,
      y: 5000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 9000,
      y: 3000,
    },
    end: {
      x: 9000,
      y: 5000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 7000,
      y: 3000,
    },
    end: {
      x: 7000,
      y: 5000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 7000,
      y: 3000,
    },
    end: {
      x: 9000,
      y: 3000,
    },
    stroke: "black",
  },
  {
    start: {
      x: 7000,
      y: 5000,
    },
    end: {
      x: 9000,
      y: 5000,
    },
    stroke: "black",
  },
]);

const pointData = ref<PointConfig[]>([
  {
    x: 5000,
    y: 2000,
    fill: "black",
    data: {
      cooX: 100,
      cooY: 10,
      type: "agv",
    },
  },
  {
    x: 4000,
    y: 3000,
    fill: "black",
  },
  {
    x: 4000,
    y: 5000,
    fill: "black",
  },
  {
    x: 6000,
    y: 3000,
    fill: "black",
  },
  {
    x: 7000,
    y: 3000,
    fill: "black",
  },
  {
    x: 9000,
    y: 3000,
    fill: "black",
  },
  {
    x: 9000,
    y: 5000,
    fill: "black",
  },
  {
    x: 7000,
    y: 5000,
    fill: "black",
  },
  {
    x: 8000,
    y: 4000,
    fill: "black",
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
      :size="{ width: 12300, height: 6150 }"
      :path-data="pathData"
      :point-data="[...tempData, ...pointData]"
      style="margin-top: 20px; border: 1px solid #000"
    ></LeMap>
    <!-- <LeMap
      ref="mapRef"
      :size="{ width: 12300, height: 6150 }"
      :path-data="pathData"
      :point-data="[...tempData, ...pointData]"
      background="https://raw.githubusercontent.com/fenglekai/image-bed/master/wallhaven-85128j.png"
      style="margin-top: 20px; border: 1px solid #000"
    ></LeMap> -->
  </div>
</template>
<style lang="less" scoped>
.le-button:not(:last-child) {
  margin-right: 5px;
}
</style>
