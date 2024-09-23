# [](https://github.com/fenglekai/less-write/compare/v1.0.6...v) (2024-09-23)

## [1.0.6](https://github.com/fenglekai/less-write/compare/v1.0.5...v1.0.6) (2024-09-23)

### ♻ Code Refactoring | 代码重构

* **components:** 💡 导入slider组件 ([fenglekai](https://github.com/fenglekai/less-write/commit/3496686aef36a13de135bf8e1700d7278fb46948))
* **map:** 💡 变更初始最大/最小/步骤值 ([fenglekai](https://github.com/fenglekai/less-write/commit/705a89a1d8579c6de2bf865a7d54e2e2002ff114))
* **map:** 💡 可配置缩放最大/最小/单步值;迁移use-map ([fenglekai](https://github.com/fenglekai/less-write/commit/5caa221f9e418b329cd42fa810b200aeb6eb5034))
* **map:** 💡 在operation导入使用slider组件 ([fenglekai](https://github.com/fenglekai/less-write/commit/71e0e7bae2975101776bd120ed0bf95b61bfd961))
* **map:** 💡 将mapInstance拓展到ref下 ([fenglekai](https://github.com/fenglekai/less-write/commit/aafb36bfa1a346f5259b3d46f0d4914acaa76c1a))
* **map:** 💡 抽离缩放功能use-transform;新增网格背景 ([fenglekai](https://github.com/fenglekai/less-write/commit/4d4817579f12fcb0e64139d9c0ab9a336f731959))
* **map:** 💡 正确的渲染网格组;响应式加载点位;回传事件方式变更 ([fenglekai](https://github.com/fenglekai/less-write/commit/6d683af068aa6613c860adb42016e37fbd15a549))
* **map:** 💡 网格背景放在不同的layer;点位延迟加载时计算当前缩放大小绘制位置 ([fenglekai](https://github.com/fenglekai/less-write/commit/15bd5b16f88cbcea3ffeca6aeeaa33cb7a09374a))
* **map:** 💡 重新设定鼠标拖拽事件,解决缩放平移问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/6512699857d10ec2a5cf39e421065f7ac397d0ff))

### ⚡ Performance Improvements | 性能优化

* **map:** ⚡️ 不再支持image传入字符串;会导致加载卡顿导致显示异常 ([fenglekai](https://github.com/fenglekai/less-write/commit/7802325f46ed991d5052a7160e1f4192ee9c8c31))

### ✅ Tests | 测试

* 💍 map示例更新 ([fenglekai](https://github.com/fenglekai/less-write/commit/1a5024186e3364406b91b6db61c4c4e83c98d113))
* **map:** 💍 点位callback返回 ([fenglekai](https://github.com/fenglekai/less-write/commit/875194479eae7b9fa23dc76b85790e0ddcff7a48))
* **play:** 💍 调试slider组件功能 ([fenglekai](https://github.com/fenglekai/less-write/commit/ec79ba32bae59ffeb10749597a95638bbce5c39c))

### ✨ Features | 新功能

* 🎸 添加lodash/big.js依赖 ([fenglekai](https://github.com/fenglekai/less-write/commit/a6e59728068efdab3f8b3a2c27601bbabf6e30da))
* **components:** 🎸 新增slider组件 ([fenglekai](https://github.com/fenglekai/less-write/commit/10ba3679434c83d09839ff4d8ea7c49245fe80de))
* **map:** 🎸 可选的space增加间距功能 ([fenglekai](https://github.com/fenglekai/less-write/commit/20b9266fd016f592bd4f86815af2b462a2be7b0c))
* **slider:** 🎸 根据设置的max/min/step进行按比例滑动 ([fenglekai](https://github.com/fenglekai/less-write/commit/ddb0ba11950ccc9c87d176746fd3b5b23a33b304))
* **styles:** 🎸 新增公共基础样式 ([fenglekai](https://github.com/fenglekai/less-write/commit/94e04eafb9d47ea90f3eac92eadf18490869bab5))
* **styles:** 🎸 添加less基础样式与函数/插件 ([fenglekai](https://github.com/fenglekai/less-write/commit/69655bd35b3a678bd810769b7520ad11a3aa17c7))

### 🐛 Bug Fixes | Bug 修复

* **map:** 🐛 修复在动态设置点位中因space差异造成的偏移 ([fenglekai](https://github.com/fenglekai/less-write/commit/fff88efd6bfcccac3c58debf12186ac4e2086237))
* **map:** 🐛 修复在无space下limit限制不正确问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/6b0a0ea1a1f49f60d40746888036e4a515e0fd4d))
* **slider:** 🐛 解决相同position下抖动问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/383d38dd18a3c9d55350f6966034a78bcfcbb21a))

### 📝 Documentation | 文档

* **CHANGELOG:** update changelog [skip ci] ([fenglekai](https://github.com/fenglekai/less-write/commit/820d3b4d137defcf99ca16e81d1f34ac9002057f))

### 🔧 Continuous Integration | CI 配置

* 🎡 更新生成日志模式 ([fenglekai](https://github.com/fenglekai/less-write/commit/30357687f35f3b47a636281659f23d803cc50c74))

### 🔨 Chore | 构建过程或辅助工具的变动

* **build:** 🤖 生成声明文件排除less plugins文件 ([fenglekai](https://github.com/fenglekai/less-write/commit/f0c83be7b650af23ea2c75dfafa660e729d27bf3))
* **slider:** 🤖 删除多余引用 ([fenglekai](https://github.com/fenglekai/less-write/commit/cafaf99e0f933bd7e5aacf6a6acf049bdfdd1761))

## [1.0.5](https://github.com/fenglekai/less-write/compare/v1.0.4...v1.0.5) (2024-09-02)

### ♻ Code Refactoring | 代码重构

* **map:** 💡 设置point中心点,去除冗余计算,适应旋转逻辑 ([fenglekai](https://github.com/fenglekai/less-write/commit/810af1a809aabb8d9fe363b16701129b3f0209ac))
* **map:** 💡 重构缩放逻辑;添加选项缩放滑块功能 ([fenglekai](https://github.com/fenglekai/less-write/commit/01b7d8a2fc9e91ec1e69a9852f5eb641508df681))

### ✨ Features | 新功能

* **map:** 🎸 动态的点位显示:位置/旋转/颜色 ([fenglekai](https://github.com/fenglekai/less-write/commit/e1b9fb96ae091077dbc45f916ce51379add758e1))
* **map:** 🎸 可选择的边缘限制选项，默认关闭 ([fenglekai](https://github.com/fenglekai/less-write/commit/61adcbfcfab9af566be2402fdbae89a8505dc270))

### 🐛 Bug Fixes | Bug 修复

* **map:** 🐛 修复多个组件显示异常问题;修复滑块拖动缩放异常 ([fenglekai](https://github.com/fenglekai/less-write/commit/fe8ada4370778561f986562821d07b8da4cff73a))
* **map:** 🐛 修复错误的引用组件方式 ([fenglekai](https://github.com/fenglekai/less-write/commit/bc2acdf211e4d0256cacd34a3713b4196381e2c6))
* **map:** 🐛 修复鼠标缩放偏移，未放大点与点间距 ([fenglekai](https://github.com/fenglekai/less-write/commit/b3420eb7aeb6adc1daff435ee9bf3ba4f8a06385))
* **map:** 🐛 动态点位在缩放时显示位置错误 ([fenglekai](https://github.com/fenglekai/less-write/commit/384be2d53c3635eee2fcf3d3023e58478f24bb15))

### 💄 Styles | 风格

* **button:** 💄 更新基础样式 ([fenglekai](https://github.com/fenglekai/less-write/commit/d471ababb7af5d265aeb41d860157d5f8dd3406e))

### 📝 Documentation | 文档

* **CHANGELOG:** update changelog [skip ci] ([fenglekai](https://github.com/fenglekai/less-write/commit/853ccb600f00c14e59626ebfc35b2c811d9fccd6))

## [1.0.4](https://github.com/fenglekai/less-write/compare/v1.0.3...v1.0.4) (2024-08-23)

### ♻ Code Refactoring | 代码重构

* 💡 [map]判断pointClick emit是否存在 ([fenglekai](https://github.com/fenglekai/less-write/commit/b389e2e5ac73ac9138d1b6fd4252f6365166bcad))
* 💡 [map]图片加载失败返回;loading样式更新;useMap定义Rect默认宽度变量 ([fenglekai](https://github.com/fenglekai/less-write/commit/0276bac7737cd4e21aaa4ba34b066102d066a4a6))
* 💡 [map]样式更新 ([fenglekai](https://github.com/fenglekai/less-write/commit/db5554684538d6f8d4396f3b65f32c66b6eb9aee))
* 💡 忽略临时文件 ([fenglekai](https://github.com/fenglekai/less-write/commit/a2c372eff50b7e0c5ade5233f992020a3e5c6deb))
* 💡 调整Rect绘制风格 ([fenglekai](https://github.com/fenglekai/less-write/commit/e5a52674c1b9c000ddaa0c3be4f345060a7c2942))

### ✨ Features | 新功能

* 🎸 [button]add instance type ([fenglekai](https://github.com/fenglekai/less-write/commit/f385cd1b73b5d4dceea8c783e720db468c061763))
* 🎸 [cli]新增axios拦截器模板 ([fenglekai](https://github.com/fenglekai/less-write/commit/0da2d123cfb184ab34838f6c7be08ddbedf6ca03))
* 🎸 [cli]新增命令式生成map组件 ([fenglekai](https://github.com/fenglekai/less-write/commit/2dfb16fd48759aa8b900dcd719a0af4c144bf54c))
* 🎸 [map]不在定义高度,由size转换实际高度 ([fenglekai](https://github.com/fenglekai/less-write/commit/b7af6074d179b2c30768a88080e3c5ef81bdd303))
* 🎸 [map]新增pathData属性,可绘制贝塞尔曲线与直线;优化useMap代码 ([fenglekai](https://github.com/fenglekai/less-write/commit/48a335c87f42f8367a8262f401b2a67bef61685c))
* 🎸 [map]添加init callback;loading反应状态 ([fenglekai](https://github.com/fenglekai/less-write/commit/753fc841af3cc03edc96eeb52cabf4bf62c9454b))
* 🎸 [map]独立operation组件,默认隐藏,选项开启 ([fenglekai](https://github.com/fenglekai/less-write/commit/544a2f5ba60e734e239f68094b64baa312ce57c9))
* 🎸 [map]设置zoomIn,zoomOut的默认值无需传参;新增默认操作选项 ([fenglekai](https://github.com/fenglekai/less-write/commit/c6121cd43ead7dbbdd15c04a7c8ad77daaaaece3))
* 🎸 add conventional-changelog-custom package ([fenglekai](https://github.com/fenglekai/less-write/commit/fc148932beaae50bc7a40f5e03ca43da2d6f0c1e))

### 🐛 Bug Fixes | Bug 修复

* 🐛 [map]使用modelValue代替defineModel,解决ts-morph类型检查报错 ([fenglekai](https://github.com/fenglekai/less-write/commit/e8804cd3160ce90e06d132c8c6c90f5df0ed564f))
* 🐛 [map]改变窗口大小后使用滚轮缩放比例大小不正确 ([fenglekai](https://github.com/fenglekai/less-write/commit/2f381878189ccde8d452089acb7bcbdd6a14aa6a))
* 🐛 弃用useResizeObserver,导致函数重复加载 ([fenglekai](https://github.com/fenglekai/less-write/commit/9fcb0b5c43ac7aa97e731b19e87a573435c0cdd9))
* **less-write-ui:** 🐛 修复构建错误,构建了多余的conventional-changelog-custom ([fenglekai](https://github.com/fenglekai/less-write/commit/4d72d23bb27063787b4e83ef628b7bff19457e54))

### 📝 Documentation | 文档

* **CHANGELOG:** update changelog [skip ci] ([fenglekai](https://github.com/fenglekai/less-write/commit/9c7d96e4d2bd95f20ae2f8214f4a01ea1f33cccf))

### 🔧 Continuous Integration | CI 配置

* 🎡 update generate changelog command ([fenglekai](https://github.com/fenglekai/less-write/commit/84229edb0da07484a40f8b70b1224c70f6ad3fe5))
* 🎡 update generate release changelog style ([fenglekai](https://github.com/fenglekai/less-write/commit/2a620744f03c49b17a6a96df03f57f8ed3c09c5d))
* 🎡 更新changelog生成方式,更好的release日志 ([fenglekai](https://github.com/fenglekai/less-write/commit/bd13c92c8767b1b84730b58d8d9581230c41a20b))

### 🔨 Chore | 构建过程或辅助工具的变动

* 🤖 添加cli部分依赖声明,根目录cli脚本删除 ([fenglekai](https://github.com/fenglekai/less-write/commit/65331e8af7efdd11d63ff903d73ef3bcda63683e))
* 🤖 添加vue-tsc类型检测 ([fenglekai](https://github.com/fenglekai/less-write/commit/3b7aa13c6d8738ea77465820d0ab09e256530d6d))

## [1.0.3](https://github.com/fenglekai/less-write/compare/v1.0.2...v1.0.3) (2024-08-15)

### 🐛 Bug Fixes | Bug 修复

* 🐛 PKG_NAME错误导致替换路径报错问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/c85ded04ecc66d43f284f25108448f84c744e60f))

### 📝 Documentation | 文档

* **CHANGELOG:** update changelog [skip ci] ([fenglekai](https://github.com/fenglekai/less-write/commit/fdec29d153119182379b7728b4adf76d8e1ccebf))

## [1.0.2](https://github.com/fenglekai/less-write/compare/v1.0.0...v1.0.2) (2024-08-15)

### ♻ Code Refactoring | 代码重构

* 💡 add map example ([fenglekai](https://github.com/fenglekai/less-write/commit/e74788e2b233238bb00f34b051c59a5582108cd3))
* 💡 remove not used variable ([fenglekai](https://github.com/fenglekai/less-write/commit/7e9417b2917c3dc1b629f3b95ec940d945200214))

### ✨ Features | 新功能

* 🎸 [map]监听props属性重载地图 ([fenglekai](https://github.com/fenglekai/less-write/commit/d2592f16dc31a7f855824519277d867525aa5747))
* 🎸 add vue runtime utils ([fenglekai](https://github.com/fenglekai/less-write/commit/3229dea54c1337337ddb8c1154b92704fa16ebdc))
* 🎸 更新@vitejs/plugin-vue版本以解决souceMap失败问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/9edc577590ad5b43630bcb52b1e2517720f52cb1))

### 🐛 Bug Fixes | Bug 修复

* 🐛 [@vue/compiler-sfc]在生成ts声明文件时无法解析导入源问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/aec87ccafb51e8f0f45e751d8a9e4ce22e075d0b))
* 🐛 [map]不同大小的Rect放大后位置偏移 ([fenglekai](https://github.com/fenglekai/less-write/commit/9dc5590a6a223f21a773b048b6cd1580d46f6970))
* 🐛 [map]修复图片绘制未指定宽高问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/f063c9296eb516c5f13d0ec40d79a6f4f9c68480))
* 🐛 无法使用缩放功能,当前改为从defineExpose获取;加载图片问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/5568f630478b3da1a79f1f4645b79fb4e3ff6597))

### 📝 Documentation | 文档

* ✏️ update README ([fenglekai](https://github.com/fenglekai/less-write/commit/aeaf65b43bb96f417b3ad9d75bbabe0e591dbb3f))
* **CHANGELOG:** update changelog [skip ci] ([fenglekai](https://github.com/fenglekai/less-write/commit/9fdd5fa61714ba61241a587110cf42a13cffbaa3))

### 🔧 Continuous Integration | CI 配置

* 🎡 fix synax error ([fenglekai](https://github.com/fenglekai/less-write/commit/ab1fb84f5001ad0ecc08d81689e8359aa74dfde8))
* 🎡 generate current version changelog ([fenglekai](https://github.com/fenglekai/less-write/commit/1f46fa2aa71985518fb5ab98bf7a7624197356ea))
* 🎡 优化changelog生成方式,减少步骤 ([fenglekai](https://github.com/fenglekai/less-write/commit/ea452a25c36225fc8b0e9985aba069e7d80edb3e))
* 🎡 修复语法问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/f60499589f82c93240bfb79fcd5bc9d743b23900))

### 🔨 Chore | 构建过程或辅助工具的变动

* 🤖 add packages/constants path ([fenglekai](https://github.com/fenglekai/less-write/commit/30e04f4c938eaa21c3624e5e14a71171498dcc2b))
* 🤖 move INSTALLED_KEY to @less-write/constants ([fenglekai](https://github.com/fenglekai/less-write/commit/8e687e5a0d90de478a7938df54543edd994f6ccf))
* 🤖 path name 'element-plus' -> 'less-write-ui' ([fenglekai](https://github.com/fenglekai/less-write/commit/94fc02ceee68eb6089db4d703a9492c85092977c))
* 🤖 更新lock文件与tsconfig,env.d.ts,gulpfile工作流名称 ([fenglekai](https://github.com/fenglekai/less-write/commit/828e55ba333a26c18d95160b2091d1e4c263e354))

# [1.0.0](https://github.com/fenglekai/less-write/compare/3a3a403af021e1bef8eebe7482ecb66d993f919f...v1.0.0) (2024-08-02)

### ✅ Tests | 测试

* 💍 build full bundle test ([fenglekai](https://github.com/fenglekai/less-write/commit/4a7109394fd7dfb979e0529839b340df2d4552f2))
* 💍 rollup module bundler test ([fenglekai](https://github.com/fenglekai/less-write/commit/ed25a42d88186883308979787b105106e58026be))
* 💍 test module bundle ([fenglekai](https://github.com/fenglekai/less-write/commit/f7b1556ce95f0cca477e774f80e8dc993b94b2dc))
* 💍 尝试使用unbuild,gulp ([fenglekai](https://github.com/fenglekai/less-write/commit/fac287b169abf425558764aae02bb75d99813d30))
* 💍 测试构建工具 ([fenglekai](https://github.com/fenglekai/less-write/commit/f5df82b2383067c48d5e31e3a7f8d18519b2780d))

### ✨ Features | 新功能

* 🎸 构建modules与fullBundle;没有使用sourcemap ([fenglekai](https://github.com/fenglekai/less-write/commit/b68383daf77a3c49f74a222ad760dc3e17250f62))
* 🎸 添加CI/CD构建脚本 ([fenglekai](https://github.com/fenglekai/less-write/commit/8367bb91f53d21d0c6e1b9aaaa7e645bce11e7cf))
* 🎸 添加types-definitions生成类型文件,修复类型检查错误代码 ([fenglekai](https://github.com/fenglekai/less-write/commit/6e475ac66b0036462246228c14d440c6031cce18))
* 🎸 项目风范替换element-plus ([fenglekai](https://github.com/fenglekai/less-write/commit/3a3a403af021e1bef8eebe7482ecb66d993f919f))

### 🐛 Bug Fixes | Bug 修复

* 🐛 添加peer dependencies解决构建含有依赖问题 ([fenglekai](https://github.com/fenglekai/less-write/commit/0454db3dcc16a3902cd60b8e2bbc6eece46b1bd4))

### 📝 Documentation | 文档

* ✏️ change language ([fenglekai](https://github.com/fenglekai/less-write/commit/8216ba95599c731391b733959b67ec731327e982))
* ✏️ update README ([fenglekai](https://github.com/fenglekai/less-write/commit/a55be1bddfa20d825dbb4f030fc987d651093381))

### 🔧 Continuous Integration | CI 配置

* 🎡 add npm publish access public ([fenglekai](https://github.com/fenglekai/less-write/commit/d31ce1a27caa56240f33bb15635d9a631dad547a))
* 🎡 changelog保留历史长度2;主动调用publish-npm ([fenglekai](https://github.com/fenglekai/less-write/commit/ae02384cf4b67db6ed3d657aabca1f081671f93f))
* 🎡 create path ([fenglekai](https://github.com/fenglekai/less-write/commit/6fc3a9dc30f3477fc7208b5152c4198e9e9a0507))
* 🎡 fix dependency not found ([fenglekai](https://github.com/fenglekai/less-write/commit/19be5083ce927b4220cc9df3a1b39ffbb86e5728))
* 🎡 fix execute ts-morgh dependencies not find ([fenglekai](https://github.com/fenglekai/less-write/commit/2e273d1ddbc44cd0a1c8a7efec36b87301216fe6))
* 🎡 git设置默认分支 ([fenglekai](https://github.com/fenglekai/less-write/commit/1b55260aa7470cad6df83e6b83fbcc3090e96b1c))
* 🎡 set import path not use alias ([fenglekai](https://github.com/fenglekai/less-write/commit/f37207a88dd05d90b48274fd5fd6a3059c091415))
* 🎡 set packageManager in package.json ([fenglekai](https://github.com/fenglekai/less-write/commit/e4ecfbb2a121d13a00335438432e914c24f80fc2))
* 🎡 test ([fenglekai](https://github.com/fenglekai/less-write/commit/a3ebbb6837c7b3a9964f8a0d6555e798e9c76bbe))
* 🎡 test ([fenglekai](https://github.com/fenglekai/less-write/commit/4d5ebd66f0f1362cebe3292e5ae4d37bfb250e63))
* 🎡 test build ([fenglekai](https://github.com/fenglekai/less-write/commit/f6f81115bd52f7172c6e3a4816d1cbce1894a147))
* 🎡 test vueCompiler ([fenglekai](https://github.com/fenglekai/less-write/commit/e6df98b6550eecd104ad3ae39012eea25273f2f8))
* 🎡 update packageManager to 9.6.0 ([fenglekai](https://github.com/fenglekai/less-write/commit/54eb487dddd420a346b91f3eeb0c36a330068b57))
* 🎡 update packageManager to pnpm@9.6.0 ([fenglekai](https://github.com/fenglekai/less-write/commit/ed387432abf933ddcc3228158527815d010ddced))
* 🎡 update packageManager version to 8 ([fenglekai](https://github.com/fenglekai/less-write/commit/c3ff3452d2173ecf9302046f75e77a5bc7a6cf3e))
* 🎡 update postinstall script ([fenglekai](https://github.com/fenglekai/less-write/commit/31587e515f7f49edac7677f01a46f76540c4e50f))
* 🎡 修复未指定git与node导致changelog生成失败;变更publish-npm的触发条件 ([fenglekai](https://github.com/fenglekai/less-write/commit/241093186b4602be90e4a8201bd08e83f4a5f1c5))
* 🎡 修改触发命名 ([fenglekai](https://github.com/fenglekai/less-write/commit/23ba72ba2d8a30d347dad695485a2292cbecddb3))
* 🎡 取消触发条件 ([fenglekai](https://github.com/fenglekai/less-write/commit/7c988a3da6a0871a0c85b9e8b3ba614d7ca36719))
* 🎡 尝试在生成release额外触发workflow ([fenglekai](https://github.com/fenglekai/less-write/commit/164e0e9dd193054102018bb1cd02385fe4582f5d))
* 🎡 添加action写入权限 ([fenglekai](https://github.com/fenglekai/less-write/commit/30fd1f0e63300acd484617fb18e69b94b38949f2))
* 🎡 添加github密匙 ([fenglekai](https://github.com/fenglekai/less-write/commit/7c2ef364922418c03abefadfbb875c9a41854ede))
* 🎡 生成changelog.txt给release使用 ([fenglekai](https://github.com/fenglekai/less-write/commit/88281fd942f40b204e85ac6329412036b1d618a8))
* 🎡 设置获取历史提交;publish-npm触发方式 ([fenglekai](https://github.com/fenglekai/less-write/commit/4562bb00938a4c6c7bb5fdb7d9a0220064b59de8))
* 🎡 设置触发分支 ([fenglekai](https://github.com/fenglekai/less-write/commit/67d14be06ed99e5d49ccdef2b981bac250da76ec))
* 🎡 配置用户名邮箱 ([fenglekai](https://github.com/fenglekai/less-write/commit/c2ae71203e7508a65e6204350abbffc07cbec2fc))

### 🔨 Chore | 构建过程或辅助工具的变动

* 🤖 create build modules task and build full bundle task ([fenglekai](https://github.com/fenglekai/less-write/commit/472866648cacfc473278794a82b63efc3a13fd29))
* 🤖 expamples => play ([fenglekai](https://github.com/fenglekai/less-write/commit/eeec879d605b2107b2b81720ec7b1ee7ac354204))
* 🤖 styles构建工作流程,集成到build工作流程中 ([fenglekai](https://github.com/fenglekai/less-write/commit/9a399ef0a4e077eb37b49c147c0dbad685c767d9))
* 🤖 取消使用unplugin-auto-import依赖 ([fenglekai](https://github.com/fenglekai/less-write/commit/922b9ccc7d933b80a22c6c4c3e8d5814e6e58957))

