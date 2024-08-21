import type Operation from "./operation.vue";

export const operationEmits = {
  zoomIn: (evt: MouseEvent) => evt instanceof MouseEvent,
  zoomOut: (evt: MouseEvent) => evt instanceof MouseEvent,
  resetZoom: (evt: MouseEvent) => evt instanceof MouseEvent,
};
export type OperationEmits = typeof operationEmits;

export type OperationInstance = InstanceType<typeof Operation>;
