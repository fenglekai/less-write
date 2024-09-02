<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import type { BezierConfig, MapInstance, PointConfig } from "less-write-ui";
import { deviceData, run } from "./runTrack";

const mapRef = ref<MapInstance>();

const handleZoomIn = () => {
  mapRef.value?.mapInstance.zoomIn();
};
const handleZoomOut = () => {
  mapRef.value?.mapInstance.zoomOut();
};
const handleResetZoom = () => {
  mapRef.value?.mapInstance.resetZoom();
};
const size = { width: 12300, height: 6150 };
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
    x: 1000,
    y: 1000,
    fill: "black",
  },
  {
    x: 1100,
    y: 1000,
    fill: "black",
  },
  {
    x: 5000,
    y: 2000,
    fill: "black",
    data: {
      cooX: 100,
      cooY: 10,
      type: "point",
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

let runInstance: any = run();

const handleRunClick = () => {
  runInstance.destoy();
  runInstance = null;
  runInstance = run();
  runInstance.init();
};

onMounted(() => {
  // runInstance.init();
});
onUnmounted(() => {
  runInstance.destoy();
  runInstance = null;
});
</script>
<template>
  <div>
    <LeButton @click="handleZoomIn">放大</LeButton>
    <LeButton @click="handleZoomOut">缩小</LeButton>
    <LeButton @click="handleResetZoom">还原</LeButton>
    <LeButton @click="handleRunClick">运行轨迹</LeButton>
    <!-- https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg -->
    <!-- https://raw.githubusercontent.com/fenglekai/image-bed/master/bloom.png -->
    <LeMap
      ref="mapRef"
      :size="size"
      :path-data="[]"
      :point-data="[]"
      operation
      limit
      background="https://raw.githubusercontent.com/fenglekai/image-bed/master/bloom.png"
      style="margin-top: 20px; border: 1px solid #dcdfe6; border-radius: 6px;overflow: hidden;"
    ></LeMap>
    <LeMap
      :size="size"
      :path-data="pathData"
      :point-data="[...pointData, ...deviceData]"
      operation
      limit
      style="margin-top: 20px; border: 1px solid #dcdfe6; border-radius: 6px;overflow: hidden;"
    ></LeMap>
  </div>
</template>
<style lang="less" scoped>
.le-button:not(:last-child) {
  margin-right: 5px;
}
</style>
