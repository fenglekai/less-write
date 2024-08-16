<script lang="ts" setup>
import { ref } from "vue";

const tempData = ref([
  {
    x: 100,
    y: 200,
    width: 30,
    height: 30,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
    data: {
      type: "jpeg",
    },
  },
  {
    x: 100,
    y: 300,
    width: 50,
    height: 50,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
    data: {
      type: "jpeg",
    },
  },
  {
    x: 100,
    y: 400,
    width: 70,
    height: 70,
    image:
      "https://raw.githubusercontent.com/fenglekai/image-bed/master/logo.jpeg",
    data: {
      type: "jpeg",
    },
  },
]);
</script>
<template>
  <LeMap
    ref="mapRef"
    :height="850"
    :size="{ width: 1920, height: 1080 }"
    :point-list="tempData"
    background="https://raw.githubusercontent.com/fenglekai/image-bed/master/wallhaven-85128j.png"
    style="margin-top: 20px; border: 1px solid #000"
  ></LeMap>
</template>
