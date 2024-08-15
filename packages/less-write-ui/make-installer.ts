import type { App, Plugin } from "@vue/runtime-core";
import Component from "./component";
import { INSTALLED_KEY } from "@less-write/constants";


const makeInstaller = (components: Plugin[] = []) => {
  const install = (app: App) => {
    if (app[INSTALLED_KEY]) return

    app[INSTALLED_KEY] = true
    components.forEach((c) => app.use(c));
  };

  return { install };
};

export default makeInstaller([...Component]);
