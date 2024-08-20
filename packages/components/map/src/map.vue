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
        <div v-if="!$slots.operation" class="operation-wrapper">
          <div
            class="operation-default"
            :style="collapse ? { width: '0', padding: '0', border: '0' } : null"
          >
            <button class="button" @click="zoomIn()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path
                  fill="currentColor"
                  d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
                ></path>
              </svg>
            </button>
            <button class="button" @click="zoomOut()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path
                  fill="currentColor"
                  d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64"
                ></path>
              </svg>
            </button>
            <button class="button" @click="resetZoom()">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                <path
                  fill="currentColor"
                  d="M771.776 794.88A384 384 0 0 1 128 512h64a320 320 0 0 0 555.712 216.448H654.72a32 32 0 1 1 0-64h149.056a32 32 0 0 1 32 32v148.928a32 32 0 1 1-64 0v-50.56zM276.288 295.616h92.992a32 32 0 0 1 0 64H220.16a32 32 0 0 1-32-32V178.56a32 32 0 0 1 64 0v50.56A384 384 0 0 1 896.128 512h-64a320 320 0 0 0-555.776-216.384z"
                ></path>
              </svg>
            </button>
          </div>

          <button
            :class="[collapse ? 'collapse' : null, 'tooltip-button button']"
            @click="collapse = !collapse"
          >
            <svg
              :class="[collapse ? 'arrow-right' : null]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
            >
              <path fill="currentColor" d="M384 192v640l384-320.064z"></path>
            </svg>
          </button>
        </div>
        <slot v-else name="operation" :detail-data="detailData"></slot>
      </div>

      <div class="map-detail">
        <slot name="detail" :detail-data="detailData"></slot>
      </div>
    </section>
  </div>
</template>
