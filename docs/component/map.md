---
title: Slider
---

# Map 点位地图

## 基础使用

:::demo 插入图片，支持缩放、拖拽。

map/basic

:::

## 点位地图

`point-data`与`path-data`为点位、路径数据。
:::demo 配置`grid`属性为`true`启用网格。配置`operation`属性为`true`启用缩放选项。配置`space`属性为`true`启用间距比例缩放。

map/point

:::

## API

### 属性

| 属性名   | 描述                            | 类型                       | 默认 |
| ------- | ------------------------------ | -------------------------- | ---- |
| offset   | offset distance                 | ^[number]                  | 0    |
| position | position of affix               | ^[enum]`'top' \| 'bottom'` | top  |
| target   | target container (CSS selector) | ^[string]                  | —    |
| z-index  | `z-index` of affix              | ^[number]                  | 100  |

### 事件
