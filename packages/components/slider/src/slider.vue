<script lang="ts" setup>
import { computed } from "vue";
import { sliderProps, sliderEmits } from "./slider";
import { useNamespace } from "@less-write/hooks";
import { useSlider } from "./composable";

defineOptions({
  name: "LeSlider",
});

const props = defineProps(sliderProps);

const emits = defineEmits(sliderEmits);

const ns = useNamespace("slider");

const sliderKls = computed(() => [
  ns.b(),
  ns.is("vertical", props.vertical),
]);

const { thumb, track, fill, handleThumbDown } = useSlider(props, emits);
</script>

<template>
  <div :class="sliderKls">
    <div class="slider-content" :style="height ? {height} : null">
      <div ref="thumb" class="thumb" @mousedown="handleThumbDown"></div>
      <div ref="fill" class="fill"></div>
      <div ref="track" class="runnable-track"></div>
    </div>
  </div>
</template>
