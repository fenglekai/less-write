<template>
  <div>
    <span>{{ value }}</span>
    <LeSlider v-model="value" vertical height="200px"></LeSlider>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const value = ref(0);
</script>
