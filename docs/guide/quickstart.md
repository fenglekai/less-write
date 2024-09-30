# 快速开始

如何在项目中使用Less Write UI。

## 用法

### 完整引入

将依赖库完整的导入到项目中，打包后的体积占用较多。

```ts
// main.ts
import { createApp } from 'vue'
import LessWriteUI from 'less-write-ui'
import 'less-write-ui/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(LessWriteUI)
app.mount('#app')
```

### 按需导入

#### 自动导入

TODO

### 手动导入

```vue
<template>
  <le-button>我是 LeButton</el-button>
</template>
<script setup>
  import { LeButton } from 'less-write-ui';
  import 'less-write-ui/syles/base.css';
  import 'less-write-ui/syles/button.css';
</script>
```

