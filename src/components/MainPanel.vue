<template>
  <v-sheet class="fill-height">
    <v-window class="fill-height" :model-value="actualPanel">
      <v-window-item class="fill-height" value="ship">
        <ShipBoard></ShipBoard>
      </v-window-item>

      <v-window-item class="fill-height" value="mainAction">
        <MainActionPanel></MainActionPanel>
      </v-window-item>

      <v-window-item class="fill-height" value="map">
          <Map class="fill-height"></Map>
      </v-window-item>

      <v-window-item class="fill-height" value="event">
        <SelectEventOption></SelectEventOption>
      </v-window-item>
    </v-window>

  </v-sheet>
</template>

<script setup lang="ts">
import ShipBoard from "./ShipBoard.vue";
import Map from './Map.vue'
import MainActionPanel from './MainActionPanel.vue'
import { computed, watch } from "vue";
import { useClient } from "@/stores/ClientState";
import SelectEventOption from "./dialogs/SelectEventOption.vue";

const client = useClient();

const actualPanel = computed(() => {
  if (client.selectedPanel == "main") {
    let phase = client.gamestate.phase;
    if (!phase) return "ship"

    if ("ShipActionPhase" in phase) {
      return "ship";
    }
    else if ("EventPhase" in phase) {
      return "event";
    }
    else if ("MainActionPhase" in phase) {
      if(phase.MainActionPhase.length == 0) {
        return "mainAction";
      }
      else {
        return "map";
      }
    }
  }
  return client.selectedPanel;
})

watch(
  () => client.gamestate.phase,
  (phase) => {
    if (phase != undefined && "MainActionPhase" in phase) {

    }
  }
);

</script>
