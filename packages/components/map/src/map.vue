<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useResizeObserver } from "@vueuse/core";
import { LeOperation } from "@less-write/components";
import { useMap } from "./composable";
import { mapProps, mapEmits } from "./map";

defineOptions({
  name: "LeMap",
});

const props = defineProps(mapProps);
const emits = defineEmits(mapEmits);

const renderRef = ref<HTMLDivElement>();
const drawerData = ref<any>(null);
const loading = ref(false);
const collapse = ref(false);

const mapInstance = useMap(props, emits);
const { init, destroy, zoomIn, zoomOut, resetZoom, setScale, scale } =
  mapInstance;

const autoRefresh = (width: number) => {
  if (!renderRef.value) return;
  resetZoom();
  destroy();
  init(
    {
      ctx: {
        el: renderRef.value,
        width: width,
      },
      background: props.background,
      grid: props.grid,
      size: props.size,
      pathData: props.pathData,
      pointData: props.pointData,
    },
    () => {
      loading.value = false;
    }
  );
};

watch(
  () => [
    props.size,
    props.pathData,
    props.background,
    props.grid,
    props.space,
    props.step,
  ],
  () => {
    destroy();
    loading.value = true;
    if (renderRef.value) {
      autoRefresh(renderRef.value.clientWidth);
    }
  }
);

onMounted(async () => {
  loading.value = true;
  useResizeObserver(renderRef, (entries) => {
    const entry = entries[0];
    const { width } = entry.contentRect;
    autoRefresh(width);
  });
});

onUnmounted(() => {
  destroy();
});

defineExpose({
  ...mapInstance,
});
</script>

<template>
  <div class="map-wrapper">
    <div v-show="loading" class="loading-wrapper">
      <div class="loading"></div>
    </div>

    <div id="map-container" ref="renderRef"></div>

    <section v-if="!loading">
      <div :class="['operation', drawer ? 'operation-offset' : null]">
        <slot v-if="$slots.operation" name="operation"></slot>
        <le-operation
          v-else-if="operation && !$slots.operation"
          v-model="collapse"
          :scale="scale"
          :min-scale="min"
          :max-scale="max"
          :scale-step="step"
          @zoom-in="zoomIn()"
          @zoom-out="zoomOut()"
          @reset-zoom="resetZoom()"
          @set-scale="setScale"
        ></le-operation>
      </div>

      <div class="map-drawer">
        <slot name="drawer" :drawer-data="drawerData"></slot>
      </div>
    </section>
  </div>
</template>
