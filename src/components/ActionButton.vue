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
import { computed } from "vue";
import useClient from "../stores/ClientState";
import MainActionPanel from "./MainActionPanel.vue";

const client = useClient();

function simpleButton(text: string, panel: string, menu: string = "") {
  return {
    disabled: client.selectedPanel == panel,
    text: text,
    click: () => client.selectPanel(panel),
    menu: menu,
  };
}

function button(
  text: string,
  panel: string,
  onClick: () => void,
  menu: string = "",
) {
  return {
    disabled: client.selectedPanel == panel,
    text: text,
    click: () => {
      onClick();
      client.selectPanel(panel);
    },
    menu: menu,
  };
}

const actionButton = computed(() => {
  let phase = client.gamestate.phase;

  // Ship Action Phase
  if ("ShipActionPhase" in phase) {
    return simpleButton("Choose Ship Action", "ship");
  }

  // Event Phase
  else if ("EventPhase" in phase) {
    if (phase.EventPhase == null) {
      return button("Draw Event Card", "event", drawEventCard);
    } else {
      return simpleButton("Choose event option", "event");
    }
  }

  // Main Action Phase
  else if ("MainActionPhase" in phase) {
    const action = phase.MainActionPhase[0];
    const actionCount = phase.MainActionPhase[1];

    if (action == null) {
      if (actionCount < 2) {
        return simpleButton("Select Main Action", "", "mainActionMenu");
      } else {
        return button("End Turn", "", endTurn);
      }
    } else if (action == "Travel") {
      return simpleButton("Select travel destination", "map");
    } else if (action == "Explore") {
      return simpleButton("Select port to explore", "map")
    }
  }

  // Challenge phase
  else if ("ChallengePhase" in phase) {
    return simpleButton("Resolve Challenge", "challenge");
  }

  // Select Crew Member phase
  else if ("SelectCrewMemberPhase" in phase) {
    let msg = {
      actionType: "selectCrewMemberAction",
      actionData: { crew_ix: null, player_ix: 0 },
    };

    return button(phase.SelectCrewMemberPhase.title, "", () => {});
    //   client.sendMessage("action", msg),
    // );
  }

  // Explore phase
  else if ("ExplorePhase" in phase) {
    return simpleButton("Explore port", "storybook")
  }

  return { disabled: true, text: "", click: () => {}, menu: "" };
});

function drawEventCard() {
  let actionMsg = {
    actionType: "handleEventPhaseAction",
    actionData: { player_ix: 0 },
  };
  client.sendMessage("action", actionMsg);
}

function endTurn() {
  let msg = {
    actionType: "selectMainAction",
    actionData: { player_ix: 0 },
  };
  client.sendMessage("action", msg);
  client.selectPanel("ship");
}
</script>
