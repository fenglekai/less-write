import { ExtractPropTypes } from 'vue';
import Slider from './slider.vue'
import { INPUT_EVENT, UPDATE_MODEL_EVENT } from '@less-write/constants';

export const sliderProps = {
  modelValue: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  step: {
    type: Number,
    default: 1,
  },
  vertical: {
    type: Boolean,
    default: false
  }
};
export type SliderProps = ExtractPropTypes<typeof sliderProps>;

export const sliderEmits = {
  [UPDATE_MODEL_EVENT]: (value: number) => typeof value === "number",
  [INPUT_EVENT]: (value: number) => typeof value === "number",
};
export type SliderEmits = typeof sliderEmits;

export type SliderInstance = InstanceType<typeof Slider>;

export interface SliderInitData {
  min: number;
  max: number;
  trackSize: number;
  startX: number;
  startY: number;
  currentPosition: number;
}