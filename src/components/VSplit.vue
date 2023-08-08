<template>
  <div class="fill-height d-flex flex-column">
    <div class="first" :class="{'flex-shrink-1': isAuto}" :style="firstStyle">
      <slot name="first"></slot>
    </div>
    <div class="second" :class="{'flex-grow-1': isAuto}" :style="secondStyle">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// ASSUMING AUTO
const props = defineProps<{split?:number}>();

const isAuto = computed(() => {
  return props.split == undefined;
});

const firstStyle = computed(() => {
  if (isAuto.value || props.split == undefined) return {};
  return { height: props.split + "%" };
});

const secondStyle = computed(() => {
  if (isAuto.value || props.split == undefined) return {};
  return { height: (100 - props.split) + "%" };
});
</script>

<style scoped>
.first {
  overflow: hidden;
}
:slotted(div) {
  height: 100%;
}
</style>
