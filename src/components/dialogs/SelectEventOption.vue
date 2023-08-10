<template>
  <v-card v-if="event != null" class="fill-height">
    <v-container>
      <v-row>
        <v-col>
          <v-card-item class="d-flex justify-center">
            <img :src="`../../assets/event_deck/${event.deck_index}.png`" />
          </v-card-item>
        </v-col>
        <v-col>
          <div class="fill-height d-flex flex-column justify-space-evenly">
            <template v-for="(option, ix) in event.options">
              <v-btn @click="optionSelected(ix)" color="primary" size="x-large" variant="tonal">{{ option.text }}</v-btn>
            </template>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <v-card class="fill-height d-flex justify-center align-center" v-else>
    <v-btn
      width="100"
      height="100"
      color="primary"
      variant="tonal"
      @click="drawEventCard"
    >
      Draw Card
    </v-btn>
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
  console.log("event");
  return phase.EventPhase;
});

function optionSelected(optionIx: number) {
  let actionMessage = {
    actionType: "selectEventOptionAction",
    actionData: { player_ix: 0, option_ix: optionIx },
  };

  client.sendMessage("action", actionMessage);
}

function drawEventCard() {
  let actionMsg = {
    actionType: "handleEventPhaseAction",
    actionData: { player_ix: 0 },
  };
  client.sendMessage("action", actionMsg);
}
</script>

<style scoped>
img {
  width: auto;
  height: 400px;
}
</style>
