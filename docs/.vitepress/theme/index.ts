// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import LessWriteUI from 'less-write-ui';
import '../../../packages/styles/src/index.less';
import CustomTheme from "less-write-vitepress-theme/es/theme";

export default {
  extends: CustomTheme,
  enhanceApp({ app, router, siteData }) {
    app.use(LessWriteUI)
    // ...
  },
} satisfies Theme;
