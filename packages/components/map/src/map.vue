<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { type Fn, useDebounceFn, useEventListener } from "@vueuse/core";
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

const mapInstance = useMap(props);
const { init, destroy, zoomIn, zoomOut, resetZoom, setScale, scale } =
  mapInstance;

const autoRefresh = useDebounceFn(() => {
  if (!renderRef.value) return;
  resetZoom();
  destroy();
  init(
    {
      ctx: {
        el: renderRef.value,
        width: renderRef.value.clientWidth,
      },
      background: props.background,
      size: props.size,
      pathData: props.pathData,
      pointData: props.pointData,
      callback: (data) => {
        drawerData.value = data;
        emits("pointClick", data);
      },
    },
    () => {
      loading.value = false;
    }
  );
}, 200);

watch(
  () => [props.size, props.pathData, props.background, props.space, props.step],
  () => {
    destroy();
    loading.value = true;
    autoRefresh();
  }
);

let resizeEvent: Fn;
onMounted(async () => {
  loading.value = true;
  autoRefresh();
  useEventListener("resize", autoRefresh);
  resizeEvent = useEventListener("resize", autoRefresh);
});

onUnmounted(() => {
  destroy();
  resizeEvent();
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
