<template>
  <v-container fluid class="fill-height">
    <v-row>
      <v-col cols="8">
        <div class="d-flex flex-column fill-height">
          <div id="debug_view" class="flex-shrink-1">
            <DebugView></DebugView>
          </div>
          <v-sheet class="mt-1 flex-grow-1 d-flex justify-end">
            <v-container>
              <v-row>
                <v-col cols="2">
                  <div class="d-flex flex-column align-center">
                    <span>Coins</span>
                    <span>{{resourceAmt("coins")}}</span>
                  </div>
                </v-col>
                <v-col cols="2">
                  <div class="d-flex flex-column align-center">
                    <span>Meat</span>
                    <span>{{resourceAmt("meat")}}</span>
                  </div>
                </v-col>
                <v-col cols="2" class="me-auto">
                  <div class="d-flex flex-column align-center">
                    <span>Grain</span>
                    <span>{{resourceAmt("grain")}}</span>
                  </div>
                </v-col>
                <v-col cols="auto">
                  <v-btn
                    class="fill-height "
                    variant="tonal"
                    @click="ctxButton.click"
                    :disabled="!ctxButton.enabled"
                    >
                    {{ ctxButton.text }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </div>
      </v-col>
      <v-col><CrewBoard></CrewBoard></v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Ref, computed, inject } from "vue";
import CrewBoard from "./CrewBoard.vue";
import DebugView from "./DebugView.vue";
import { Client, GameState } from "@/client";

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;

const ctxButton = computed(() => {
  const phase = gamestate?.value?.phase;
  const button = { enabled: false, text: "no action", click: () => {} };

  if (phase == undefined) return button;

  if ("EventPhase" in phase && phase.EventPhase == null) {
    button.enabled = true;
    button.text = "Draw Event Card";
    button.click = drawEventCardAction;
  }

  return button;
});

function resourceAmt(name: string) {
  let resources = gamestate?.value?.resources;
  if (resources == undefined) return 0;

  return resources[name];
}

function drawEventCardAction() {
  const actionMsg = {
    actionType: "handleEventPhaseAction",
    actionData: { player_ix: 0 },
  };

  client.sendMessage("action", actionMsg);
}
</script>

<style scoped>
</style>
