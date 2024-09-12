import { definePropType } from "@less-write/utils";
import type Operation from "./operation.vue";
import { ExtractPropTypes } from "vue";
import { UPDATE_MODEL_EVENT } from "@less-write/constants";

export const UPDATE_SCALE_EVENT = "update:scale";

export const operationProps = {
  modelValue: {
    type: definePropType<boolean | null | undefined>(Boolean),
    default: false,
  },
  scale: {
    type: definePropType<number | string>([Number, String]),
    default: 1,
  },
  minScale: {
    type: definePropType<number | string>([Number, String]),
    default: 1,
  },
  maxScale: {
    type: definePropType<number | string>([Number, String]),
    default: 10,
  },
  scaleStep: {
    type: definePropType<number | string>([Number, String]),
    default: 1,
  },
};
export type OperationProps = ExtractPropTypes<typeof operationProps>;

export const operationEmits = {
  [UPDATE_MODEL_EVENT]: (value: boolean) => typeof value === "boolean",
  [UPDATE_SCALE_EVENT]: (value: number) => typeof value === "number",
  zoomIn: (evt: MouseEvent) => evt instanceof MouseEvent,
  zoomOut: (evt: MouseEvent) => evt instanceof MouseEvent,
  resetZoom: (evt: MouseEvent) => evt instanceof MouseEvent,
  setScale: (value: number) => typeof value === "number",
};
export type OperationEmits = typeof operationEmits;

export type OperationInstance = InstanceType<typeof Operation>;
