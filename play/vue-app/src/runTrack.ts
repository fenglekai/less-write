import { ref } from "vue";
import type { PointConfig } from "less-write-ui/index.ts";
import { loadImage } from "@less-write/utils";

const deviceData = ref<PointConfig[]>([]);

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

const numSamples = 90; // 采样点的数量

let dynamicPath: { x: number; y: number }[] = [];

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

const pathSource = (bezier: {
  start: { x: number; y: number };
  controlStart: { x: number; y: number };
  controlEnd: { x: number; y: number };
  end: { x: number; y: number };
}) => {
  const points: { x: number; y: number }[] = [];

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

function sleep(ms: number | undefined) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const run = async () => {
  const logo = await loadImage(
    "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg"
  );
  const bg = await loadImage(
    "https://raw.githubusercontent.com/fenglekai/image-bed/master/wallhaven-85128j.png"
  );
  const tempPoint = {
    x: 5000,
    y: 2000,
    width: 40,
    height: 40,
    rotation: 90,
    image: logo,
    data: {
      cooX: 100,
      cooY: 10,
      type: "device",
    },
  };
  deviceData.value[0] = tempPoint;
  let flag = true;
  const destroy = () => {
    flag = false;
  };
  const init = async () => {
    dynamicPath = pathSource(bezierSource);
    let rotation = 90;
    for (const iterator of dynamicPath) {
      if (!flag) break;
      await sleep(50);
      deviceData.value[0] = {
        ...deviceData.value[0],
        ...iterator,
        rotation,
      };
      if (rotation > 135) {
        deviceData.value[0].image = bg;
      }
      rotation += 1;
    }
  };
  return {
    init,
    destroy,
  };
};

export { deviceData, run };
