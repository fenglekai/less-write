<script setup lang="ts">
import { computed, ref } from "vue";
import type { RendererElement } from "@vue/runtime-core";
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


const reset = (el: RendererElement) => {
  el.style.maxHeight = ''
  el.style.overflow = el.dataset.oldOverflow
  el.style.paddingTop = el.dataset.oldPaddingTop
  el.style.paddingBottom = el.dataset.oldPaddingBottom
}
const on = {
  beforeEnter(el: RendererElement) {
    if (!el.dataset) el.dataset = {}

    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    if (el.style.height) el.dataset.elExistsHeight = el.style.height

    el.style.maxHeight = 0
    el.style.paddingTop = 0
    el.style.paddingBottom = 0
  },

  enter(el: RendererElement) {
    requestAnimationFrame(() => {
      el.dataset.oldOverflow = el.style.overflow
      if (el.dataset.elExistsHeight) {
        el.style.maxHeight = el.dataset.elExistsHeight
      } else if (el.scrollHeight !== 0) {
        el.style.maxHeight = `${el.scrollHeight}px`
      } else {
        el.style.maxHeight = 0
      }

      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom
      el.style.overflow = 'hidden'
    })
  },

  afterEnter(el: RendererElement) {
    el.style.maxHeight = ''
    el.style.overflow = el.dataset.oldOverflow
  },

  enterCancelled(el: RendererElement) {
    reset(el)
  },

  beforeLeave(el: RendererElement) {
    if (!el.dataset) el.dataset = {}
    el.dataset.oldPaddingTop = el.style.paddingTop
    el.dataset.oldPaddingBottom = el.style.paddingBottom
    el.dataset.oldOverflow = el.style.overflow

    el.style.maxHeight = `${el.scrollHeight}px`
    el.style.overflow = 'hidden'
  },

  leave(el: RendererElement) {
    if (el.scrollHeight !== 0) {
      el.style.maxHeight = 0
      el.style.paddingTop = 0
      el.style.paddingBottom = 0
    }
  },

  afterLeave(el: RendererElement) {
    reset(el)
  },

  leaveCancelled(el: RendererElement) {
    reset(el)
  },
}
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
          <VPIconCode width="16" />
        </button>
      </div>

      <Transition name="collapse-transition" v-on="on">
        <VPSourceCode v-show="sourceVisible" :source="source" />
      </Transition>

      <Transition>
        <div
          v-show="sourceVisible"
          class="example-float-control"
          tabindex="0"
          role="button"
          @click="toggleSourceVisible(false)"
          @keydown="onSourceVisibleKeydown"
        >
          <VPCaretTop width="16" />
          <span>{{ locale["hide-source"] }}</span>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<style scoped lang="less">
.example {
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--le-border-radius-base);

  .op-btns {
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 2.5rem;
    border-top: 1px solid var(--vp-c-divider);

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
    border-top: 1px solid var(--vp-c-divider);
    height: 44px;
    box-sizing: border-box;
    background-color: var(--bg-color, #fff);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    margin-top: -1px;
    color: var(--le-text-color-secondary);
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
      color: var(--le-color-primary);
    }
  }
}

@transition-duration: 0.3s;
.v-enter-active,
.v-leave-active {
  transition: opacity @transition-duration ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.collapse-transition {
  transition: @transition-duration height ease-in-out,
    @transition-duration padding-top ease-in-out,
    @transition-duration padding-bottom ease-in-out;
}

.collapse-transition-leave-active,
.collapse-transition-enter-active {
  transition: @transition-duration max-height ease-in-out,
    @transition-duration padding-top ease-in-out,
    @transition-duration padding-bottom ease-in-out;
}
</style>
