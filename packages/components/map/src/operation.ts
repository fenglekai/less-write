import { definePropType } from "@less-write/utils";
import type Operation from "./operation.vue";
import { ExtractPropTypes } from "vue";
import { UPDATE_MODEL_EVENT } from "@less-write/constants";

export const operationProps = {
  modelValue: {
    type: definePropType<boolean | null | undefined>([
      Boolean,
      Object,
    ]),
    default: false,
  },
}
export type OperationProps = ExtractPropTypes<typeof operationProps>;

export const operationEmits = {
  [UPDATE_MODEL_EVENT]: (value: boolean) => typeof value === 'boolean',
  zoomIn: (evt: MouseEvent) => evt instanceof MouseEvent,
  zoomOut: (evt: MouseEvent) => evt instanceof MouseEvent,
  resetZoom: (evt: MouseEvent) => evt instanceof MouseEvent,
};
export type OperationEmits = typeof operationEmits;

export type OperationInstance = InstanceType<typeof Operation>;
