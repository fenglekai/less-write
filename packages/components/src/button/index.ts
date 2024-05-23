import button from "./index.vue";
import type { App, Plugin, Component } from "vue";
type SFCWithInstall<T> = T & Plugin;
const withInstall = <T>(comp: Component) => {
  (comp as SFCWithInstall<T>).install = (app: App) => {
    //注册组件
    app.component((comp as any).name, comp);
  };
  return comp as SFCWithInstall<T>;
};
const Button = withInstall(button);
export default Button;
