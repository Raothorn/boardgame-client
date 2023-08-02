<template>
  <v-app>
    <v-main>
      <Dialogs :current-prompt="currentPrompt"></Dialogs>
      <v-container class="fill-height">
        <v-responsive class="fill-height">
          <v-row>
            <v-col cols="8">
              <v-card>
                <v-tabs v-model="tab">
                  <v-tab value="gamestate">Game State</v-tab>
                  <v-tab value="shipview">Ship</v-tab>
                </v-tabs>

                <v-card-text>
                  <v-window v-model="tab">
                    <v-window-item value="gamestate">
                      <GameDisplay></GameDisplay>
                    </v-window-item>
                    <v-window-item value="shipview">
                      <ShipBoard></ShipBoard>
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-card>
            </v-col>
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
import ShipBoard from "./components/ShipBoard.vue";

const client = inject<Client>("$client") as Client;
const gamestate: Ref<GameState | undefined> = ref();

const tab = ref("gamestate")

provide("state", gamestate);

client.$onStateUpdate((newState: GameState) => {
  gamestate.value = newState;
});

const currentPrompt = computed(() => {
  if (gamestate.value?.prompt == null) return undefined;
  return gamestate.value?.prompt;
});
</script>

<style scoped>
body {
  overflow: hidden;
  height: 100vh;
}
</style>
