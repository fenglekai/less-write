import path from "path";
import { defineConfig } from "vitepress";
import {
  docPackage,
  getPackageDependencies,
  lePackage,
  projRoot,
} from "@less-write/build";
import baseConfig from "./theme/less-write-vitepress-theme/config";
import sidebar from "./utils/sidebar";

const alias: any[] = [];

if (process.env.DOC_ENV !== "production") {
  alias.push(
    {
      find: /^less-write-ui(\/(es|lib))?$/,
      replacement: path.resolve(projRoot, "packages/less-write-ui/index.ts"),
    },
    {
      find: /^less-write-ui\/(es|lib)\/(.*)$/,
      replacement: `${path.resolve(projRoot, "packages")}/$2`,
    }
  );
}

const { dependencies: leDeps } = getPackageDependencies(lePackage);
const { dependencies: docsDeps } = getPackageDependencies(docPackage);

const optimizeDeps = [...new Set([...leDeps, ...docsDeps])].filter(
  (dep) => !dep.startsWith("@types/") && !["less-write-ui"].includes(dep)
);

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: baseConfig,
  title: "Less Write",
  description: "A Vue.js 3 UI Library",
  head: [["link", { rel: "icon", href: "/favicon.ico" }]],
  vite: {
    resolve: {
      alias,
    },
    optimizeDeps: {
      include: optimizeDeps,
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "指南", link: "/guide" },
      { text: "组件", link: "/component" },
      {
        text: `less-write`,
        items: [
          {
            text: "Release Notes",
            link: "https://github.com/fenglekai/less-write/releases",
          },
          {
            component: "RainbowAnimationSwitcher",
            props: {
              text: "Rainbow Animation",
            },
          },
        ],
      },
    ],

    sidebar,

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    logo: "/logo.jpeg",
    search: {
      provider: "local",
    },
    outline: {
      label: "页面导航",
      level: [2, 3],
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    footer: {
      message: "基于 MIT 许可发布",
      copyright: "© 2024 冯乐铠",
    },
  },
});
