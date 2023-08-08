<template>
  <v-sheet>
    <v-container>
      <v-row>
        <v-col cols="10">
          <v-virtual-scroll class="message_scroll" :items="messages">
            <template v-slot:default="{ item }">Item {{ item }}</template>
          </v-virtual-scroll>
        </v-col>
        <v-col>
          <v-btn class="w-100 h-100"> action </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
const messages = [
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "helelo",
  "test",
];
</script>

<style scoped>
.message_scroll {
  height: 26vh;
}
</style>
