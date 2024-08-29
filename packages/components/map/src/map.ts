import { ExtractPropTypes } from "vue";
import type Map from "./map.vue";
import type { BezierConfig, PointConfig } from "@less-write/hooks";
import { definePropType } from "@less-write/utils";

export const mapProps = {
  background: {
    type: String,
    default: "",
  },
  size: {
    type: definePropType<{
      width: number;
      height: number;
    }>(Object),
    require: true,
    default: {
      width: 0,
      height: 0,
    },
  },
  pathData: {
    type: definePropType<BezierConfig[]>(Array),
    default: [],
  },
  pointData: {
    type: definePropType<PointConfig[]>(Array),
    default: [],
  },
  operation: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: Boolean,
    default: false,
  },
  drawer: {
    type: Boolean,
    default: false,
  },
};
export type MapProps = ExtractPropTypes<typeof mapProps>;

export const mapEmits = {
  pointClick: (data: any) => {},
};
export type MapEmits = typeof mapEmits;

export type MapInstance = InstanceType<typeof Map>;
