import { definePropType } from "@less-write/utils";
import type Operation from "./operation.vue";
import { ExtractPropTypes } from "vue";
import { UPDATE_MODEL_EVENT } from "@less-write/constants";

export const operationProps = {
  modelValue: {
    type: definePropType<boolean | null | undefined>([Boolean, Object]),
    default: false,
  },
  scale: {
    type: Number,
    default: 1,
  },
  minScale: {
    type: Number,
    default: 1,
  },
  maxScale: {
    type: Number,
    default: 10,
  },
  scaleStep: {
    type: Number,
    default: 0.2,
  },
};
export type OperationProps = ExtractPropTypes<typeof operationProps>;

export const operationEmits = {
  [UPDATE_MODEL_EVENT]: (value: boolean) => typeof value === "boolean",
  zoomIn: (evt: MouseEvent) => evt instanceof MouseEvent,
  zoomOut: (evt: MouseEvent) => evt instanceof MouseEvent,
  resetZoom: (evt: MouseEvent) => evt instanceof MouseEvent,
  setScale: (value: number) => typeof value === "number",
};
export type OperationEmits = typeof operationEmits;

export type OperationInstance = InstanceType<typeof Operation>;
