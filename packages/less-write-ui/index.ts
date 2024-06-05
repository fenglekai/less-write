import type { App, Plugin } from "vue";
import Component from "./component";

export * from "@less-write/components";
export * from "@less-write/hooks";

export const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    components.forEach((c) => app.use(c));
  };

  return install;
};

export default {
  install: makeInstaller([...Component]),
};
