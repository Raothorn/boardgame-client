<template>
  <v-sheet>
    <v-virtual-scroll class="message_scroll" :items="messages">
      <template v-slot:default="{ item }">
        Item {{ item }}
      </template>
    </v-virtual-scroll>
  </v-sheet>
</template>

<script setup lang="ts">
  const messages =
  [
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'helelo',
  'test'
  ]
</script>

<style scoped>
.message_scroll {
  height: 20vh;
}
</style>
