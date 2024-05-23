import  * as components from "./src/main";
export * from "./src/main";
export * from "./hook/index";
import { App } from "vue";
export default {
  install: (app: App) => {
    const comps = Object.values(components)
    comps.forEach((c) => app.use(c));
  },
};