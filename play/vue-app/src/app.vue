<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import type { BezierConfig, MapInstance, PointConfig } from "less-write-ui";
import { deviceData, run } from "./runTrack";

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

const value = ref(0);
</script>
<template>
  <div class="container">
    <div class="slider-wrapper">
      <div>{{ value }}</div>
      <LeSlider v-model="value" min="1" max="10" step="0.2"></LeSlider>
      <LeSlider v-model="value" vertical min="1" max="10" step="0.2"></LeSlider>
    </div>
    <!-- https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg -->
    <!-- https://raw.githubusercontent.com/fenglekai/image-bed/master/bloom.png -->
    <!-- <LeButton @click="handleZoomIn">放大</LeButton>
    <LeButton @click="handleZoomOut">缩小</LeButton>
    <LeButton @click="handleResetZoom">还原</LeButton>
     scale: {{ mapRef?.mapInstance.scale }}
    <LeMap
      ref="mapRef"
      min="1"
      max="10"
      step="1"
      :size="size"
      background="https://raw.githubusercontent.com/fenglekai/image-bed/master/bloom.png"
      style="border: 1px solid #dcdfe6; border-radius: 6px; overflow: hidden"
    ></LeMap> -->
    <LeButton @click="handleRunClick">运行轨迹</LeButton>
    <LeMap
      min="1"
      max="10"
      step="0.2"
      :size="size"
      :path-data="pathData"
      :point-data="[...pointData, ...deviceData]"
      operation
      limit
      space
      style="border: 1px solid #dcdfe6; border-radius: 6px; overflow: hidden"
      @point-click="(data) => {console.log(data)}"
    ></LeMap>
  </div>
</template>
<style lang="less" scoped>
.slider-wrapper {
  width: 50%;
  height: 200px;
  margin: 20px;
  display: flex;
  & > *:not(:first-child) {
    flex: 1;
    margin-right: 20px;
  }
  & > *:first-child {
    width: 30px;
    margin-right: 20px;
  }
}
.le-button:not(:last-child) {
  margin-right: 5px;
}
.container > * + * {
  margin-bottom: 20px;
}
</style>
