<template>
  <v-btn
    id="actionButton"
    class="w-100 h-100"
    @click="actionButton.click"
    :disabled="actionButton.disabled"
    color="primary"
    variant="tonal"
  >
    {{ actionButton.text }}
  </v-btn>
  <v-menu
    v-if="actionButton.menu == 'mainActionMenu'"
    activator="#actionButton"
  >
    <MainActionPanel></MainActionPanel>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useClient from "../stores/ClientState"
import MainActionPanel from './MainActionPanel.vue';


const client = useClient();

const actionButton = computed(() => {
  let button = {
    disabled: false,
    text: "",
    click: () => {},
    menu: "",
  };

  let phase = client.gamestate.phase;
  if ("ShipActionPhase" in phase) {
    button.text = "Choose ship action";
    button.disabled = client.selectedPanel == "ship";
    button.click = () => client.selectPanel("ship");
  } else if ("EventPhase" in phase) {
    if (phase.EventPhase == null) {
      button.text = "Draw Event Card";
      button.click = () => {
        drawEventCard();
        client.selectPanel("event");
      };
    } else {
      button.text = "Choose event option";
      button.disabled = client.selectedPanel == "event";
      button.click = () => client.selectPanel("event");
    }
  } else if ("MainActionPhase" in phase) {
    if (phase.MainActionPhase[0] == null) {
      if (phase.MainActionPhase[1] < 2) {
        button.text = "Select main action";
        button.disabled = client.selectedPanel == "mainAction";
        // button.click = () => client.selectPanel("mainAction");
        button.menu = "mainActionMenu";
      } else {
        button.text = "End turn";
        button.disabled = false;
        button.click = () => {
          // TODO actual end turn not other thing
          let msg = {
            actionType: "selectMainAction",
            actionData: { player_ix: 0 },
          };
          client.sendMessage("action", msg);
          client.selectPanel("ship");
        };
      }
    } else {
      button.text = "Select travel destination";
      button.disabled = client.selectedPanel == "map";
      button.click = () => {
        client.selectPanel("map");
      };
    }
  } else {
    button.disabled = true;
  }
  return button;
});

function drawEventCard() {
  let actionMsg = {
    actionType: "handleEventPhaseAction",
    actionData: { player_ix: 0 },
  };
  client.sendMessage("action", actionMsg);
}
</script>
