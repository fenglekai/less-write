import { withInstall } from "@less-write/utils";
import Map from "./src/map.vue";

import LeOperation from "./src/operation.vue";

export { LeOperation };

export const LeMap = withInstall(Map);
export default LeMap;

export * from "./src/map";
export * from "./src/operation";
