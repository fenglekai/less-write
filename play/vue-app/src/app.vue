<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { BezierConfig, MapInstance, PointConfig } from "less-write-ui";

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
const size = { width: 12300, height: 6150 }
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

const deviceData = ref<PointConfig[]>([
  {
    x: 5000,
    y: 2000,
    width: 40,
    height: 40,
    rotation: 90,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
    data: {
      cooX: 100,
      cooY: 10,
      type: "device",
    },
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

function evaluateCubicBezierAt(
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) {
  const oneMinusT = 1 - t;
  return {
    x:
      oneMinusT * oneMinusT * oneMinusT * p0.x +
      3 * oneMinusT * oneMinusT * t * p1.x +
      3 * oneMinusT * t * t * p2.x +
      t * t * t * p3.x,
    y:
      oneMinusT * oneMinusT * oneMinusT * p0.y +
      3 * oneMinusT * oneMinusT * t * p1.y +
      3 * oneMinusT * t * t * p2.y +
      t * t * t * p3.y,
  };
}
const bezierSource = {
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
};
const pathSource = (bezier: {
  start: { x: number; y: number };
  controlStart: { x: number; y: number };
  controlEnd: { x: number; y: number };
  end: { x: number; y: number };
}) => {
  const points: { x: number; y: number }[] = [];
  const numSamples = 100; // 采样点的数量
  for (let i = 0; i <= numSamples; i++) {
    const t = i / numSamples;
    const point = evaluateCubicBezierAt(
      t,
      bezier.start,
      bezier.controlStart,
      bezier.controlEnd,
      bezier.end
    );
    points.push(point);
  }
  return points;
};

const dynamicPath = ref<{ x: number; y: number }[]>([]);
function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const run =async  () => {
  dynamicPath.value = pathSource(bezierSource);
  let rotation = 90
  for (const iterator of dynamicPath.value) {
    await sleep(50);
    deviceData.value[0] = {
      ...deviceData.value[0],
      ...iterator,
      rotation
    };
    rotation+=1
  }
};
onMounted(() => {
  run();
});


</script>
<template>
  <div>
    <LeButton @click="handleZoomIn">放大</LeButton>
    <LeButton @click="handleZoomOut">缩小</LeButton>
    <LeButton @click="handleResetZoom">还原</LeButton>
    <!-- https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg -->
    <!-- https://raw.githubusercontent.com/fenglekai/image-bed/master/wallhaven-85128j.png -->
    <LeMap
      ref="mapRef"
      :size="size"
      :path-data="pathData"
      :point-data="[...pointData, ...deviceData]"
      style="margin-top: 20px; border: 1px solid #000"
    ></LeMap>
  </div>
</template>
<style lang="less" scoped>
.le-button:not(:last-child) {
  margin-right: 5px;
}
</style>
