<script lang="ts" setup>
import { onMounted, ref, onUnmounted, nextTick, watch } from "vue";
import { useDebounceFn, useResizeObserver } from "@vueuse/core";
import { useMap } from "@less-write/hooks";
import { mapProps, mapEmits } from "./map";

const COMPONENT_NAME = "LeMap";
defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps(mapProps);
const emits = defineEmits(mapEmits);

const renderRef = ref<HTMLElement>();
const detailData = ref<any>(null);

const clientWidth = ref(0);

const loading = ref(true);

const { init, destroy, zoomIn, zoomOut, resetZoom, width } = useMap();

function autoRefresh(width: number) {
  resetZoom();
  destroy();
  init(
    {
      ctx: {
        el: "map-container",
        width,
        height: props.height,
      },
      background: props.background,
      size: props.size,
      pointList: props.pointList,
      callback: (data) => {
        emits("updateDetail", data);
        detailData.value = data;
      },
    },
    () => {
      loading.value = false;
    }
  );
}

watch(
  () => [props.size, props.height, props.pointList, props.background],
  () => {
    autoRefresh(clientWidth.value);
  }
);

onMounted(async () => {
  await nextTick();
  // 自适应外部宽度变化
  useResizeObserver(
    renderRef.value,
    useDebounceFn(async (entries) => {
      // TODO 初始化会渲染两次
      // console.log('resize');
      clientWidth.value = entries[0].contentRect.width;
      autoRefresh(clientWidth.value);
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
    <div
      v-show="loading"
      :style="{ height: `${props.height}px` }"
      class="loading-wrapper"
    >
      <div class="loading"></div>
    </div>

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
