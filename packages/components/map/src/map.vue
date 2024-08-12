<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useDebounceFn, useResizeObserver } from "@vueuse/core";
import { useMap } from "@less-write/hooks";
import type { MapProps, MapEmits } from "./map";

const COMPONENT_NAME = "LeMap";
defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps<MapProps>();

const emits = defineEmits<MapEmits>();

const renderRef = ref<HTMLElement>();
const detailData = ref<any>(null);

const { init, destroy, zoomIn, zoomOut, resetZoom, width } = useMap();

onMounted(async () => {
  // 自适应外部宽度变化
  useResizeObserver(
    renderRef.value,
    useDebounceFn((entries) => {
      resetZoom();
      destroy();
      init({
        ctx: {
          el: "map-container",
          width: entries[0].contentRect.width,
          height: props.height,
        },
        background: props.background,
        size: props.size,
        pointList: props.pointList,
        callback: (data) => {
          emits("updateDetail", data);
          detailData.value = data;
        },
      });
    }, 200)
  );
});

onUnmounted(() => {
  destroy();
});

defineExpose({
  width,
  zoomIn,
  zoomOut,
  resetZoom,
});
</script>

<template>
  <div class="map-wrapper">
    <div v-show="!loading" id="map-container" ref="renderRef"></div>

    <section v-if="!loading">
      <div :class="['operation', showDetail ? 'operation-offset' : null]">
        <slot name="operation" :detail-data="detailData"></slot>
      </div>

      <div class="map-detail">
        <slot name="detail" :detail-data="detailData"></slot>
      </div>
    </section>
  </div>
</template>
