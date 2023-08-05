<template>
  <Game></Game>
</template>

<script setup lang="ts">
import { Ref, inject, ref } from "vue";
import { Client, GameState } from "./client";
import { provide } from "vue";
import Game from "./components/Game.vue";

const client = inject<Client>("$client") as Client;
const gamestate: Ref<GameState | undefined> = ref();

const tab = ref("gamestate");

provide("state", gamestate);

client.$onStateUpdate((newState: GameState) => {
  gamestate.value = newState;
});

</script>

