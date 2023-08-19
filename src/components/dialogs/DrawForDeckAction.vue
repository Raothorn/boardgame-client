<template>
  <v-container>
    <v-card>
      <v-card-title>
        <div class="d-flex justify-center">Draw search tokens</div>
      </v-card-title>
      <v-card-item>
        <div class="d-flex justify-space-evenly">
          <template v-for="(token, ix) in tokens">
            <img :src="`/assets/search_deck/${token}.png`" width="100" @click="tokenIx = ix" />
          </template>
        </div>
      </v-card-item>
      <v-card-actions class="d-flex justify-center">
        <v-btn @click="draw" variant="tonal">Draw</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";
import { Ref, computed, inject, ref, watch } from "vue";

const client = useClient();
const tokenIx = ref();

const tokens = computed(() => {
  let phase = client.gamestate.phase;
  if ("DeckPhase" in phase) return phase.DeckPhase;
  else return [];
});

watch(tokenIx, (newId) => {
  let msg = {
    tag: "SelectSearchToken",
    contents: newId

  };

  client.sendMessage(msg);
});

function draw() {
  let msg = {
    tag: "DrawSearchToken",
    contents: {},
  };
  client.sendMessage(msg);
}
</script>
