<template>
  <LeButton style="margin-right: 12px;" @click="handleZoomIn">放大</LeButton>
  <LeButton style="margin-right: 12px;"  @click="handleZoomOut">缩小</LeButton>
  <LeButton @click="handleResetZoom">还原</LeButton>
  当前比例: {{ mapRef?.scale }}
  <LeMap
    ref="mapRef"
    min="1"
    max="10"
    step="1"
    :size="size"
    background="https://raw.githubusercontent.com/fenglekai/image-bed/master/bloom.png"
    style="margin-top: 16px"
  ></LeMap>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { MapInstance } from "less-write-ui";

const size = { width: 1920, height: 1080 };

const mapRef = ref<MapInstance>();
const handleZoomIn = () => {
  mapRef.value?.zoomIn();
};
const handleZoomOut = () => {
  mapRef.value?.zoomOut();
};
const handleResetZoom = () => {
  mapRef.value?.resetZoom();
};
</script>
