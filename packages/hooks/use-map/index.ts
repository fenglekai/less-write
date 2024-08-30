import { ref, computed, unref, nextTick, watch } from "vue";
import Konva from "konva";
import type { RectConfig } from "konva/lib/shapes/Rect";
import type { ImageConfig } from "konva/lib/shapes/Image";
import type { Shape, ShapeConfig } from "konva/lib/Shape";
import type { Context } from "konva/lib/Context";
import { loadImage } from "@less-write/utils";

export interface BezierConfig extends ShapeConfig {
  start: {
    x: number;
    y: number;
  };
  controlStart?: {
    x: number;
    y: number;
  };
  controlEnd?: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
}

export interface PointConfig extends ShapeConfig {
  image?: HTMLImageElement | string;
  data?: any;
}

export interface MapGroup {
  ctx: {
    el: string;
    width: number;
  };
  size: {
    width: number;
    height: number;
  };
  background?: string;
  pathData?: BezierConfig[];
  pointData?: PointConfig[];
  callback?: (data: any) => void;
}

type ZoomType = "in" | "out" | "reset";

const DRAG_WRAPPER = "drag-wrapper";
const PATH_NAME = "path";
const POINT_NAME = "point";
const DEFAULT_RECT_WIDTH = 10;

function createRect(data: RectConfig) {
  const defaultConfig = {
    width: DEFAULT_RECT_WIDTH,
    height: DEFAULT_RECT_WIDTH,
    fill: "white",
    cornerRadius: 1,
  };

  const rect = new Konva.Rect({
    x: 0,
    y: 0,
    ...defaultConfig,
    ...data,
  });
  return rect;
}

function createImage(data: ImageConfig) {
  const defaultConfig = {
    width: DEFAULT_RECT_WIDTH,
    height: DEFAULT_RECT_WIDTH,
    cornerRadius: 1,
  };
  const image = new Konva.Image({
    x: 0,
    y: 0,
    ...defaultConfig,
    ...data,
  });
  return image;
}

async function imageFormat(data: HTMLImageElement | string) {
  let formatData: HTMLImageElement;
  if (typeof data === "string") {
    formatData = await loadImage(data);
  } else if (data instanceof HTMLImageElement) {
    formatData = data;
  } else {
    throw "Unable to process image conversion.";
  }
  return formatData;
}

function useBezierScene(
  ctx: Context,
  shape: Shape<ShapeConfig>,
  bezier: BezierConfig
) {
  const { controlStart, controlEnd } = bezier;
  ctx.beginPath();
  ctx.moveTo(bezier.start.x, bezier.start.y);
  if (controlStart && controlEnd) {
    ctx.bezierCurveTo(
      controlStart.x,
      controlStart.y,
      controlEnd.x,
      controlEnd.y,
      bezier.end.x,
      bezier.end.y
    );
  } else {
    ctx.lineTo(bezier.end.x, bezier.end.y);
  }
  ctx.fillStrokeShape(shape);
}

function createBezierPath(bezier: BezierConfig) {
  const bezierLine = new Konva.Shape({
    name: PATH_NAME,
    stroke: "white",
    strokeWidth: 2,
    sceneFunc: (ctx, shape) => useBezierScene(ctx, shape, bezier),
    ...bezier,
  });
  return bezierLine;
}

