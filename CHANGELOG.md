# [](https://github.com/fenglekai/less-write/compare/v1.0.5...v) (2024-09-02)



## [1.0.5](https://github.com/fenglekai/less-write/compare/v1.0.4...v1.0.5) (2024-09-02)


### Bug Fixes

* **map:** 🐛 修复多个组件显示异常问题;修复滑块拖动缩放异常 ([fe8ada4](https://github.com/fenglekai/less-write/commit/fe8ada4370778561f986562821d07b8da4cff73a))
* **map:** 🐛 修复错误的引用组件方式 ([bc2acdf](https://github.com/fenglekai/less-write/commit/bc2acdf211e4d0256cacd34a3713b4196381e2c6))
* **map:** 🐛 修复鼠标缩放偏移，未放大点与点间距 ([b3420eb](https://github.com/fenglekai/less-write/commit/b3420eb7aeb6adc1daff435ee9bf3ba4f8a06385))
* **map:** 🐛 动态点位在缩放时显示位置错误 ([384be2d](https://github.com/fenglekai/less-write/commit/384be2d53c3635eee2fcf3d3023e58478f24bb15))


### Features

* **map:** 🎸 动态的点位显示:位置/旋转/颜色 ([e1b9fb9](https://github.com/fenglekai/less-write/commit/e1b9fb96ae091077dbc45f916ce51379add758e1))
* **map:** 🎸 可选择的边缘限制选项，默认关闭 ([61adcbf](https://github.com/fenglekai/less-write/commit/61adcbfcfab9af566be2402fdbae89a8505dc270))



## [1.0.4](https://github.com/fenglekai/less-write/compare/v1.0.3...v1.0.4) (2024-08-23)


### Bug Fixes

* 🐛 [map]使用modelValue代替defineModel,解决ts-morph类型检查报错 ([e8804cd](https://github.com/fenglekai/less-write/commit/e8804cd3160ce90e06d132c8c6c90f5df0ed564f))
* 🐛 [map]改变窗口大小后使用滚轮缩放比例大小不正确 ([2f38187](https://github.com/fenglekai/less-write/commit/2f381878189ccde8d452089acb7bcbdd6a14aa6a))
* 🐛 弃用useResizeObserver,导致函数重复加载 ([9fcb0b5](https://github.com/fenglekai/less-write/commit/9fcb0b5c43ac7aa97e731b19e87a573435c0cdd9))
* **less-write-ui:** 🐛 修复构建错误,构建了多余的conventional-changelog-custom ([4d72d23](https://github.com/fenglekai/less-write/commit/4d72d23bb27063787b4e83ef628b7bff19457e54))


### Features

* 🎸 [button]add instance type ([f385cd1](https://github.com/fenglekai/less-write/commit/f385cd1b73b5d4dceea8c783e720db468c061763))
* 🎸 [cli]新增axios拦截器模板 ([0da2d12](https://github.com/fenglekai/less-write/commit/0da2d123cfb184ab34838f6c7be08ddbedf6ca03))
* 🎸 [cli]新增命令式生成map组件 ([2dfb16f](https://github.com/fenglekai/less-write/commit/2dfb16fd48759aa8b900dcd719a0af4c144bf54c))
* 🎸 [map]不在定义高度,由size转换实际高度 ([b7af607](https://github.com/fenglekai/less-write/commit/b7af6074d179b2c30768a88080e3c5ef81bdd303))
* 🎸 [map]新增pathData属性,可绘制贝塞尔曲线与直线;优化useMap代码 ([48a335c](https://github.com/fenglekai/less-write/commit/48a335c87f42f8367a8262f401b2a67bef61685c))
* 🎸 [map]添加init callback;loading反应状态 ([753fc84](https://github.com/fenglekai/less-write/commit/753fc841af3cc03edc96eeb52cabf4bf62c9454b))
* 🎸 [map]独立operation组件,默认隐藏,选项开启 ([544a2f5](https://github.com/fenglekai/less-write/commit/544a2f5ba60e734e239f68094b64baa312ce57c9))
* 🎸 [map]设置zoomIn,zoomOut的默认值无需传参;新增默认操作选项 ([c6121cd](https://github.com/fenglekai/less-write/commit/c6121cd43ead7dbbdd15c04a7c8ad77daaaaece3))
* 🎸 add conventional-changelog-custom package ([fc14893](https://github.com/fenglekai/less-write/commit/fc148932beaae50bc7a40f5e03ca43da2d6f0c1e))



## [1.0.3](https://github.com/fenglekai/less-write/compare/v1.0.2...v1.0.3) (2024-08-15)


### Bug Fixes

* 🐛 PKG_NAME错误导致替换路径报错问题 ([c85ded0](https://github.com/fenglekai/less-write/commit/c85ded04ecc66d43f284f25108448f84c744e60f))



## [1.0.2](https://github.com/fenglekai/less-write/compare/v1.0.0...v1.0.2) (2024-08-15)


### Bug Fixes

* 🐛 [@vue/compiler-sfc]在生成ts声明文件时无法解析导入源问题 ([aec87cc](https://github.com/fenglekai/less-write/commit/aec87ccafb51e8f0f45e751d8a9e4ce22e075d0b))
* 🐛 [map]不同大小的Rect放大后位置偏移 ([9dc5590](https://github.com/fenglekai/less-write/commit/9dc5590a6a223f21a773b048b6cd1580d46f6970))
* 🐛 [map]修复图片绘制未指定宽高问题 ([f063c92](https://github.com/fenglekai/less-write/commit/f063c9296eb516c5f13d0ec40d79a6f4f9c68480))
* 🐛 无法使用缩放功能,当前改为从defineExpose获取;加载图片问题 ([5568f63](https://github.com/fenglekai/less-write/commit/5568f630478b3da1a79f1f4645b79fb4e3ff6597))


### Features

* 🎸 [map]监听props属性重载地图 ([d2592f1](https://github.com/fenglekai/less-write/commit/d2592f16dc31a7f855824519277d867525aa5747))
* 🎸 add vue runtime utils ([3229dea](https://github.com/fenglekai/less-write/commit/3229dea54c1337337ddb8c1154b92704fa16ebdc))
* 🎸 更新@vitejs/plugin-vue版本以解决souceMap失败问题 ([9edc577](https://github.com/fenglekai/less-write/commit/9edc577590ad5b43630bcb52b1e2517720f52cb1))



# [1.0.0](https://github.com/fenglekai/less-write/compare/3a3a403af021e1bef8eebe7482ecb66d993f919f...v1.0.0) (2024-08-02)


### Bug Fixes

* 🐛 添加peer dependencies解决构建含有依赖问题 ([0454db3](https://github.com/fenglekai/less-write/commit/0454db3dcc16a3902cd60b8e2bbc6eece46b1bd4))


### Features

* 🎸 构建modules与fullBundle;没有使用sourcemap ([b68383d](https://github.com/fenglekai/less-write/commit/b68383daf77a3c49f74a222ad760dc3e17250f62))
* 🎸 添加CI/CD构建脚本 ([8367bb9](https://github.com/fenglekai/less-write/commit/8367bb91f53d21d0c6e1b9aaaa7e645bce11e7cf))
* 🎸 添加types-definitions生成类型文件,修复类型检查错误代码 ([6e475ac](https://github.com/fenglekai/less-write/commit/6e475ac66b0036462246228c14d440c6031cce18))
* 🎸 项目风范替换element-plus ([3a3a403](https://github.com/fenglekai/less-write/commit/3a3a403af021e1bef8eebe7482ecb66d993f919f))



