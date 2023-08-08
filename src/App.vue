<template>
  <v-app class="fill-height">
    <Dialogs></Dialogs>
    <v-sheet class="fill-height" color="background">
      <v-sheet
        id="shipboard"
        class="left-col top-row"
        color="grey-darken-4"
        rounded
      >
        <MainPanel :panel="selectedPanel"></MainPanel>
      </v-sheet>
      <v-card id="infopanel" class="left-col bottom-row">
        <InfoPanelView @panel-selected=onPanelSelected></InfoPanelView>
      </v-card>
      <v-sheet id="crewpanel" class="right-col top-row">
        <CrewBoard></CrewBoard>
      </v-sheet>
      <v-sheet id="selectionPanel" class="right-col bottom-row">
        <SelectionInfoPanel></SelectionInfoPanel>
      </v-sheet>
    </v-sheet>
  </v-app>
</template>
<script setup lang="ts">
import { Ref, inject, ref } from "vue";
import { Client, GameState } from "./client";
import { provide } from "vue";
import SelectionInfoPanel from "./components/SelectionInfoPanel.vue";
import CrewBoard from "./components/CrewBoard.vue";
import Dialogs from "./components/Dialogs.vue";
import InfoPanelView from "./components/InfoPanelView.vue";
import MainPanel from "./components/MainPanel.vue";
import { watch } from "vue";

const client = inject<Client>("$client") as Client;
const gamestate: Ref<GameState | undefined> = ref();
const selectedPanel = ref("map");

provide("state", gamestate);

client.$onStateUpdate((newState: GameState) => {
  gamestate.value = newState;
});

function onPanelSelected(panelName: string) {
  selectedPanel.value = panelName;
  console.log(panelName)
}

watch(
  () => gamestate?.value?.phase,
  (phase) => {
    if (phase != undefined && "MainActionPhase" in phase) {
      selectedPanel.value = "main"
    }
  }
);

</script>

<style scoped>
* {
  box-sizing: border-box;
}

html {
  overflow-y: hidden;
  height: 100vh;
}

body {
  height: 100vh;
}

#shipboard,
#infopanel,
#crewpanel,
#selectionPanel {
  position: absolute;
  overflow: hidden;
}

.top-row {
  height: 70vh;
}

.bottom-row {
  top: calc(70vh + 4px);
  height: calc(30vh - 4px);
}

.left-col {
  width: 70vw;
}

.right-col {
  left: calc(70vw + 4px);
  width: calc(30vw - 4px);
}
</style>
