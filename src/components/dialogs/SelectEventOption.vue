<template>
  <v-card v-if="event != null">
    <v-card-item class="d-flex justify-center">
      <img :src="`../../assets/event_deck/${event.deck_index}.png`"/>
    </v-card-item>
    <v-list>
      <v-list-item v-for="(option, ix) in event.options">
        <v-btn @click="optionSelected(ix)">{{ option.text }}</v-btn>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import { Client, GameState } from "@/client";
import { Ref, computed, inject } from "vue";

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;

const event = computed(() => {
  let phase = gamestate?.value.phase;
  if (phase == undefined || !("EventPhase" in phase)) {
    return null;
  }
  return phase.EventPhase;
});

function optionSelected(optionIx: number) {
  let actionMessage = {
    actionType: "selectEventOptionAction",
    actionData: { player_ix: 0, option_ix: optionIx },
  };

  client.sendMessage("action", actionMessage);
}
</script>

<style scoped>
img {
  width: auto;
  height: 400px;
}
</style>
