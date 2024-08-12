import type Map from './map.vue'
import { type Point } from "@less-write/hooks";

export interface MapProps {
  height: number;
  background?: string;
  size?: {
    width: number;
    height: number;
  };
  loading?: boolean;
  pointList?: Point[];
  showDetail?: boolean;
}

export interface MapEmits {
  (e: "updateDetail", data: any): void;
}

export type MapInstance = InstanceType<typeof Map>