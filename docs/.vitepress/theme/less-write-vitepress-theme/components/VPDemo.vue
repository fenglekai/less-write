<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";
import { useToggle } from "@vueuse/core";
import VPIconCode from "./icons/VPIconCode.vue";
import VPCaretTop from "./icons/VPIconCaretTop.vue";

import VPExample from "./demo/VPExample.vue";
import VPSourceCode from "./demo/VPSourceCode.vue";

const props = defineProps<{
  demos: object;
  source: string;
  path: string;
  rawSource: string;
  description?: string;
}>();

const [sourceVisible, toggleSourceVisible] = useToggle();

const sourceCodeRef = ref<HTMLButtonElement>();
const formatPathDemos = computed(() => {
  const demos = {};

  Object.keys(props.demos).forEach((key) => {
    demos[key.replace("../examples/", "").replace(".vue", "")] =
      props.demos[key].default;
  });

  return demos;
});

const locale = computed(() => ({
  "hide-source": "隐藏代码",
  "view-source": "显示代码",
}));
const decodedDescription = computed(() =>
  decodeURIComponent(props.description!)
);

const onSourceVisibleKeydown = (e: KeyboardEvent) => {
  if (["Enter", "Space"].includes(e.code)) {
    e.preventDefault();
    toggleSourceVisible(false);
    sourceCodeRef.value?.focus();
  }
};
</script>

<template>
  <ClientOnly>
    <!-- danger here DO NOT USE INLINE SCRIPT TAG -->
    <p text="sm" v-html="decodedDescription" />

    <div class="example">
      <VPExample :file="path" :demo="formatPathDemos[path]" />

      <!-- <ElDivider class="m-0" /> -->

      <div class="op-btns">
        <button
          ref="sourceCodeRef"
          :aria-label="
            sourceVisible ? locale['hide-source'] : locale['view-source']
          "
          class="reset-btn el-icon op-btn"
          @click="toggleSourceVisible()"
        >
          <VPIconCode />
        </button>
      </div>

      <!-- <ElCollapseTransition> -->
      <VPSourceCode v-show="sourceVisible" :source="source" />
      <!-- </ElCollapseTransition> -->

      <Transition>
        <div
          v-show="sourceVisible"
          class="example-float-control"
          tabindex="0"
          role="button"
          @click="toggleSourceVisible(false)"
          @keydown="onSourceVisibleKeydown"
        >
          <VPCaretTop />
          <span>{{ locale["hide-source"] }}</span>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<style scoped lang="less">
.example {
  border: 1px solid var(--border-color);
  border-radius: var(--el-border-radius-base);

  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;

    .icon {
      &:hover {
        color: var(--text-color);
      }
    }

    .op-btn {
      margin: 0 0.5rem;
      cursor: pointer;
      color: var(--text-color-lighter);
      transition: 0.2s;

      &.github a {
        transition: 0.2s;
        color: var(--text-color-lighter);

        &:hover {
          color: var(--text-color);
        }
      }
    }
  }

  &-float-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--border-color);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--el-text-color-secondary);
    cursor: pointer;
    position: sticky;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    span {
      font-size: 14px;
      margin-left: 10px;
    }

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
