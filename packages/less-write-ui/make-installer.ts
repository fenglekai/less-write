import type { App, Plugin } from "vue";
import Component from "./component";

const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    components.forEach((c) => app.use(c));
  };

  return { install };
};

export default makeInstaller([...Component]);
