import { reactive, ref, SetupContext, watch } from "vue";
import { useEventListener } from '@vueuse/core'
import { SliderEmits, SliderInitData, SliderProps } from "../slider";
import { UPDATE_MODEL_EVENT } from "@less-write/constants";

export function useSlider(props: SliderProps, emit: SetupContext<SliderEmits>['emit']) {
  const thumb = ref<HTMLDivElement>();
  const track = ref<HTMLDivElement>();
  const fill = ref<HTMLDivElement>();

  const initData = reactive<SliderInitData>({
    min: props.min,
    max: props.max,
    trackSize: 0,
    startX: 0,
    startY: 0,
    currentPosition: 0,
  });

  watch(() => props.modelValue, (newVal) => {
    setPosition(parseInt(String(newVal)));
  })



  const resetSize = () => {
    const trackBoundingClientRect = track.value!.getBoundingClientRect();
    if (track.value) {
      initData.startX = trackBoundingClientRect.left;
      initData.startY = trackBoundingClientRect.bottom;
      
      initData.trackSize = track.value[`client${props.vertical ? 'Height' : 'Width'}`];
    }
  };
  useEventListener('resize', resetSize)

  function onMouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    let position = 0;
    let thumbPos = 0;
    if (props.vertical) {
      thumbPos = initData.startY - clientY;
    } else {
      thumbPos = clientX - initData.startX;
    }
    const max = initData.trackSize;
    const percent = (thumbPos / max) * 100;
    const diff = percent - initData.currentPosition;
    position = percent
    
    if (percent < 0) {
      position = 0;
    }
    if (initData.currentPosition + diff > 100) {
      position = 100;
    }
    
    setPosition(parseInt(String(position)));
    
  }

  function setPosition(position: number) {
    if (props.vertical) {
      thumb.value!.style.bottom = position + "%";
      fill.value!.style.height = position + "%";
    } else {
      thumb.value!.style.left = position + "%";
      fill.value!.style.width = position + "%";
    }
    emit(UPDATE_MODEL_EVENT, position);
    initData.currentPosition = position;
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
