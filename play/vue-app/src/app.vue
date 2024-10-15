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
const clickData = ref<PointConfig>();

let runInstance: any;

const handleRunClick = async () => {
  runInstance.destroy();
  runInstance = null;
  runInstance = await run();
  runInstance.init();
};

const tempData = ref<PointConfig[]>([]);
const getMapData = () => {
  setTimeout(() => {
    tempData.value.push({
      x: 5000,
      y: 1000,
      fill: "black",
    });
  }, 2000);
};

onMounted(async () => {
  runInstance = await run();
  // runInstance.init();
  getMapData();
});
onUnmounted(() => {
  runInstance.destroy();
  runInstance = null;
});

const value = ref(0);

const asideWidth = ref(250);
const handleAside = () => {
  if (asideWidth.value != 250) {
    asideWidth.value = 250;
  } else {
    asideWidth.value = 100;
  }
};
</script>
<template>
  <div class="container">
    <div class="slider-wrapper">
      <div>{{ value }}</div>
      <LeSlider v-model="value" min="1" max="10" step="0.2"></LeSlider>
      <LeSlider
        v-model="value"
        height="200px"
        vertical
        min="1"
        max="10"
        step="0.2"
      ></LeSlider>
    </div>
    <!-- https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg -->
    <!-- https://raw.githubusercontent.com/fenglekai/image-bed/master/bloom.png -->
    <LeButton @click="handleZoomIn">放大</LeButton>
    <LeButton @click="handleZoomOut">缩小</LeButton>
    <LeButton @click="handleResetZoom">还原</LeButton>
    scale: {{ mapRef?.scale }}
    <LeButton @click="handleAside"
      >拓展</LeButton
    >
    <div :style="{ display: 'flex', paddingLeft: asideWidth + 'px', transition: 'padding 0.3s' }">
      <div
        style="
          width: 0;
          padding: 20px;
          border: 1px solid #dcdfe6;
          border-radius: 6px;
          flex: 1 1 auto;
        "
      >
        <LeMap
          ref="mapRef"
          min="1"
          max="10"
          step="1"
          :size="size"
          background="https://raw.githubusercontent.com/fenglekai/image-bed/master/bloom.png"
        ></LeMap>
      </div>
    </div>
    <LeButton @click="handleRunClick">运行轨迹</LeButton>
    {{ clickData }}
    <LeMap
      min="1"
      max="5"
      step="0.1"
      :size="size"
      :point-data="[...pointData, ...deviceData, ...tempData]"
      :path-data="pathData"
      operation
      space
      grid
      style="border: 1px solid #dcdfe6; border-radius: 6px"
      @point-click="
        (data) => {
          clickData = data;
        }
      "
    ></LeMap>
  </div>
</template>
<style>
#app {
  padding: 36px;
}
</style>
<style lang="less" scoped>
.slider-wrapper {
  width: 50%;
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
