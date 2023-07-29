<template>
  <v-card>
    <v-card-title>Select Discard</v-card-title>
    <v-card-item>
      <v-list>
        <v-text-field
          type="number"
          v-model.number="crewIx"
          label="crew_ix"
          :disabled="decline"
        ></v-text-field>
        <v-text-field
          type="number"
          v-model.number="discardIx"
          label="discard_ix"
          hide-details
          :disabled="decline"
        ></v-text-field>
        <v-checkbox v-model="decline" label="decline" hide-details></v-checkbox>
        <v-btn @click="submitAction"> Submit</v-btn>
      </v-list>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import { Client } from "@/client";
import { inject } from "vue";
import { ref } from "vue";

const client = inject<Client>("$client") as Client;

const crewIx = ref(0);
const discardIx = ref(0);
// TODO player
const playerIx = ref(0);
const decline = ref(true);

function submitAction() {
  let actionMessage = {
    actionType: "selectDiscardForGalleyAction",
    actionData: {
      crew_ix: crewIx.value,
      discard_ix: discardIx.value,
      player_ix: playerIx.value,
      decline: decline.value,
    },
  };

  client.sendMessage("action", actionMessage);
}
</script>
