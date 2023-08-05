<template>
  <Dialogs></Dialogs>
  <Game></Game>
</template>

<script setup lang="ts">
import { Ref, computed, inject, provide, ref } from "vue";
import { Client, GameState } from "./client";
import Dialogs from "./components/Dialogs.vue";
// import DebugView from "./components/DebugView.vue";
import Game from "./components/Game.vue";

const gamestate: Ref<GameState | undefined> = ref();
const client = inject<Client>("$client") as Client;
provide("state", gamestate);

client.$onStateUpdate((newState: GameState) => {
  gamestate.value = newState;
});
</script>

<style >
html {
  height: 100vh;
}

body {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}

#app {
  height: 100%;
}
</style>
