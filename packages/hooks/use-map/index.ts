import { WIDTH, zoomIn, zoomOut, resetZoom } from "@less-write/components";

export function useMap() {
  return {
    width: WIDTH,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
