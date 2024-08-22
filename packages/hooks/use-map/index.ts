import { ref, computed, unref, nextTick } from "vue";
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
const DEFAULT_RECT_WIDTH = 10

function createRect(data: RectConfig) {
  const defaultConfig = {
    width: 10,
    height: 10,
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
    width: 10,
    height: 10,
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
  // 容器宽度
  const clientWidth = ref(0);
  // 容器高度
  const clientHeight = ref(0);

  // 显示倍率
  const scale = ref(1);
  // 最大缩放比例
  const MAX_SCALE = 9;
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

  function usePathPosition(type: ZoomType) {
    const children = group.getChildren((item) => item.attrs.name === PATH_NAME);
    switch (type) {
      case "in":
        children.forEach((path) => {
          const { attrs } = path;
          let position: BezierConfig = {
            start: {
              x: attrs.start.x * BASE_SCALE,
              y: attrs.start.y * BASE_SCALE,
            },
            end: {
              x: attrs.end.x * BASE_SCALE,
              y: attrs.end.y * BASE_SCALE,
            },
          };
          if (attrs.controlStart && attrs.controlEnd) {
            position = {
              ...position,
              controlStart: {
                x: attrs.controlStart.x * BASE_SCALE,
                y: attrs.controlStart.y * BASE_SCALE,
              },
              controlEnd: {
                x: attrs.controlEnd.x * BASE_SCALE,
                y: attrs.controlEnd.y * BASE_SCALE,
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
        break;

      case "out":
        children.forEach((path) => {
          const { attrs } = path;
          let position: BezierConfig = {
            start: {
              x: attrs.start.x / BASE_SCALE,
              y: attrs.start.y / BASE_SCALE,
            },
            end: {
              x: attrs.end.x / BASE_SCALE,
              y: attrs.end.y / BASE_SCALE,
            },
          };
          if (attrs.controlStart && attrs.controlEnd) {
            position = {
              ...position,
              controlStart: {
                x: attrs.controlStart.x / BASE_SCALE,
                y: attrs.controlStart.y / BASE_SCALE,
              },
              controlEnd: {
                x: attrs.controlEnd.x / BASE_SCALE,
                y: attrs.controlEnd.y / BASE_SCALE,
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
        break;

      case "reset":
        children.forEach((path) => {
          const { attrs } = path;
          let position: BezierConfig = {
            start: {
              x: attrs.start.x / BASE_SCALE ** scaleCount.value,
              y: attrs.start.y / BASE_SCALE ** scaleCount.value,
            },
            end: {
              x: attrs.end.x / BASE_SCALE ** scaleCount.value,
              y: attrs.end.y / BASE_SCALE ** scaleCount.value,
            },
          };
          if (attrs.controlStart && attrs.controlEnd) {
            position = {
              ...position,
              controlStart: {
                x: attrs.controlStart.x / BASE_SCALE ** scaleCount.value,
                y: attrs.controlStart.y / BASE_SCALE ** scaleCount.value,
              },
              controlEnd: {
                x: attrs.controlEnd.x / BASE_SCALE ** scaleCount.value,
                y: attrs.controlEnd.y / BASE_SCALE ** scaleCount.value,
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
        break;

      default:
        break;
    }
  }

  // 放大时改变点位之间的间距
  function usePointPosition(type: ZoomType) {
    const wrapper = group.findOne(
      (item: any) => item.attrs.name === DRAG_WRAPPER
    );

    const children = group.getChildren(
      (item) => item.attrs.name === POINT_NAME
    );

    if (!wrapper) return;

    switch (type) {
      case "in":
        wrapper.scale({
          x: wrapper.scaleX() * BASE_SCALE,
          y: wrapper.scaleY() * BASE_SCALE,
        });
        children.forEach((item) => {
          item.scale({
            x: item.scaleX() * SCALE_DIFF,
            y: item.scaleY() * SCALE_DIFF,
          });

          const centerScale =
            (item.width() * item.scaleX() -
              (item.width() * item.scaleX()) / SCALE_DIFF) /
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
            x: item.scaleX() / SCALE_DIFF,
            y: item.scaleY() / SCALE_DIFF,
          });

          const centerScale =
            (item.width() * item.scaleX() -
              item.width() * item.scaleX() * SCALE_DIFF) /
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
              (item.width() * SCALE_DIFF ** (i - 1) -
                item.width() * SCALE_DIFF ** i) /
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
  function useGroupPosition(
    type: ZoomType,
    mouseX: number = 0,
    mouseY: number = 0
  ) {
    const wrapper = group
      .getChildren((item) => item.attrs.name === DRAG_WRAPPER)
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

      case "reset":
        group.position({ x: 0, y: 0 });

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
    usePathPosition("in");
    usePointPosition("in");
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
    usePathPosition("out");
    usePointPosition("out");
    useGroupPosition("out", mouseX, mouseY);

    const { x, y } = group.position();
    group.setPosition(limitBrink(x, y));
    layer.batchDraw();
  }
  function resetZoom() {
    usePathPosition("reset");
    usePointPosition("reset");
    useGroupPosition("reset");
    scale.value = 1;
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

  function initPath(config: BezierConfig, props: MapGroup) {
    const { start, controlStart, controlEnd, end } = config;
    const renderScale = clientWidth.value / props.size.width;
    let realConfig = {
      ...config,
      start: {
        x: start.x * renderScale,
        y: start.y * renderScale,
      },
      end: {
        x: end.x * renderScale,
        y: end.y * renderScale,
      },
    };
    if (controlStart && controlEnd) {
      realConfig = {
        ...realConfig,
        controlStart: {
          x: controlStart.x * renderScale,
          y: controlStart.y * renderScale,
        },
        controlEnd: {
          x: controlEnd.x * renderScale,
          y: controlEnd.y * renderScale,
        },
      };
    }

    const bezierPath = createBezierPath(realConfig);
    return bezierPath;
  }

  async function initPoint(
    config: PointConfig,
    props: MapGroup,
    callback?: (data: any) => void
  ) {
    let point;
    let currentX = 0;
    let currentY = 0;
    const { x, y, width, height } = config;
    const renderScale = clientWidth.value / props.size.width;
    if (x) {
      currentX = x * renderScale - DEFAULT_RECT_WIDTH / 2;
    }
    if (x && width) {
      currentX = x * renderScale - width / 2;
    }
    if (y) {
      currentY = y * renderScale - DEFAULT_RECT_WIDTH / 2;
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
        const bezierLine = initPath(config, params);
        group.add(bezierLine);
      }
    }

    // point
    if (pointData) {
      for (let i = 0; i < pointData.length; i++) {
        const config = pointData[i];
        const point = await initPoint(config, params, callback);
        group.add(point);
      }
    }
  }

  async function init(params: MapGroup, initCallback?: () => void) {
    await nextTick();
    clientWidth.value = params.ctx.width;
    clientHeight.value = clientHeight.value =
      params.size.height * (clientWidth.value / params.size.width);
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
  };
}
