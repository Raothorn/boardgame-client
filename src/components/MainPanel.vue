<template>
  <v-sheet class="fill-height">
    <v-window class="fill-height" :model-value="client.selectedPanel">
      <v-window-item class="fill-height" value="ship">
        <ShipBoard></ShipBoard>
      </v-window-item>

      <v-window-item class="fill-height" value="map">
          <Map class="fill-height"></Map>
      </v-window-item>

      <v-window-item class="fill-height" value="event">
        <SelectEventOption></SelectEventOption>
      </v-window-item>

      <v-window-item class="fill-height" value="challenge">
        <ResolveChallenge></ResolveChallenge>
      </v-window-item>

      <v-window-item class="fill-height" value="home">
        <HomePanel></HomePanel>
      </v-window-item>
    </v-window>

  </v-sheet>
</template>

<script setup lang="ts">
import ShipBoard from "./ShipBoard.vue";
import Map from './Map.vue'
import ResolveChallenge from './dialogs/ResolveChallenge.vue'
import SelectEventOption from "./dialogs/SelectEventOption.vue";
import HomePanel from './HomePanel.vue'
import { computed, watch } from "vue";
import { useClient } from "@/stores/ClientState";

const client = useClient();

// Handle general panel transitions
watch(
  () => client.gamestate.phase,
  (phase) => {
    if("EventPhase" in phase && phase.EventPhase != null) {
      client.selectPanel("event")
    }
    else if ("ChallengePhase" in phase) {
      client.selectPanel("challenge");
    }
  }
);


</script>
