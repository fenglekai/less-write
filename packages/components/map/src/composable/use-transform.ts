import { computed, reactive, ref, unref } from "vue";
import { isNumber } from "lodash-es";
import Big from "big.js";
import { MapProps, mapProps } from "../map";

function parseProps(val: any, def: number): number {
  const parse = Number(val);

  if (isNumber(parse)) {
    return parse;
  } else {
    return def;
  }
}
export function useTransform(props: MapProps) {
  // 显示倍率
  const scale = ref(parseProps(props.min, mapProps.scale.default));
  // 最大缩放比例
  const max = computed(() => parseProps(props.max, mapProps.max.default));
  // 最小缩放比例
  const min = computed(() => parseProps(props.min, mapProps.min.default));
  // 每次缩放大小
  const step = computed(() => parseProps(props.step, mapProps.step.default));
  // 基础缩放倍率
  const baseScale = computed(() =>
    new Big(step.value).plus(min.value).toNumber()
  );
  // 平移距离
  const translate = reactive({
    x: 0,
    y: 0,
  });
  // 平移限制
  const translateLimit = reactive({
    top: Infinity,
    right: -Infinity,
    bottom: -Infinity,
    left: Infinity,
  });

  function zoom(zoomSize: number | boolean, mos: { x: number; y: number }) {
    let newScale = scale.value;
    // 根据Boolean设置缩放比例
    if (typeof zoomSize == "boolean") {
      if (zoomSize) {
        // 向下滚动，缩小图形
        if (scale.value === min.value) return;
        newScale = Math.max(
          min.value,
          new Big(scale.value).minus(step.value).toNumber()
        );
      } else {
        // 向上滚动，放大图形
        if (scale.value === max.value) return;
        newScale = Math.min(
          max.value,
          new Big(scale.value).plus(step.value).toNumber()
        );
      }
    }
    // 根据Number设置缩放比例
    if (typeof zoomSize == "number") {
      if (zoomSize >= min.value && zoomSize <= max.value) {
        newScale = zoomSize;
      }
    }

    if (props.space) {
      const scaleCount = new Big(newScale)
        .minus(scale.value)
        .div(step.value)
        .abs()
        .toNumber();
      for (let i = 0; i < scaleCount; i++) {
        const mosMove = {
          x: 0,
          y: 0,
        };
        if (newScale > scale.value) {
          mosMove.x = -(mos.x + Math.abs(translate.x)) * step.value;
          mosMove.y = -(mos.y + Math.abs(translate.y)) * step.value;
        } else {
          mosMove.x =
            ((mos.x + Math.abs(translate.x)) * step.value) / baseScale.value;
          mosMove.y =
            ((mos.y + Math.abs(translate.y)) * step.value) / baseScale.value;
        }
        translate.x += mosMove.x
        translate.y += mosMove.y
      }
    } else {
      const scaleDiff = newScale - scale.value;
      const mosOnCanvas = {
        x: mos.x + Math.abs(translate.x),
        y: mos.y + Math.abs(translate.y),
      };
      const mosMove = {
        x: (-mosOnCanvas.x / scale.value) * scaleDiff,
        y: (-mosOnCanvas.y / scale.value) * scaleDiff,
      };
      translate.x += mosMove.x
      translate.y += mosMove.y
    }
    scale.value = newScale;
  }

  function resetZoom() {
    scale.value = min.value;
    translate.x = 0;
    translate.y = 0;
  }

  function updateTranslate(x: number, y: number) {
    const newTranslateX = translate.x + x;
    const newTranslateY = translate.y + y;
    if (
      newTranslateX <= translateLimit.left &&
      newTranslateX >= translateLimit.right
    ) {
      translate.x = newTranslateX;
    }
    if (
      newTranslateY <= translateLimit.top &&
      newTranslateY >= translateLimit.bottom
    ) {
      translate.y = newTranslateY;
    }
  }

  function updateTranslateLimit(
    limit: boolean | [number, number, number, number]
  ) {
    [
      translateLimit.top,
      translateLimit.right,
      translateLimit.bottom,
      translateLimit.left,
    ] =
      Array.isArray(limit) && limit.length === 4
        ? limit
        : [Infinity, -Infinity, -Infinity, Infinity];
  }

  return {
    scale: computed(() => unref(scale)),
    max: computed(() => unref(max)),
    min: computed(() => unref(min)),
    step: computed(() => unref(step)),
    baseScale: computed(() => unref(baseScale)),
    translate: computed(() => unref(translate)),
    zoom,
    resetZoom,
    updateTranslate,
    updateTranslateLimit,
  };
}
