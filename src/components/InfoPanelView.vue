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
          <v-btn
            class="w-100 h-100"
            @click="drawEventCard"
            variant="tonal"
            color="primary"
          >
            action
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import { inject, Ref, ref } from "vue";
import { Client, GameState } from "@/client";

const client = inject<Client>("$client") as Client;
const gamestate: Ref<GameState | undefined> = ref();

function drawEventCard() {
  let actionMsg = {
    actionType: "handleEventPhaseAction",
    actionData: {},
  };
  client.sendMessage("action", actionMsg);
}

const messages = [
"helelo", "test",
"helelo", "test",
"helelo", "test",
"helelo", "test",
"helelo", "test",
"helelo", "test",
"helelo", "test",
];
</script>

<style scoped>
.message_scroll {
  height: 26vh;
}
</style>
