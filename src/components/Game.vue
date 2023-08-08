<template>
  <div class="fill-height">
    <div style="max-height:60vh">
      <ShipBoard></ShipBoard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, inject } from "vue";
import CrewBoard from "./CrewBoard.vue";
import ShipBoard from "./ShipBoard.vue";
import InfoPanel from "./InfoPanelView.vue"
import HSplit from "./HSplit.vue";
import VSplit from "./VSplit.vue";
import { Client, GameState } from "@/client";
import { onMounted } from "vue";
import { Packery } from "packery";

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

onMounted(() => {
  var grid = document.querySelector(".grid");

  if (grid == null) return;

  try {
    var pckery = new Packery(grid, {
      itemSelector: ".grid-item",
      percentPosition: true,
    });
  } catch (error) {}
});

</script>

