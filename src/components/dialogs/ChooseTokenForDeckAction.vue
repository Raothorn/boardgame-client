<template>
  <v-card>
    <v-card-title>Choose token</v-card-title>
    <v-card-item class="d-flex justify-center">
      <v-chip-group v-model="tokenId">
        <v-chip v-for="(token, ix) in tokens" class="mx-1" :key="ix" :value="token">
          {{ token }}
        </v-chip>
      </v-chip-group>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { computed, inject, ref, Ref, watch } from "vue";
import { Client, GameState } from "@/client";

const gamestate = inject<Ref<GameState>>("state");
const tokenId = ref();
const client = inject<Client>("$client") as Client;

const tokens = computed(() => {
  let phase = gamestate?.value?.phase;
  if (
    phase == undefined ||
    typeof phase === "string" ||
    !("ShipAction" in phase) ||
    (phase.ShipAction == null) ||
    !("DeckAction" in phase.ShipAction)
  ) {
    return [];
  }

  return phase.ShipAction.DeckAction.search_tokens_drawn;
});

watch(tokenId, (newId) => {
  let actionMessage = {
    actionType: "chooseTokenForDeckAction",
    actionData: { player_ix: 0, token_id: newId }
  };

  client.sendMessage("action", actionMessage);
});

</script>

<style scoped>
/* .v-chip {
  margin-right:3px;
  margin-left: 3px;
} */
</style>
