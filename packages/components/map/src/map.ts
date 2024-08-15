import { ExtractPropTypes } from "vue";
import type Map from "./map.vue";
import { type Point } from "@less-write/hooks";
import { definePropType } from "@less-write/utils";

export const mapProps = {
  height: {
    type: Number,
    require: true,
    default: 0,
  },
  background: {
    type: String,
    default: "",
  },
  size: {
    type: definePropType<{
      width: number;
      height: number;
    }>(Object),
    default: {
      width: 0,
      height: 0,
    },
  },
  loading: Boolean,
  pointList: Array<Point>,
  showDetail: Boolean,
};
export type MapProps = ExtractPropTypes<typeof mapProps>;

export const mapEmits = {
  updateDetail: (data: any) => {},
};
export type MapEmits = typeof mapEmits;

export type MapInstance = InstanceType<typeof Map>;