export function useMap() {
  // 边缘限制选项
  const isLimit = ref(false);
  // 容器宽度
  const clientWidth = ref(0);
  // 容器高度
  const clientHeight = ref(0);
  // size与容器之间的缩放比例以宽度计算
  const renderScale = ref(0);

  // 显示倍率
  const scale = ref(1);

  // 最大缩放比例
  const MAX_SCALE = 10;
  // 最小缩放比例
  const MIN_SCALE = 1;
  // 每次缩放大小
  const SCALE_STEP = 0.2;
  // 基础缩放倍率
  const BASE_SCALE = 1 + SCALE_STEP;
  // 点与点间距差异化放大
  const SCALE_DIFF = BASE_SCALE - 0.1;
  // 计算小数位
  const DECIMAL_PLACE = 10 ** SCALE_STEP.toString().split(".")[1].length;
  // 放大统计
  const scaleCount = computed(() => {
    return (
      (scale.value * DECIMAL_PLACE - 1 * DECIMAL_PLACE) /
      (SCALE_STEP * DECIMAL_PLACE)
    );
  });

  watch(scale, (newScale, oldScale) => {
    // path
    const pathChildren = group.getChildren(
      (item) => item.attrs.name === PATH_NAME
    );
    pathChildren.forEach((path) => {
      const { attrs } = path;
      let position: BezierConfig = {
        start: {
          x: (attrs.start.x / oldScale) * newScale,
          y: (attrs.start.y / oldScale) * newScale,
        },
        end: {
          x: (attrs.end.x / oldScale) * newScale,
          y: (attrs.end.y / oldScale) * newScale,
        },
      };
      if (attrs.controlStart && attrs.controlEnd) {
        position = {
          ...position,
          controlStart: {
            x: (attrs.controlStart.x / oldScale) * newScale,
            y: (attrs.controlStart.y / oldScale) * newScale,
          },
          controlEnd: {
            x: (attrs.controlEnd.x / oldScale) * newScale,
            y: (attrs.controlEnd.y / oldScale) * newScale,
          },
        };
      }
      path.setAttrs({
        ...path.attrs,
        ...position,
        sceneFunc: (ctx: Context, shape: Shape<ShapeConfig>) =>
          useBezierScene(ctx, shape, position),
      });
    });

    // point
    const wrapper = group.findOne(
      (item: any) => item.attrs.name === DRAG_WRAPPER
    );
    const pointChildren = group.getChildren(
      (item) => item.attrs.name === POINT_NAME
    );
    if (wrapper) {
      wrapper.scale({
        x: (wrapper.scaleX() / oldScale) * newScale,
        y: (wrapper.scaleY() / oldScale) * newScale,
      });
    }
    pointChildren.forEach((item) => {
      item.scale({
        x: (item.scaleX() / oldScale) * newScale,
        y: (item.scaleY() / oldScale) * newScale,
      });

      item.setPosition({
        x: (item.x() / oldScale) * newScale,
        y: (item.y() / oldScale) * newScale,
      });
    });
  });

  function setScale(value: number) {
    scale.value = value;
  }

  const pointMap = new Map<number, Konva.Image | Konva.Rect>();
  let stage: Konva.Stage;
  const layer = new Konva.Layer();
  const group = new Konva.Group({
    draggable: true,
    dragBoundFunc(pos) {
      const { x, y } = pos;
      return limitBrink(x, y);
    },
  });

  function setLimit(bool: boolean) {
    isLimit.value = bool;
  }

  // 限制边缘
  function limitBrink(limitX: number, limitY: number) {
    if (!isLimit.value) {
      return { x: limitX, y: limitY };
    }
    if (limitX > 0) {
      limitX = 0;
    }

    if (limitY > 0) {
      limitY = 0;
    }

    // // 计算底图与底图高度差距
    const bottomLimit =
      clientHeight.value - clientHeight.value * BASE_SCALE ** scaleCount.value;
    if (limitY < bottomLimit) {
      // 当底图实际宽度小于地图宽度设为0
      limitY = bottomLimit > 0 ? 0 : bottomLimit;
    }
    const rightLimit =
      clientWidth.value - clientWidth.value * BASE_SCALE ** scaleCount.value;
    if (limitX < rightLimit) {
      limitX = rightLimit > 0 ? 0 : rightLimit;
    }

    return { x: limitX, y: limitY };
  }
  // 设置动态点位
  async function setPoint(points: PointConfig[]) {
    for (const [key, targetPoint] of Object.entries(points)) {
      if (pointMap.has(Number(key))) {
        const sourcePoint = pointMap.get(Number(key));
        if (!sourcePoint) return;

        let x = targetPoint.x
          ? targetPoint.x * renderScale.value
          : sourcePoint.x();
        let y = targetPoint.y
          ? targetPoint.y * renderScale.value
          : sourcePoint.y();
        x = x * BASE_SCALE ** scaleCount.value;
        y = y * BASE_SCALE ** scaleCount.value;
        if (targetPoint.image) {
          const imageEl = await imageFormat(targetPoint.image);
          targetPoint.image = imageEl;
        }

        sourcePoint.setAttrs({
          ...targetPoint,
          x: x,
          y: y,
        });
      }
    }
  }

  // 根据鼠标位置Group偏移量
  function useGroupPosition(
    type: ZoomType,
    mouseX: number = 0,
    mouseY: number = 0
  ) {
    const gX = group.x();
    const gY = group.y();
    let offsetX = 0;
    let offsetY = 0;
    const baseScale = scale.value - 1;
    let mouseXBefore = 0;
    let mouseYBefore = 0;
    let mouseXDiff = 0;
    let mouseYDiff = 0;
    if (gX < 0) {
      mouseXBefore = Math.abs(gX) / (baseScale - SCALE_STEP);
    }
    if (gY < 0) {
      mouseYBefore = Math.abs(gY) / (baseScale - SCALE_STEP);
    }
    if (mouseXBefore !== 0) {
      mouseXDiff = mouseX - mouseXBefore;
    }
    if (mouseYBefore !== 0) {
      mouseYDiff = mouseY - mouseYBefore;
    }
    console.log("mouseXBefore", mouseXBefore);
    console.log("mouseX", mouseX);
    console.log("mouseXDiff", mouseXDiff);

    switch (type) {
      case "in":
        // offsetX = mouseX * SCALE_STEP + Math.abs(gX);
        // offsetY = mouseY * SCALE_STEP + Math.abs(gY);
        offsetX = mouseX * baseScale;
        offsetY = mouseY * baseScale;
        group.position({ x: -offsetX, y: -offsetY });
        break;

      case "out":
        // offsetX = Math.abs(gX) - mouseX * SCALE_STEP;
        // offsetY = Math.abs(gY) - mouseY * SCALE_STEP;
        offsetX = mouseX * baseScale;
        offsetY = mouseY * baseScale;
        group.position({ x: -offsetX, y: -offsetY });
        break;

      case "reset":
        group.position({ x: 0, y: 0 });
        break;

      default:
        break;
    }
  }

  function zoomIn(
    mouseX: number = clientWidth.value / 2,
    mouseY: number = clientHeight.value / 2
  ) {
    if (scale.value === MAX_SCALE) return;
    const newScale = Math.min(
      MAX_SCALE,
      (scale.value * DECIMAL_PLACE + SCALE_STEP * DECIMAL_PLACE) / DECIMAL_PLACE
    );
    scale.value = newScale;

    useGroupPosition("in", mouseX, mouseY);
    layer.batchDraw();
  }
  function zoomOut(
    mouseX: number = clientWidth.value / 2,
    mouseY: number = clientHeight.value / 2
  ) {
    if (scale.value === MIN_SCALE) return;
    const newScale = Math.max(
      MIN_SCALE,
      (scale.value * DECIMAL_PLACE - SCALE_STEP * DECIMAL_PLACE) / DECIMAL_PLACE
    );

    scale.value = newScale;
    useGroupPosition("out", mouseX, mouseY);

    const { x, y } = group.position();
    group.setPosition(limitBrink(x, y));
    layer.batchDraw();
  }
  function resetZoom() {
    scale.value = 1;
    useGroupPosition("reset");
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

  function initPath(config: BezierConfig) {
    const { start, controlStart, controlEnd, end } = config;
    let realConfig = {
      ...config,
      start: {
        x: start.x * renderScale.value,
        y: start.y * renderScale.value,
      },
      end: {
        x: end.x * renderScale.value,
        y: end.y * renderScale.value,
      },
    };
    if (controlStart && controlEnd) {
      realConfig = {
        ...realConfig,
        controlStart: {
          x: controlStart.x * renderScale.value,
          y: controlStart.y * renderScale.value,
        },
        controlEnd: {
          x: controlEnd.x * renderScale.value,
          y: controlEnd.y * renderScale.value,
        },
      };
    }

    const bezierPath = createBezierPath(realConfig);
    return bezierPath;
  }

  async function initPoint(
    config: PointConfig,
    callback?: (data: any) => void
  ) {
    let point;
    let currentX = 0;
    let currentY = 0;
    const { x, y } = config;
    if (x) {
      currentX = x * renderScale.value;
    }

    if (y) {
      currentY = y * renderScale.value;
    }

    if (config.image) {
      const imageEl = await imageFormat(config.image);
      point = createImage({
        name: POINT_NAME,
        ...config,
        image: imageEl,
        x: currentX,
        y: currentY,
      });
    } else {
      point = createRect({
        name: POINT_NAME,
        ...config,
        x: currentX,
        y: currentY,
      });
    }
    point.offsetX(point.width() / 2);
    point.offsetY(point.height() / 2);

    point.on("click", () => {
      if (callback) {
        callback(config.data);
      }
    });
    return point;
  }

  async function initBackground(
    size: { width: number; height: number },
    bgImg?: string
  ): Promise<Konva.Image | Konva.Rect> {
    const { width, height } = size;
    const imgScale = clientWidth.value / width;
    let background: Konva.Image | Konva.Rect;
    if (bgImg) {
      const imageObj = await loadImage(bgImg);
      background = new Konva.Image({
        name: DRAG_WRAPPER,
        x: 0,
        y: 0,
        image: imageObj,
        width: width * imgScale,
        height: height * imgScale,
      });
    } else {
      background = new Konva.Rect({
        name: DRAG_WRAPPER,
        x: 0,
        y: 0,
        width: width * imgScale,
        height: height * imgScale,
      });
    }
    return background;
  }

  async function initGroup(params: MapGroup) {
    const { background, size, pathData, pointData, callback } = params;
    group.on("wheel", (e) => zoom(e));

    const wrapper = await initBackground(size, background);
    group.add(wrapper);

    // path
    if (pathData) {
      for (let i = 0; i < pathData.length; i++) {
        const config = pathData[i];
        const bezierLine = initPath(config);
        group.add(bezierLine);
      }
    }

    // point
    if (pointData) {
      for (let i = 0; i < pointData.length; i++) {
        const config = pointData[i];
        const point = await initPoint(config, callback);
        group.add(point);
        pointMap.set(i, point);
      }
    }
  }

  async function init(params: MapGroup, initCallback?: () => void) {
    await nextTick();
    clientWidth.value = params.ctx.width;
    clientHeight.value = clientHeight.value =
      params.size.height * (clientWidth.value / params.size.width);
    renderScale.value = clientWidth.value / params.size.width;
    stage = new Konva.Stage({
      container: params.ctx.el,
      width: clientWidth.value,
      height: clientHeight.value,
    });

    await initGroup(params);
    layer.add(group);
    stage.add(layer);
    group.draw();
    layer.draw();
    stage.draw();
    if (initCallback) {
      initCallback();
    }
  }

  function destroy() {
    group.removeEventListener("wheel");
    group.destroy();
    layer.destroy();
    stage?.destroy();
  }

  return {
    width: computed(() => unref(clientWidth)),
    scale: computed(() => unref(scale)),
    init,
    destroy,
    zoomIn,
    zoomOut,
    resetZoom,
    setPoint,
    setLimit,
    setScale,
  };
}
