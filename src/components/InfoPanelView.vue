<template>
  <v-sheet>
    <v-container>
      <v-row>
        <v-col cols="10">
          <v-virtual-scroll class="message_scroll" :items="messageLog.messages">
            <template v-slot:default="{ item }">> {{ item }}</template>
          </v-virtual-scroll>
        </v-col>
        <v-col class="mx-auto">
          <v-btn
            class="w-100 h-100"
            @click="actionButton.click"
            variant="tonal"
            :disabled="actionButton.disabled"
            color="primary"
          >
            {{actionButton.text}}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, inject, Ref, ref } from "vue";
import { Client, GameState } from "@/client";
import useMessageLogStore from "@/stores/MessageLog";

const client = inject<Client>("$client");
const gamestate = inject<GameState>("state");
const messageLog = useMessageLogStore();

const actionButton = computed(() => {
  let button = { disabled: true, text: "", click: () => {} };

  let phase = gamestate?.value?.phase;
  if (phase != undefined && "EventPhase" in phase && phase.EventPhase == null) {
    button = { disabled: false, text: "Draw Event", click: drawEventCard}
  }

  console.log(button);
  return button;
});

function drawEventCard() {
  let actionMsg = {
    actionType: "handleEventPhaseAction",
    actionData: {},
  };
  client.sendMessage("action", actionMsg);
}
</script>

<style scoped>
.message_scroll {
  height: 26vh;
}
</style>
