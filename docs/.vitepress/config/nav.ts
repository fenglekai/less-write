import { DefaultTheme } from "vitepress";

const nav: DefaultTheme.NavItem[] = [
  { text: "指南", link: "/guide/", activeMatch: "/guide/" },
  { text: "组件", link: "/component/", activeMatch: "/component/" },
  {
    text: `less-write`,
    items: [
      {
        text: "Release Notes",
        link: "https://github.com/fenglekai/less-write/releases",
      },
      {
        text: "Less Write Vitepress Theme",
        link: "https://fenglekai.github.io/less-write-vitepress-theme/",
      },
      {
        text: "Less Write Changelog",
        link: "https://github.com/fenglekai/less-write-changelog/",
      },
      {
        component: "RainbowAnimationSwitcher",
        props: {
          text: "Rainbow Animation",
        },
      },
    ],
  },
]

export default nav