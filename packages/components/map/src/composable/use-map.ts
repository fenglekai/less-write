import {
  ref,
  computed,
  unref,
  nextTick,
  watch,
  toRaw,
  reactive,
  SetupContext,
} from "vue";
import Konva from "konva";
import type { RectConfig } from "konva/lib/shapes/Rect";
import type { ImageConfig } from "konva/lib/shapes/Image";
import type { Shape, ShapeConfig } from "konva/lib/Shape";
import type { Context } from "konva/lib/Context";
import { loadImage } from "@less-write/utils";
import Big from "big.js";
import type { BezierConfig, MapEmits, MapProps, PointConfig } from "../map";
import { useTransform } from "./use-transform";

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
  grid?: boolean;
  pathData?: BezierConfig[];
  pointData?: PointConfig[];
}

const DRAG_WRAPPER = "drag-wrapper";
const PATH_NAME = "path";
const POINT_NAME = "point";
const DEFAULT_RECT_WIDTH = 10;
const DEFAULT_COLOR = "#000000";

function createRect(data: RectConfig) {
  const defaultConfig = {
    width: DEFAULT_RECT_WIDTH,
    height: DEFAULT_RECT_WIDTH,
    fill: DEFAULT_COLOR,
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
    stroke: DEFAULT_COLOR,
    strokeWidth: 2,
    sceneFunc: (ctx, shape) => useBezierScene(ctx, shape, bezier),
    ...bezier,
  });
  return bezierLine;
}

const isHTMLImage = (val: any) => val instanceof HTMLImageElement;

