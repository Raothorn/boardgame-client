<template>
  <v-card>
    <v-card-title>Select Option</v-card-title>
    <v-list>
      <v-list-item v-for="(option, ix) in eventOptions">
        <v-btn @click=optionSelected(ix)>{{option.text}}</v-btn>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { Client, GameState } from "@/client";
import { Ref, computed, inject } from 'vue';

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;

const eventOptions = computed(() => {
  let phase = gamestate?.value.phase;
  if(phase == undefined || typeof phase === "string" || !("EventPhase" in phase)) {
    return [];
  }

  return phase.EventPhase?.options;

});

function optionSelected(optionIx: number) {
  let actionMessage = {
    actionType: "selectEventOptionAction",
    actionData: {player_ix: 0, option_ix: optionIx}
  };

  client.sendMessage("action", actionMessage);
}
</script>
