const guideSidebar = [
  {
    text: "安装",
    link: "/guide/index",
  },
  {
    text: "快速开始",
    link: "/guide/quickstart",
  },
];

const basicComponentSidebar = [
  {
    text: "Button 按钮",
    link: "/component/button",
  },
  {
    text: "Slider 滑块",
    link: "/component/slider",
  },
];

const mapComponentSidebar = [
  {
    text: "Map 点位地图",
    link: "/component/map",
  },
];

const sidebar = {
  "/guide": [{ text: "入门指南", items: guideSidebar }],
  "/component": [
    {
      text: "组件",
      items: [
        { text: "Basic 基础组件", items: basicComponentSidebar },
        { text: "Map 地图组件", items: mapComponentSidebar },
      ],
    },
  ],
};
export default sidebar;
