import { ref, computed, unref, nextTick, watch, reactive } from "vue";
import Konva from "konva";
import type { RectConfig } from "konva/lib/shapes/Rect";
import type { ImageConfig } from "konva/lib/shapes/Image";
import type { Shape, ShapeConfig } from "konva/lib/Shape";
import type { Context } from "konva/lib/Context";
import { loadImage } from "@less-write/utils";
import Big from "big.js";
import { isNumber } from "lodash";
import type { BezierConfig, MapProps, PointConfig } from "../map";

export interface MapGroup {
  ctx: {
    el: string | HTMLDivElement;
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

function parseProps(val: any, def: number): number {
  const parse = Number(val);

  if (isNumber(parse)) {
    return parse;
  } else {
    return def;
  }
}

export function useMap(props: MapProps) {
  // 容器宽度
  const clientWidth = ref(0);
  // 容器高度
  const clientHeight = ref(0);
  // size与容器之间的缩放比例以宽度计算
  const renderScale = ref(0);

  // 显示倍率
  const scale = ref(parseProps(props.min, 1));

  // 最大缩放比例
  const max = computed(() => parseProps(props.max, 10));
  // 最小缩放比例
  const min = computed(() => parseProps(props.min, 1));
  // 每次缩放大小
  const step = computed(() => parseProps(props.step, 1));
  // 基础缩放倍率
  const baseScale = computed(() =>
    new Big(step.value).plus(min.value).toNumber()
  );
  // 放大统计
  const scaleCount = computed(() => {
    const big = new Big(scale.value).minus(min.value).div(step.value);
    return big.toNumber();
  });

  watch(
    () => props.pointData,
    (newVal) => {
      setPoint(newVal);
    }
  );

  // 监听缩放变换
  watch(scale, (newScale, oldScale) => {
    const isZoomIn = newScale > oldScale;
    const wrapper = group.findOne(
      (item: any) => item.attrs.name === DRAG_WRAPPER
    );
    // path
    const pathChildren = group.getChildren(
      (item) => item.attrs.name === PATH_NAME
    );

    // point
    const pointChildren = group.getChildren(
      (item) => item.attrs.name === POINT_NAME
    );
    if (!wrapper) return;

    const scaleCount = new Big(newScale)
      .minus(oldScale)
      .div(step.value)
      .abs()
      .toNumber();
    const zoomComputed = (base: number) => {
      if (props.space) {
        if (isZoomIn) {
          return base * baseScale.value ** scaleCount;
        } else {
          return base / baseScale.value ** scaleCount;
        }
      } else {
        return (base / oldScale) * newScale;
      }
    };

    wrapper.scale({
      x: zoomComputed(wrapper.scaleX()),
      y: zoomComputed(wrapper.scaleY()),
    });
    pointChildren.forEach((point) => {
      point.scale({
        x: newScale,
        y: newScale,
      });

      point.setPosition({
        x: zoomComputed(point.x()),
        y: zoomComputed(point.y()),
      });
    });
    pathChildren.forEach((path) => {
      const { attrs } = path;
      let position: BezierConfig = {
        start: {
          x: zoomComputed(attrs.start.x),
          y: zoomComputed(attrs.start.y),
        },
        end: {
          x: zoomComputed(attrs.end.x),
          y: zoomComputed(attrs.end.y),
        },
      };
      if (attrs.controlStart && attrs.controlEnd) {
        position = {
          ...position,
          controlStart: {
            x: zoomComputed(attrs.controlStart.x),
            y: zoomComputed(attrs.controlStart.y),
          },
          controlEnd: {
            x: zoomComputed(attrs.controlEnd.x),
            y: zoomComputed(attrs.controlEnd.y),
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
  });

  function setScale(newScale: number) {
    if (newScale > scale.value) {
      useGroupPosition(clientWidth.value / 2, clientHeight.value / 2, newScale);
    } else {
      useGroupPosition(clientWidth.value / 2, clientHeight.value / 2, newScale);
    }
    scale.value = newScale;
    const { x, y } = group.position();
    group.setPosition(limitBrink(x, y));
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

  // 限制边缘
  function limitBrink(limitX: number, limitY: number) {
    if (!props.limit) {
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
      clientHeight.value -
      clientHeight.value * baseScale.value ** scaleCount.value;
    if (limitY < bottomLimit) {
      // 当底图实际宽度小于地图宽度设为0
      limitY = bottomLimit > 0 ? 0 : bottomLimit;
    }
    const rightLimit =
      clientWidth.value -
      clientWidth.value * baseScale.value ** scaleCount.value;
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
        x = x * baseScale.value ** scaleCount.value;
        y = y * baseScale.value ** scaleCount.value;
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
    mouseX: number = 0,
    mouseY: number = 0,
    newScale: number
  ) {
    if (props.space) {
      const scaleCount = new Big(newScale)
        .minus(scale.value)
        .div(step.value)
        .abs()
        .toNumber();
      for (let i = 0; i < scaleCount; i++) {
        const gX = group.x();
        const gY = group.y();
        const mosMove = {
          x: 0,
          y: 0,
        };
        if (newScale > scale.value) {
          mosMove.x = -(mouseX + Math.abs(gX)) * step.value;
          mosMove.y = -(mouseY + Math.abs(gY)) * step.value;
          group.move(mosMove);
        } else {
          mosMove.x = ((mouseX + Math.abs(gX)) * step.value) / baseScale.value;
          mosMove.y = ((mouseY + Math.abs(gY)) * step.value) / baseScale.value;
          group.move(mosMove);
        }
      }
    } else {
      const gX = group.x();
      const gY = group.y();
      const scaleDiff = newScale - scale.value;
      const mosOnCanvas = {
        x: mouseX + Math.abs(gX),
        y: mouseY + Math.abs(gY),
      };
      const mosMove = {
        x: (-mosOnCanvas.x / scale.value) * scaleDiff,
        y: (-mosOnCanvas.y / scale.value) * scaleDiff,
      };

      group.move(mosMove);
    }
  }

  function zoomIn(
    mouseX: number = clientWidth.value / 2,
    mouseY: number = clientHeight.value / 2
  ) {
    if (scale.value === max.value) return;
    const newScale = Math.min(
      max.value,
      new Big(scale.value).plus(step.value).toNumber()
    );
    useGroupPosition(mouseX, mouseY, newScale);
    scale.value = newScale;
    const { x, y } = group.position();
    group.setPosition(limitBrink(x, y));
    layer.batchDraw();
  }
  function zoomOut(
    mouseX: number = clientWidth.value / 2,
    mouseY: number = clientHeight.value / 2
  ) {
    if (scale.value === min.value) return;
    const newScale = Math.max(
      min.value,
      new Big(scale.value).minus(step.value).toNumber()
    );
    useGroupPosition(mouseX, mouseY, newScale);
    scale.value = newScale;
    const { x, y } = group.position();
    group.setPosition(limitBrink(x, y));
    layer.batchDraw();
  }
  function resetZoom() {
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
    group.on("wheel", zoom);

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
    group.off("wheel");
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
    setScale,
  };
}
