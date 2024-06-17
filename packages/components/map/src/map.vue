<script lang="ts" setup>
import { onMounted, ref, onUnmounted } from "vue";
import { useDebounceFn, useResizeObserver } from "@vueuse/core";
import { type Point, useMap } from "@less-write/hooks";

export interface MapProps {
  height: number;
  background?: string;
  size?: {
    width: number;
    height: number;
  };
  loading?: boolean;
  pointList?: Point[];
  showDetail?: boolean;
}

interface MapEmits {
  (e: "updateDetail", data: any): void;
}

const COMPONENT_NAME = "LeMap";
defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps<MapProps>();

const emits = defineEmits<MapEmits>();

const mapRef = ref<HTMLElement>();
const detailData = ref<any>(null);

const { resetZoom, init, destroy } = useMap();

onMounted(async () => {
  // 自适应外部宽度变化
  useResizeObserver(
    mapRef.value,
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
</script>

<template>
  <div class="map-wrapper">
    <div v-show="!loading" id="map-container" ref="mapRef"></div>

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
