<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, useAttrs } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useMap } from "@less-write/hooks";
import { mapProps, mapEmits } from "./map";
import LeOperation from "./operation.vue";

defineOptions({
  name: "LeMap",
});

const props = defineProps(mapProps);
const emits = defineEmits(mapEmits);
const attrs = useAttrs();

const renderRef = ref<HTMLElement>();
const drawerData = ref<any>(null);
const loading = ref(false);
const collapse = ref(false);

const mapInstance = useMap();
const { init, destroy, zoomIn, zoomOut, resetZoom, setPoint, setLimit, setScale, scale } = mapInstance;

const autoRefresh = useDebounceFn(() => {
  if (!renderRef.value) return;
  resetZoom();
  destroy();
  setLimit(props.limit)
  init(
    {
      ctx: {
        el: "map-container",
        width: renderRef.value.clientWidth,
      },
      background: props.background,
      size: props.size,
      pathData: props.pathData,
      pointData: props.pointData,
      callback: (data) => {
        drawerData.value = data;
        if (attrs["pointClick"]) {
          emits("pointClick", data);
        }
      },
    },
    () => {
      loading.value = false;
    }
  );
}, 200);

watch(
  () => props.pointData,
  (newVal) => {
    setPoint(newVal)
  }
);
watch(() => props.limit, (value) => {
  setLimit(value)
})
watch(
  () => [props.size, props.pathData, props.background],
  () => {
    autoRefresh();
  }
);

onMounted(async () => {
  loading.value = true;
  autoRefresh();
  window.addEventListener("resize", autoRefresh);
});

onUnmounted(() => {
  destroy();
  window.removeEventListener("resize", autoRefresh);
});

defineExpose({
  mapInstance,
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
