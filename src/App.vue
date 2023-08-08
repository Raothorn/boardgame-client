<template>
  <v-app class="fill-height">
      <v-sheet id="shipboard">
        <ShipBoard></ShipBoard>
      </v-sheet>
      <div id="infopanel">
        <InfoPanelView></InfoPanelView>
      </div>
  </v-app>
</template>
<script setup lang="ts">
import { Ref, inject, ref } from "vue";
import { Client, GameState } from "./client";
import { provide } from "vue";
import Game from "./components/Game.vue";
import ShipBoard from "./components/ShipBoard.vue";
import CrewBoard from "./components/CrewBoard.vue"
import InfoPanelView from "./components/InfoPanelView.vue";

const client = inject<Client>("$client") as Client;
const gamestate: Ref<GameState | undefined> = ref();

provide("state", gamestate);

client.$onStateUpdate((newState: GameState) => {
  gamestate.value = newState;
});

</script>

<style>
* { box-sizing: border-box; }
/* <!-- * { --> */
/* <!--   box-sizing: border-box; --> */
/* <!-- } --> */
html {
  overflow-y: hidden;
  height: 100vh;
}

body {
  height: 100vh
}

#shipboard {
  width: 75vw;
  height: 80vh;
  position: absolute;
  background-color: black;
  overflow: hidden;
}

#infopanel {
  width:75vw;
  height: 20vh;
  position: absolute;
  top: 80vh;
  overflow: hidden;
}
</style>
