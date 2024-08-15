import { ref, computed, unref } from "vue";
import Konva from "konva";
import type { RectConfig } from "konva/lib/shapes/Rect";
import type { ImageConfig } from "konva/lib/shapes/Image";
import type { ShapeConfig } from "konva/lib/Shape";
import { loadImage } from "@less-write/utils";

export interface Point extends ShapeConfig {
  image?: HTMLImageElement | string;
  data?: any;
}

export interface MapGroup {
  ctx: {
    el: string;
    width: number;
    height: number;
  };
  background?: string;
  size?: {
    width: number;
    height: number;
  };
  pointList?: Point[];
  callback?: (data: any) => void;
}

export function useMap() {
  const WIDTH = ref(0);
  let HEIGHT = 520;
  let imgRenderHeight = 0;

  const scale = ref(1);
  // 最大缩放比例
  const MAX_SCALE = 9;
  // 最小缩放比例
  const MIN_SCALE = 1;
  // 每次缩放大小
  const SCALE_STEP = 0.2;
  // 基础缩放倍率
  const BASE_SCALE = 1 + SCALE_STEP;
  // 放大统计
  const scaleCount = computed(() => {
    return (
      (scale.value * DECIMAL_PLACE - 1 * DECIMAL_PLACE) /
      (SCALE_STEP * DECIMAL_PLACE)
    );
  });
  // 计算小数位
  const DECIMAL_PLACE = 10 ** SCALE_STEP.toString().split(".")[1].length;

  let stage: Konva.Stage;
  const layer = new Konva.Layer();

  // 限制边缘
  function limitBrink(limitX: number, limitY: number) {
    if (limitX > 0) {
      limitX = 0;
    }

    if (limitY > 0) {
      limitY = 0;
    }

    // // 计算底图与底图高度差距
    const bottomLimit =
      HEIGHT - imgRenderHeight * BASE_SCALE ** scaleCount.value;
    if (limitY < bottomLimit) {
      // 当底图实际宽度小于地图宽度设为0
      limitY = bottomLimit > 0 ? 0 : bottomLimit;
    }
    const rightLimit =
      WIDTH.value - WIDTH.value * BASE_SCALE ** scaleCount.value;
    if (limitX < rightLimit) {
      limitX = rightLimit > 0 ? 0 : rightLimit;
    }

    return { x: limitX, y: limitY };
  }

  const group = new Konva.Group({
    draggable: true,
    dragBoundFunc(pos) {
      const { x, y } = pos;
      return limitBrink(x, y);
    },
  });

  // 放大时改变点位之间的间距
  function usePointPosition(type: string) {
    const wrapper = group
      .getChildren((item) => item.attrs.name === "drag-wrapper")
      .pop();
    const children = group.getChildren(
      (item) => item.attrs.name !== "drag-wrapper"
    );

    if (!wrapper) return;
    const scaleDiff = BASE_SCALE - 0.1;
    switch (type) {
      case "in":
        wrapper.scale({
          x: wrapper.scaleX() * BASE_SCALE,
          y: wrapper.scaleY() * BASE_SCALE,
        });
        children.forEach((item) => {
          item.scale({
            x: item.scaleX() * scaleDiff,
            y: item.scaleY() * scaleDiff,
          });

          const centerScale =
            (item.width() * item.scaleX() -
              (item.width() * item.scaleX()) / scaleDiff) /
            2;
          item.setPosition({
            x: item.x() * BASE_SCALE + centerScale,
            y: item.y() * BASE_SCALE + centerScale,
          });
        });
        break;
      case "out":
        wrapper.scale({
          x: wrapper.scaleX() / BASE_SCALE,
          y: wrapper.scaleY() / BASE_SCALE,
        });
        children.forEach((item) => {
          item.scale({
            x: item.scaleX() / scaleDiff,
            y: item.scaleY() / scaleDiff,
          });

          const centerScale =
            (item.width() * item.scaleX() -
              item.width() * item.scaleX() * scaleDiff) /
            2;
          item.setPosition({
            x: (item.x() + centerScale) / BASE_SCALE,
            y: (item.y() + centerScale) / BASE_SCALE,
          });
        });
        break;
      case "reset":
        wrapper.scale({
          x: 1,
          y: 1,
        });
        children.forEach((item) => {
          item.scale({
            x: 1,
            y: 1,
          });

          let setX = item.x();
          let setY = item.y();
          for (let i = scaleCount.value; i > 0; i--) {
            const centerScale =
              (item.width() * scaleDiff ** (i - 1) -
                item.width() * scaleDiff ** i) /
              2;
            setX = (setX + centerScale) / BASE_SCALE;
            setY = (setY + centerScale) / BASE_SCALE;
          }
          item.setPosition({
            x: setX,
            y: setY,
          });
        });
        break;

      default:
        break;
    }
  }
  // 根据鼠标位置偏移量
  function useGroupOffset(mouseX: number, mouseY: number, type: string) {
    const wrapper = group
      .getChildren((item) => item.attrs.name === "drag-wrapper")
      .pop();
    const beforeX = group.x();
    const beforeY = group.y();
    let offsetX = 0;
    let offsetY = 0;
    if (!wrapper) return;

    switch (type) {
      case "in":
        offsetX = (mouseX + Math.abs(beforeX)) * SCALE_STEP;
        offsetY = (mouseY + Math.abs(beforeY)) * SCALE_STEP;
        group.move({ x: -offsetX, y: -offsetY });
        break;

      case "out":
        offsetX = ((mouseX + Math.abs(beforeX)) * SCALE_STEP) / BASE_SCALE;
        offsetY = ((mouseY + Math.abs(beforeY)) * SCALE_STEP) / BASE_SCALE;
        group.move({ x: offsetX, y: offsetY });
        break;

      default:
        break;
    }
  }
  function zoomIn(mouseX: number, mouseY: number) {
    if (scale.value === MAX_SCALE) return;
    const newScale = Math.min(
      MAX_SCALE,
      (scale.value * DECIMAL_PLACE + SCALE_STEP * DECIMAL_PLACE) / DECIMAL_PLACE
    );
    scale.value = newScale;
    usePointPosition("in");
    useGroupOffset(mouseX, mouseY, "in");
    layer.batchDraw();
  }
  function zoomOut(mouseX: number, mouseY: number) {
    if (scale.value === MIN_SCALE) return;
    const newScale = Math.max(
      MIN_SCALE,
      (scale.value * DECIMAL_PLACE - SCALE_STEP * DECIMAL_PLACE) / DECIMAL_PLACE
    );

    scale.value = newScale;
    usePointPosition("out");
    useGroupOffset(mouseX, mouseY, "out");

    const { x, y } = group.position();
    group.setPosition(limitBrink(x, y));
    layer.batchDraw();
  }
  function resetZoom() {
    usePointPosition("reset");
    scale.value = 1;
    group.position({ x: 0, y: 0 });
    layer.batchDraw();
  }

  function zoom(e: { evt: WheelEvent }) {
    e.evt.preventDefault();
    // 鼠标位置
    const mouseX = e.evt.offsetX;
    const mouseY = e.evt.offsetY;

    // 根据滚轮方向调整缩放比例
    if (e.evt.deltaY > 0) {
      // 向下滚动，缩小图形
      zoomOut(mouseX, mouseY);
    } else {
      // 向上滚动，放大图形
      zoomIn(mouseX, mouseY);
    }
  }

  function createRect(data: RectConfig) {
    return new Konva.Rect({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      fill: "#00bf72",
      stroke: "#a8eb12",
      strokeWidth: 1,
      ...data,
    });
  }

  function createImage(data: ImageConfig) {
    return new Konva.Image({
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      ...data,
    });
  }

  async function initPoint(
    config: Point,
    props: MapGroup,
    callback?: (data: any) => void
  ) {
    let point;
    let currentX = 0;
    let currentY = 0;
    const { x, y, width, height } = config;
    const { size } = props;
    if (!size) throw Error("please initialize size");
    const renderScale = WIDTH.value / size.width;
    if (x) {
      currentX = x * renderScale - 10 / 2;
    }
    if (x && width) {
      currentX = x * renderScale - width / 2;
    }
    if (y) {
      currentY = y * renderScale - 10 / 2;
    }
    if (y && height) {
      currentY = y * renderScale - height / 2;
    }
    if (config.image) {
      let imageEl = config.image;
      if (typeof imageEl === "string") {
        imageEl = await loadImage(imageEl);
      }
      point = createImage({
        ...config,
        image: imageEl,
        x: currentX,
        y: currentY,
      });
    } else {
      point = createRect({
        ...config,
        x: currentX,
        y: currentY,
      });
    }

    point.on("click", () => {
      if (callback) {
        callback(config.data);
      }
    });
    return point;
  }

  async function initBackground(
    bgImg: string,
    size = { width: 1620, height: 762 }
  ): Promise<Konva.Image> {
    const imageObj = await loadImage(bgImg);
    const { width, height } = size;
    const imgScale = WIDTH.value / width;
    imgRenderHeight = height * imgScale;
    const res = new Konva.Image({
      name: "drag-wrapper",
      x: 0,
      y: 0,
      image: imageObj,
      width: width * imgScale,
      height: height * imgScale,
    });
    return res;
  }

  function initWrapper(size = { width: 1620, height: 762 }) {
    const { width, height } = size;
    const imgScale = WIDTH.value / width;
    imgRenderHeight = height * imgScale;
    const wrapper = new Konva.Rect({
      name: "drag-wrapper",
      x: 0,
      y: 0,
      width: width * imgScale,
      height: height * imgScale,
    });
    return wrapper;
  }

  async function initGroup(params: MapGroup) {
    const { background, size, pointList, callback } = params;
    group.on("wheel", (e) => zoom(e));

    if (background) {
      const image = await initBackground(background, size);
      group.add(image);
    } else {
      const wrapper = initWrapper(size);
      group.add(wrapper);
    }
    if (pointList) {
      for (let i = 0; i < pointList.length; i++) {
        const data = pointList[i];
        const point = await initPoint(data, params, callback);
        group.add(point);
      }
    }
  }

  function init(params: MapGroup) {
    WIDTH.value = params.ctx.width;
    HEIGHT = params.ctx.height;
    stage = new Konva.Stage({
      container: params.ctx.el,
      width: WIDTH.value,
      height: HEIGHT,
    });

    initGroup(params).then(() => {
      layer.add(group);
      layer.draw();
      stage.add(layer);
    });
  }

  function destroy() {
    stage?.destroy();
  }
  return {
    width: computed(() => unref(WIDTH)),
    init,
    destroy,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
