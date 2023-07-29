<template>
  <v-container>
    <v-card>
      <v-card-title><div class="d-flex justify-center">Draw search tokens</div></v-card-title>
      <v-card-item>
        <div class="d-flex justify-center"> {{ numTokensDrawn }}</div>
      </v-card-item>
      <v-card-actions>
          <v-btn @click="draw">Draw</v-btn>
          <v-btn @click="stopDrawing">Choose Token</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { Client, GameState } from "@/client";
import { Ref, computed, inject } from "vue";
import { deflateRaw } from "zlib";

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;

const numTokensDrawn = computed(() => {
  let phase = gamestate?.value?.phase;

  if (
    phase == undefined ||
    typeof phase === "string" ||
    phase.ShipAction == null ||
    !("DeckAction" in phase.ShipAction)
  ) {
    return 0;
  }
  return phase.ShipAction.DeckAction.search_tokens_drawn.length;
});

function stopDrawing() {
  let actionMessage = {
    actionType: "stopDrawingForDeckAction",
    actionData: { player_ix: 0 }
  };

  client.sendMessage("action", actionMessage);
}

function draw() {
  let actionMessage = {
    actionType: "drawForDeckAction",
    actionData: { player_ix: 0 }
  };
  client.sendMessage("action", actionMessage);
}

</script>
