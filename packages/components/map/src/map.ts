import { ExtractPropTypes } from "vue";
import type Map from "./map.vue";
import type { ShapeConfig } from "konva/lib/Shape";
import { definePropType } from "@less-write/utils";

export const mapProps = {
  scale: {
    type: Number,
    default: 1,
  },
  min: {
    type: definePropType<number | string>([Number, String]),
    default: 1,
  },
  max: {
    type: definePropType<number | string>([Number, String]),
    default: 10,
  },
  step: {
    type: definePropType<number | string>([Number, String]),
    default: 1,
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

export interface BezierConfig extends ShapeConfig {
  start: {
    x: number;
    y: number;
  };
  controlStart?: {
    x: number;
    y: number;
  };
  controlEnd?: {
    x: number;
    y: number;
  };
  end: {
    x: number;
    y: number;
  };
}

export interface PointConfig extends ShapeConfig {
  image?: HTMLImageElement | string;
  data?: any;
}
