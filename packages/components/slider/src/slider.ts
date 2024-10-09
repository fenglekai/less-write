import { ExtractPropTypes } from "vue";
import Slider from "./slider.vue";
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from "@less-write/constants";
import { definePropType } from "@less-write/utils";

export const sliderProps = {
  modelValue: {
    type: Number,
    default: 0,
  },
  min: {
    type: definePropType<number | string>([Number, String]),
    default: 0,
  },
  max: {
    type: definePropType<number | string>([Number, String]),
    default: 100,
  },
  step: {
    type: definePropType<number | string>([Number, String]),
    default: 1,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  height: {
    type: String,
    default: '8px',
  }
};
export type SliderProps = ExtractPropTypes<typeof sliderProps>;

export const sliderEmits = {
  [UPDATE_MODEL_EVENT]: (value: number) => typeof value === "number",
  [CHANGE_EVENT]: (value: number) => typeof value === "number",
};
export type SliderEmits = typeof sliderEmits;

export type SliderInstance = InstanceType<typeof Slider>;

export interface SliderInitData {
  trackSize: number;
  startX: number;
  startY: number;
  currentPosition: number;
}

export interface CommonData {
  min: number;
  max: number;
  step: number;
  stepPercent: number;
}