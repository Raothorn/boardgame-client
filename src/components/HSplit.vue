<template>
  <div class="fill-height d-flex">
    <div class="first" :style="firstStyle">
      <slot name="first"></slot>
    </div>
    <div class="second" :style="secondStyle">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{split: number}>();

const firstStyle = computed(() => {
  return { width: props.split + "%" };
});

const secondStyle = computed(() => {
  return { width: (100 - props.split) + "%" };
});
</script>

<style scoped>
:slotted(div) {
  height: 100%;
}
</style>
