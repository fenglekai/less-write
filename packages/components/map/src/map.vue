<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useDebounceFn, useResizeObserver } from "@vueuse/core";
import { LeOperation } from "@less-write/components";
import { useMap } from "./composable";
import { mapProps, mapEmits } from "./map";

defineOptions({
  name: "LeMap",
});

const props = defineProps(mapProps);
const emits = defineEmits(mapEmits);

const wrapperRef = ref<HTMLDivElement | null>(null);
const renderRef = ref<HTMLDivElement | null>(null);
const drawerData = ref<any>(null);
const loading = ref(false);
const collapse = ref(false);
const currentWrapperWidth = ref(0);

const mapInstance = useMap(props, emits);
const { init, destroy, zoomIn, zoomOut, resetZoom, setScale, scale } =
  mapInstance;

const reload = useDebounceFn((width: number) => {
  if (!renderRef.value) return;
  resetZoom();
  destroy();
  init(
    {
      ctx: {
        el: renderRef.value,
        width,
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
}, 200);

const { stop } = useResizeObserver(wrapperRef, (entries) => {
  const [entry] = entries;
  const { width } = entry.contentRect;
  if (currentWrapperWidth.value !== width) {
    reload(width);
  }

  currentWrapperWidth.value = width;
});

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
    loading.value = true;
    destroy();
    if (!wrapperRef.value) return;
    reload(wrapperRef.value.clientWidth);
  }
);

onMounted(() => {
  loading.value = true;
});

onUnmounted(() => {
  destroy();
  stop();
});

defineExpose({
  ...mapInstance,
  reload,
});
</script>

<template>
  <div class="map-wrapper" ref="wrapperRef">
    <div v-if="loading" class="loading-wrapper">
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
