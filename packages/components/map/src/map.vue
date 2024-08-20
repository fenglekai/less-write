<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useDebounceFn } from "@vueuse/core";
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
const loading = ref(false);

const { init, destroy, zoomIn, zoomOut, resetZoom, width } = useMap();

const autoRefresh = useDebounceFn(() => {
  if (!renderRef.value) return;
  resetZoom();
  destroy();
  init(
    {
      ctx: {
        el: "map-container",
        width: renderRef.value.clientWidth,
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
}, 200);

watch(
  () => [props.size, props.height, props.pointList, props.background],
  () => {
    autoRefresh();
  }
);

onMounted(async () => {
  await nextTick();
  loading.value = true;
  autoRefresh();
  window.onresize = () => {
    autoRefresh();
  };
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
    <div v-show="loading" class="loading-wrapper">
      <div class="loading"></div>
    </div>

    <div id="map-container" ref="renderRef"></div>

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