export function useMap(props: MapProps, emits: SetupContext<MapEmits>["emit"]) {
  const {
    scale,
    min,
    step,
    baseScale,
    translate,
    zoom: transformZoom,
    resetZoom: transformResetZoom,
    updateTranslate,
    updateTranslateLimit,
  } = useTransform(props);

  const pointMap = new Map<number, Konva.Image | Konva.Rect>();
  let stage: Konva.Stage;
  const layer = new Konva.Layer({
    name: "map-layer",
  });
  const group = new Konva.Group({
    name: "map-group",
  });

  // 容器宽度
  const clientWidth = ref(0);
  // 容器高度
  const clientHeight = ref(0);
  // size与容器之间的缩放比例以宽度计算
  const renderScale = ref(0);
  // 计算间距缩放
  const spaceScale = computed(() => {
    if (props.space) {
      const scaleCount = new Big(scale.value)
        .minus(min.value)
        .div(step.value)
        .abs()
        .toNumber();
      return baseScale.value ** scaleCount;
    }
    return scale.value;
  });
  // 拖拽动作
  const dragging = ref(false);
  const mosStart = reactive({
    x: 0,
    y: 0,
  });
  // 点位内容，click事件触发
  const pointData = ref<PointConfig>();

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

    if (wrapper) {
      wrapper.scale({
        x: zoomComputed(wrapper.scaleX()),
        y: zoomComputed(wrapper.scaleY()),
      });
    }

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

  // 设置缩放比例(滚动滑块)
  async function setScale(newScale: number) {
    transformZoom(newScale, {
      x: clientWidth.value / 2,
      y: clientHeight.value / 2,
    });
    console.log(newScale);

    group.setPosition(limitBrink(translate.value.x, translate.value.y));
    layer.batchDraw();
  }

  // 限制边缘
  function limitBrink(limitX: number, limitY: number) {
    if (!props.limit) {
      return { x: limitX, y: limitY };
    }
    if (limitX > 0) {
      limitX = 0;
      updateTranslate(-translate.value.x, 0);
    }

    if (limitY > 0) {
      limitY = 0;
      updateTranslate(0, -translate.value.y);
    }

    // 计算底图与底图高度差距
    const rightLimit = clientWidth.value - clientWidth.value * spaceScale.value;
    if (limitX < rightLimit) {
      limitX = rightLimit > 0 ? 0 : rightLimit;
      updateTranslate(-translate.value.x + limitX, 0);
    }
    const bottomLimit =
      clientHeight.value - clientHeight.value * spaceScale.value;
    if (limitY < bottomLimit) {
      // 当底图实际宽度小于地图宽度设为0
      limitY = bottomLimit > 0 ? 0 : bottomLimit;
      updateTranslate(0, -translate.value.y + limitY);
    }
    updateTranslateLimit([0, rightLimit, bottomLimit, 0]);
    return { x: limitX, y: limitY };
  }

  // 设置动态点位
  async function setPoint(points: PointConfig[]) {
    await nextTick();
    for (const [key, targetPoint] of Object.entries(points)) {
      // 匹配对应点位
      if (pointMap.has(Number(key))) {
        const sourcePoint = pointMap.get(Number(key));
        if (!sourcePoint) return;
        let x = targetPoint.x
          ? targetPoint.x * renderScale.value
          : sourcePoint.x();
        let y = targetPoint.y
          ? targetPoint.y * renderScale.value
          : sourcePoint.y();
        x = x * spaceScale.value;
        y = y * spaceScale.value;
        if (isHTMLImage(targetPoint.image)) {
          const imageEl = targetPoint.image;
          targetPoint.image = imageEl;
        }

        sourcePoint.off("click");
        sourcePoint.on("click", () => {
          const parse = toRaw({
            ...targetPoint,
            x: x,
            y: y,
          });
          pointData.value = parse;
          emits("pointClick", parse);
        });
        sourcePoint.setAttrs({
          ...targetPoint,
          x: x,
          y: y,
        });
      } else {
        // 添加未匹配到的点位
        if (targetPoint.x && targetPoint.y) {
          const point = initPoint({
            ...targetPoint,
            x: targetPoint.x * spaceScale.value,
            y: targetPoint.y * spaceScale.value,
            scaleX: scale.value,
            scaleY: scale.value,
          });
          group.add(point);
          pointMap.set(Number(key), point);
        }
      }
    }
  }

  // 放大(外部调用)
  function zoomIn(
    mouseX: number = clientWidth.value / 2,
    mouseY: number = clientHeight.value / 2
  ) {
    transformZoom(false, { x: mouseX, y: mouseY });
    group.setPosition(limitBrink(translate.value.x, translate.value.y));
    layer.batchDraw();
  }

  // 缩小(外部调用)
  function zoomOut(
    mouseX: number = clientWidth.value / 2,
    mouseY: number = clientHeight.value / 2
  ) {
    if (scale.value === min.value) return;
    transformZoom(true, { x: mouseX, y: mouseY });
    group.setPosition(limitBrink(translate.value.x, translate.value.y));
    layer.batchDraw();
  }

  // 重置缩放(外部调用)
  function resetZoom() {
    transformResetZoom();
    group.position({ x: 0, y: 0 });
    layer.batchDraw();
  }

  // 滚轮事件
  function onWheel(e: { evt: WheelEvent }) {
    e.evt.preventDefault();
    const { deltaY, offsetX, offsetY } = e.evt;
    transformZoom(deltaY > 0, { x: offsetX, y: offsetY });
    group.setPosition(limitBrink(translate.value.x, translate.value.y));
  }

  // 拖拽鼠标移动事件
  function onMousemove(e: { evt: MouseEvent }) {
    const { offsetX, offsetY } = e.evt;
    e.evt.preventDefault();
    if (dragging.value) {
      const moveDelta = {
        x: offsetX - mosStart.x,
        y: offsetY - mosStart.y,
      };
      mosStart.x = offsetX;
      mosStart.y = offsetY;
      updateTranslate(moveDelta.x, moveDelta.y);
      group.setPosition(limitBrink(translate.value.x, translate.value.y));
    }
  }

  // 拖拽鼠标点击
  function onMousedown(e: { evt: MouseEvent }) {
    e.evt.preventDefault();
    const { offsetX, offsetY } = e.evt;
    dragging.value = true;
    mosStart.x = offsetX;
    mosStart.y = offsetY;
    stage.on("mousemove", onMousemove);
  }
  // 移除鼠标拖拽事件
  function removeDraggle(e: { evt: MouseEvent }) {
    e.evt.preventDefault();
    dragging.value = false;
    stage.off("mousemove");
  }

  // 初始化网格线组
  function initGrid() {
    const gridLayer = new Konva.Layer({
      name: "grid-layer",
    });
    const lineGroup = new Konva.Group({
      name: "grid-group",
    });
    const gutter = 10;

    const genLine = (maxLen: { x: number; y: number }, column = false) => {
      let i = 0;
      while (
        i * gutter + gutter <= maxLen.x &&
        (i * gutter + gutter <= maxLen.y || column)
      ) {
        i++;
        const point = i * gutter;
        if (column) {
          const verticalLine = new Konva.Line({
            stroke: "#f0f0f0",
            strokeWidth: point % 100 !== 0 ? 1 : 2,
            points: [point, 0, point, maxLen.y],
          });
          lineGroup.add(verticalLine);
        } else {
          const horizontalLine = new Konva.Line({
            stroke: "#f0f0f0",
            strokeWidth: point % 100 !== 0 ? 1 : 2,
            points: [0, point, maxLen.x, point],
          });
          lineGroup.add(horizontalLine);
        }
      }
    };
    genLine({ x: clientWidth.value, y: clientHeight.value });
    genLine({ x: clientWidth.value, y: clientHeight.value }, true);
    gridLayer.add(lineGroup);
    stage.add(gridLayer);
  }

  // 初始化路径
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

  // 初始化点位
  function initPoint(config: PointConfig) {
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

    if (isHTMLImage(config.image)) {
      const imageEl = config.image;
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
      if (config.image) {
        console.warn("image is not HTMLImageElement");
      }
    }
    point.offsetX(point.width() / 2);
    point.offsetY(point.height() / 2);

    point.on("click", () => {
      const parse = toRaw(config);
      pointData.value = parse;
      emits("pointClick", parse);
    });
    return point;
  }

  // 初始化背景
  async function initBackground(
    size: { width: number; height: number },
    background: string
  ): Promise<Konva.Image | Konva.Rect | Konva.Group> {
    const { width, height } = size;
    const imgScale = clientWidth.value / width;
    let backgroundImage: Konva.Image;
    const imageObj = await loadImage(background);
    backgroundImage = new Konva.Image({
      name: DRAG_WRAPPER,
      x: 0,
      y: 0,
      image: imageObj,
      width: width * imgScale,
      height: height * imgScale,
    });
    return backgroundImage;
  }

  // 初始化整体组
  async function initMap(params: MapGroup) {
    const { pointData, pathData, background, size } = params;

    // background
    if (background) {
      const wrapper = await initBackground(size, background);
      group.add(wrapper);
    }

    // grid
    if (props.grid) {
      initGrid();
    }

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
      setPoint(pointData);
    }

    layer.add(group);
    stage.add(layer);
    group.draw();
    layer.draw();
  }

  // 初始化地图(外部调用)
  async function init(params: MapGroup, initCallback?: () => void) {
    await nextTick();
    clientWidth.value = params.ctx.width;
    clientHeight.value = clientHeight.value =
      params.size.height * (clientWidth.value / params.size.width);
    renderScale.value = clientWidth.value / params.size.width;
    stage = new Konva.Stage({
      name: "map-stage",
      container: params.ctx.el,
      width: clientWidth.value,
      height: clientHeight.value,
    });
    await initMap(params);
    stage.on("wheel", onWheel);
    stage.on("mousedown", onMousedown);
    stage.on("mouseup", removeDraggle);
    stage.on("mouseleave", removeDraggle);
    stage.draw();
    if (initCallback) {
      initCallback();
    }
  }

  // 销毁地图(外部调用)
  function destroy() {
    stage?.off("wheel");
    stage?.off("mousedown");
    stage?.off("mouseup");
    stage?.off("mouseleave");
    pointMap.clear();
    group.destroy();
    layer.destroy();
    stage?.destroy();
  }

  return {
    width: computed(() => unref(clientWidth)),
    scale: computed(() => unref(scale)),
    pointData: computed(() => unref(pointData)),
    init,
    destroy,
    zoomIn,
    zoomOut,
    resetZoom,
    setScale,
  };
}
