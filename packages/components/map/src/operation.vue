<script lang="ts" setup>
import { ref, watch } from "vue";
import { LeButton, LeSlider } from "@less-write/components";
import { operationProps, operationEmits, UPDATE_SCALE_EVENT } from "./operation";
import { UPDATE_MODEL_EVENT } from "@less-write/constants";

defineOptions({
  name: "LeOperation",
  inheritAttrs: false,
});

const props = defineProps(operationProps);

const emits = defineEmits(operationEmits);

const showSlider = ref(false);
const scale = ref(0);
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      showSlider.value = false;
    }
  }
);
watch(
  () => props.scale,
  (val) => {
    scale.value = val as number;
  }
);

function handleManualScale() {
  showSlider.value = !showSlider.value;
}

function handleScaleChange(scale: number) {
  emits(UPDATE_SCALE_EVENT, scale);
  emits('setScale', scale);
}
</script>

<template>
  <div class="operation-wrapper">
    <div
      class="operation-default"
      :style="
        modelValue
          ? { width: '0', padding: '0', border: '0' }
          : { marginBottom: '6px' }
      "
    >
      <le-button class="button" @click="handleManualScale">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704"
          ></path>
        </svg>
      </le-button>
      <div class="slider">
        <span>{{ scale }}</span>
        <div
          class="slider-wrapper"
          :style="!showSlider ? { width: '0', height: '0' } : null"
        >
          <le-slider
            v-model="scale"
            vertical
            height=""
            :min="minScale"
            :max="maxScale"
            :step="scaleStep"
            @change="handleScaleChange"
          ></le-slider>
        </div>
      </div>
    </div>
    <div
      class="operation-default"
      :style="modelValue ? { width: '0', padding: '0', border: '0' } : null"
    >
      <le-button class="button" @click="(evt) => emits('zoomIn', evt)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
          ></path>
        </svg>
      </le-button>
      <le-button class="button" @click="(evt) => emits('zoomOut', evt)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64"
          ></path>
        </svg>
      </le-button>
      <le-button class="button" @click="(evt) => emits('resetZoom', evt)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M771.776 794.88A384 384 0 0 1 128 512h64a320 320 0 0 0 555.712 216.448H654.72a32 32 0 1 1 0-64h149.056a32 32 0 0 1 32 32v148.928a32 32 0 1 1-64 0v-50.56zM276.288 295.616h92.992a32 32 0 0 1 0 64H220.16a32 32 0 0 1-32-32V178.56a32 32 0 0 1 64 0v50.56A384 384 0 0 1 896.128 512h-64a320 320 0 0 0-555.776-216.384z"
          ></path>
        </svg>
      </le-button>
    </div>

    <le-button
      :class="[modelValue ? 'collapse' : null, 'tooltip-button button']"
      @click="emits(UPDATE_MODEL_EVENT, !modelValue)"
    >
      <svg
        :class="[modelValue ? 'arrow-right' : null]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1024 1024"
      >
        <path fill="currentColor" d="M384 192v640l384-320.064z"></path>
      </svg>
    </le-button>
  </div>
</template>
