<template>
  <v-app>
    <v-main>
      <Dialogs :current-prompt="currentPrompt"></Dialogs>
      <!-- <Dialogs :promptId="prompt" @prompt-cleared="promptCleared"></Dialogs> -->
      <v-container class="fill-height">
        <v-responsive class="fill-height">
          <v-row>
            <v-col cols="8"> <GameDisplay :gamestate="gamestate" /> </v-col>
            <v-col cols="4">
              <ActionSelector></ActionSelector>
            </v-col>
          </v-row>
        </v-responsive>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { inject } from "vue";
  import ActionSelector from "./components/ActionSelector.vue";
  import GameDisplay from "./components/GameDisplay.vue";
  import { Ref, ref } from "vue";
  import { Client, PromptMsg } from "./client";
  import Dialogs from "./components/Dialogs.vue";

  const client = inject<Client>("$client") as Client;
  const gamestate: Ref<object | undefined> = ref();
  const currentPrompt = ref<PromptMsg | null>(null);

  client.$onStateUpdate((newState) => {
    gamestate.value = newState;

    // If a valid state is receieved, there should be no prompt
    currentPrompt.value = null;
  });

  client.$onPrompt((promptMsg) => {
    currentPrompt.value = promptMsg as PromptMsg;
  });
</script>

<style scoped>
  body {
    overflow: hidden;
    height: 100vh;
  }
</style>
