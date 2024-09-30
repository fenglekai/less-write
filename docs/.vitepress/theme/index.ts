// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import CustomTheme from "./less-write-vitepress-theme";

export default {
  extends: CustomTheme,
  enhanceApp({ app, router, siteData }) {
    // ...
  },
} satisfies Theme;
