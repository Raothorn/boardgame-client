<template>
  <v-container>
    <v-card>
      <v-card-title
        ><div class="d-flex justify-center">
          Draw search tokens
        </div></v-card-title
      >
      <v-card-item>
        <div class="d-flex justify-center">
          <v-chip-group v-model="tokenId">
            <v-chip
              v-for="(token, ix) in tokens"
              class="mx-1"
              :key="ix"
              :value="token"
            >
              {{ token }}
            </v-chip>
          </v-chip-group>
        </div>
      </v-card-item>
      <v-card-actions class="d-flex justify-center">
        <v-btn @click="draw" variant="tonal">Draw</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { Client, GameState } from "@/client";
import { Ref, computed, inject, ref, watch } from "vue";

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;
const tokenId = ref();

const tokens = computed(() => {
  let phase = gamestate?.value?.phase;
  if (
    phase == undefined ||
    typeof phase === "string" ||
    !("ShipActionPhase" in phase) ||
    phase.ShipActionPhase == null ||
    typeof phase.ShipActionPhase === "string" ||
    !("DeckAction" in phase.ShipActionPhase)
  ) {
    return [];
  }

  return phase.ShipActionPhase.DeckAction.search_tokens_drawn;
});

watch(tokenId, (newId) => {
  let actionMessage = {
    actionType: "chooseTokenForDeckAction",
    actionData: { player_ix: 0, token_id: newId },
  };

  client.sendMessage("action", actionMessage);
});

function draw() {
  let actionMessage = {
    actionType: "drawForDeckAction",
    actionData: { player_ix: 0 },
  };
  client.sendMessage("action", actionMessage);
}
</script>
