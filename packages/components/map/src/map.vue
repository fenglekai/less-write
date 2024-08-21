<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useMap } from "@less-write/hooks";
import { mapProps, mapEmits } from "./map";
import LeOperation from "./operation.vue";

defineOptions({
  name: "LeMap",
});

const props = defineProps(mapProps);
const emits = defineEmits(mapEmits);

const renderRef = ref<HTMLElement>();
const drawerData = ref<any>(null);
const loading = ref(false);
const collapse = ref(false);

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
        drawerData.value = data;
      },
    },
    () => {
      loading.value = false;
    }
  );
}, 200);

watch(
  () => [props.size, props.pointList, props.background],
  () => {
    autoRefresh();
  }
);

onMounted(async () => {
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
      <div :class="['operation', drawer ? 'operation-offset' : null]">
        <slot v-if="$slots.operation" name="operation"></slot>
        <le-operation
          v-else-if="operation && !$slots.operation"
          v-model="collapse"
          @zoom-in="zoomIn()"
          @zoom-out="zoomOut()"
          @reset-zoom="resetZoom()"
        ></le-operation>
      </div>

      <div class="map-drawer">
        <slot name="drawer" :drawer-data="drawerData"></slot>
      </div>
    </section>
  </div>
</template>
