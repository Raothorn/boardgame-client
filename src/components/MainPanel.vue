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
          <Map class="fill-height" :highlight-areas="false"></Map>
      </v-window-item>
    </v-window>

  </v-sheet>
</template>

<script setup lang="ts">
import ShipBoard from "./ShipBoard.vue";
import Map from './Map.vue'
import MainActionPanel from './MainActionPanel.vue'
import { Ref, computed, inject, watch } from "vue";
import { GameState } from "@/client";

const props = defineProps<{panel: string}>();
const gamestate = inject<Ref<GameState>>("state");

const actualPanel = computed(() => {
  let phase = gamestate?.value?.phase;
  if (props.panel == "main" && phase != undefined) {
    if ("MainActionPhase" in phase) {
      return "mainAction";
    }
    else {
      return "ship";
    }
  }
  return props.panel
});

watch(
  () => gamestate?.value?.phase,
  (phase) => {
    if (phase != undefined && "MainActionPhase" in phase) {

    }
  }
);

</script>
