<script lang="ts" setup>
import { operationEmits } from "./operation";

const collapse = defineModel({
  type: Boolean,
  required: true,
  default: false,
});

const emits = defineEmits(operationEmits);
</script>

<template>
  <div class="operation-wrapper">
    <div
      class="operation-default"
      :style="collapse ? { width: '0', padding: '0', border: '0' } : null"
    >
      <button class="button" @click="(evt) => emits('zoomIn', evt)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
          ></path>
        </svg>
      </button>
      <button class="button" @click="(evt) => emits('zoomOut', evt)">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            d="M128 544h768a32 32 0 1 0 0-64H128a32 32 0 0 0 0 64"
          ></path>
        </svg>
      </button>
      <button class="button" @click="(evt) => emits('resetZoom', evt)">
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
</template>
