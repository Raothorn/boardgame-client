<template>
  <v-sheet>
    <v-container>
      <v-row>
        <v-col cols="1" class="d-flex justify-center">
          <div class="fill-height d-flex flex-column justify-space-evenly">
            <!-- <v-tooltip text="Main View"> -->
            <!--   <template v-slot:activator="{ props }"> -->
            <!--     <v-btn -->
            <!--       v-bind="props" -->
            <!--       density="compact" -->
            <!--       icon="mdi-home-circle" -->
            <!--       @click="client.selectPanel('main')" -->
            <!--     ></v-btn> -->
            <!--   </template> -->
            <!-- </v-tooltip> -->

            <v-tooltip text="Map">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  density="compact"
                  icon="mdi-map"
                  @click="client.selectPanel('map')"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-tooltip text="Ship">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  density="compact"
                  icon="mdi-sail-boat"
                  @click="client.selectPanel('ship')"
                ></v-btn>
              </template>
            </v-tooltip>

            <v-menu :close-on-content-click="false">
              <template v-slot:activator="{ props }">
                <v-btn density="compact" icon="mdi-cog" v-bind="props"></v-btn>
              </template>

              <v-card color="on-surface">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-switch
                        color="on-primary"
                        label="Debug view"
                        v-model="client.settings.debugMode"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-menu>

            <v-tooltip text="Restart">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  density="compact"
                  icon="mdi-restart"
                  @click="restart"
                ></v-btn>
              </template>
            </v-tooltip>
          </div>
        </v-col>

        <v-divider :vertical="true"></v-divider>

        <v-col cols="9">
          <v-virtual-scroll class="message_scroll" :items="client.messages">
            <template v-slot:default="{ item }">> {{ item }}</template>
          </v-virtual-scroll>
        </v-col>
        <v-col cols="2" class="mx-auto">
          <v-btn
            class="w-100 h-100"
            @click="actionButton.click"
            :disabled="actionButton.disabled"
            color="primary"
            variant="tonal"
          >
            {{ actionButton.text }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import useClient from "../stores/ClientState";
import { watch } from "vue";

const client = useClient();

const actionButton = computed(() => {
  let button = {
    disabled: false,
    text: "",
    click: () => {
      client.selectPanel("main");
    },
  };

  let phase = client.gamestate.phase;
  if ("ShipActionPhase" in phase) {
    button.text = "Choose ship action";

    button.disabled = ["main", "ship"].includes(client.selectedPanel);
  } else if ("EventPhase" in phase) {
    if (phase.EventPhase == null) {
      button.text = "Draw Event Card";

      button.click = () => {
        drawEventCard();
        client.selectPanel("main");
      };
    } else {
      button.text = "Choose event option";
      button.disabled = client.selectedPanel == "main";
    }
  } else if ("MainActionPhase" in phase) {
    if (phase.MainActionPhase.length == 0) {
      button.text = "Select main action";
      button.disabled = client.selectedPanel == "main";
    } else {
      button.text = "Select travel destination";
      button.disabled = ["main", "map"].includes(client.selectedPanel)
    }
  } else {
    button.disabled = true;
  }
  return button;
});

function restart() {
  client.sendMessage("restart", {});
  location.reload();
}

function drawEventCard() {
  let actionMsg = {
    actionType: "handleEventPhaseAction",
    actionData: { player_ix: 0 },
  };
  client.sendMessage("action", actionMsg);
}
// Watchers
</script>

<style scoped>
.message_scroll {
  /* TODO don't hardcode this (css variables not working?)*/
  height: 26vh;
}

.materialDesignButton {
  color: #000000;
  border-radius: 5px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 1.04em;
  letter-spacing: 0.05em;
  width: auto;
  transition: 0.3s;
  background-color: #bb86fc;
}

.materialDesignButton:hover {
  opacity: 0.7;
}
</style>
<style>
.v-btn__content {
  white-space: normal;
}
</style>
