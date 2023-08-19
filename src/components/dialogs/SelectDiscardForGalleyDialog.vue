<template>
  <v-card>
    <v-card-title class="mx-auto">Select Discard</v-card-title>
    <v-card-item>
      <div class="d-flex justify-center">
        <div v-for="(card, hand_ix) in player.hand">
          <v-sheet :border="!decline && discardIx == hand_ix" class="pa-1">
            <img
              class="mx-2"
              :src="`/assets/ability_card_deck/${card}.png`"
              width="120"
              @click="discardIx = hand_ix"
            />
          </v-sheet>
        </div>
      </div>
      <v-checkbox v-model="decline" label="decline" hide-details></v-checkbox>
      <v-btn @click="submitAction">Submit</v-btn>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";
import { computed, inject } from "vue";
import { ref } from "vue";

const client = useClient();

const discardIx = ref(0);
const playerIx = ref(0);
const decline = ref(true);

const player = computed(() => {
  return client.gamestate.players[0];
});

function selectDiscard(handIx: number) {
  if (!decline.value) discardIx.value = handIx;
}

function submitAction() {
  let actionMessage = {
    tag: "GalleyAction",
    contents: decline.value ? null : discardIx.value,
  };

  client.sendMessage(actionMessage);
}
</script>
