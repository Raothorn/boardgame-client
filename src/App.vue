<template>
  <v-app>
    <v-main>
      <Dialogs :current-prompt="currentPrompt"></Dialogs>
      <v-container class="fill-height">
        <v-responsive class="fill-height">
          <v-row>
            <v-col cols="8"> <GameDisplay :gamestate="gamestate" /> </v-col>
            <v-col cols="auto">
              <ActionSelector></ActionSelector>
            </v-col>
          </v-row>
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import ActionSelector from "./components/ActionSelector.vue";
import GameDisplay from "./components/GameDisplay.vue";
import { Ref, ref } from "vue";
import { Client, GameState, PromptMsg } from "./client";
import Dialogs from "./components/Dialogs.vue";
import { provide } from "vue";

const client = inject<Client>("$client") as Client;
const gamestate: Ref<GameState | undefined> = ref();
provide("state", gamestate);

client.$onStateUpdate((newState: GameState) => {
  gamestate.value = newState;
});

const currentPrompt = computed(() => {
  if (gamestate.value?.prompt == null )  return undefined;
  return gamestate.value?.prompt;
});

</script>

<style scoped>
body {
  overflow: hidden;
  height: 100vh;
}
</style>
