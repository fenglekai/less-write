---
title: Map
---

# Map 点位地图

## 基础使用

:::demo 插入图片，支持缩放、拖拽。可以通过ref获取到`zoomIn`/`zoomOut`/`resetZoom`方法。

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
| scale | 缩放比例            | ^[number]                  | 1    |
| min | 缩放最小值     | ^[number] | 1  |
| max   | 缩放最大值 | ^[number]            | 5    |
| step | 每次缩放的大小       | ^[number]                  | 0.1 |
| background | 显示背景图片 | ^[string] | — |
| grid | 显示网格背景 | ^[boolean] | false |
| size | 画布实际大小 | ^[object] `{width: number, height:number}` | — |
| operation | 操作选项，关于缩放操作 | ^[boolean] | false |
| limit | 边缘限制 | ^[boolean] | false |
| space | 缩放时形状间距 | ^[boolean] | false |
| pathData | `Line`路径数据 | ^[object] `any[]` | [] |
| pointData | `Rect/Image`点位数据 | ^[object] `any[]` | [] |

### 事件
| 事件名 | 说明                          | 类型                       |
| ------- | ------------------------------ | -------------------------- |
| pointClick | 点位点击事件     | ^[Function]                |