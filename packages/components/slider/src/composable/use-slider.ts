import { computed, nextTick, onMounted, reactive, ref, SetupContext, watch } from "vue";
import { useEventListener } from "@vueuse/core";
import {
  CommonData,
  SliderEmits,
  SliderInitData,
  SliderProps,
} from "../slider";
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from "@less-write/constants";
import Big from "big.js";

export function useSlider(
  props: SliderProps,
  emit: SetupContext<SliderEmits>["emit"]
) {
  const thumb = ref<HTMLDivElement>();
  const track = ref<HTMLDivElement>();
  const fill = ref<HTMLDivElement>();

  const initData = reactive<SliderInitData>({
    trackSize: 0,
    startX: 0,
    startY: 0,
    currentPosition: 0,
  });

  const commonData = computed<CommonData>(() => {
    let min = Number(props.min);
    let max = Number(props.max);
    let step = Number(props.step);
    if (isNaN(min) || isNaN(max) || isNaN(step)) {
      console.warn("min/max/step is not a number");
      min = 0;
      max = 100;
      step = 1;
    }
    const distance = new Big(max).minus(min).toNumber();
    const stepPercent = new Big(step).div(distance).times(100).toNumber();

    return {
      min,
      max,
      step,
      stepPercent,
    };
  });

  watch(
    () => props.modelValue,
    (val) => {
      const pos = new Big(val)
        .minus(commonData.value.min)
        .div(commonData.value.step)
        .times(commonData.value.stepPercent);
      
      changeStyle(parsePos(pos.toNumber()));
    }
  );

  onMounted(() => {
    if (props.modelValue < commonData.value.min) {
      return emit(UPDATE_MODEL_EVENT, commonData.value.min);
    }
    if (props.modelValue > commonData.value.max) {
      return emit(UPDATE_MODEL_EVENT, commonData.value.max);
    }
    emit(UPDATE_MODEL_EVENT, props.modelValue);
  });

  const resetSize = () => {
    const trackBoundingClientRect = track.value!.getBoundingClientRect();
    initData.startX = trackBoundingClientRect.left;
    initData.startY = trackBoundingClientRect.bottom;
    if (track.value) {
      initData.trackSize =
        track.value[`client${props.vertical ? "Height" : "Width"}`];
    }
  };
  useEventListener("resize", resetSize);

  const parsePos = (position: number) => {
    let res = parseInt(String(position))
    if (res === 0 && (1 / res) === -Infinity) {
      res = 0
    }
    return res
  };

  function changeStyle(position: number) {
    if (props.vertical) {
      thumb.value!.style.bottom = position + "%";
      fill.value!.style.height = position + "%";
    } else {
      thumb.value!.style.left = position + "%";
      fill.value!.style.width = position + "%";
    }
  }

  async function setPosition(position: number) {
    const diff = initData.currentPosition - position;

    if (Math.abs(diff - commonData.value.stepPercent) > 0) {
      const stepCount = parsePos(diff / commonData.value.stepPercent);
      let pos = parsePos(
        initData.currentPosition - stepCount * commonData.value.stepPercent
      );

      if (pos < 0) {
        pos = 0;
      }
      if (pos > 100) {
        pos = 100;
      }

      changeStyle(pos)
      initData.currentPosition = pos;
      emitChange(pos);
      await nextTick()
    }
  }

  function emitChange(position: number) {
    const posCount = new Big(
      Math.ceil(position / commonData.value.stepPercent)
    );
    const setModelValue = posCount
      .times(commonData.value.step)
      .plus(commonData.value.min);
    emit(UPDATE_MODEL_EVENT, setModelValue.toNumber());
    emit(CHANGE_EVENT, setModelValue.toNumber());
  }

  function onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    let position = 0;
    let thumbPos = 0;
    if (props.vertical) {
      thumbPos = initData.startY - clientY;
    } else {
      thumbPos = clientX - initData.startX;
    }
    const percent = (thumbPos / initData.trackSize) * 100;
    position = percent;
    setPosition(parsePos(position));
  }

  function onMouseUp() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  function handleThumbDown(event: MouseEvent) {
    event.preventDefault();
    resetSize();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  return {
    thumb,
    track,
    fill,
    handleThumbDown,
  };
}
