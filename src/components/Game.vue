<template>
  <div
    class="grid"
    data-packery='{ "itemSelector": ".grid-item", "percentPosition": true }'
  >
    <div class="grid-item width3 height4">
      <div class="fill-height d-flex justify-center contains">
        <ShipBoard></ShipBoard>
      </div>
    </div>
    <div class="grid-item width2 height6">
      <CrewBoard></CrewBoard>
    </div>
    <div class="grid-item width3 height2"></div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, inject } from "vue";
import CrewBoard from "./CrewBoard.vue";
import ShipBoard from "./ShipBoard.vue";
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

<style scoped>
* {
  box-sizing: border-box;
}

/* force scrollbar, prevents initial gap */
html {
  overflow-y: scroll;
  height: 100%;
}

body {
  font-family: sans-serif;
}

.grid {
  background: #ddd;
  height: 100%;
}

/* clear fix */
.grid:after {
  content: "";
  display: block;
  clear: both;
}

/* ---- .element-item ---- */

/* 5 columns, percentage width */
.grid-item {
  float: left;
  width: 20%;
  height: calc(100vh / 6);
  background-color: #121212;
  border: 2px solid hsla(0, 0%, 0%, 0.5);
}

.width2 {
  width: 40%;
}
.height2 {
  height: calc(100vh / 3);
}

.height3 {
  height: calc(100vh / 2);
}
.width3 {
  width: 60%;
}

.height4 {
  height: calc(100vh / (6 / 4));
}
.width4 {
  width: 80%;
}

.height6 {
  height: 100vh;
}

.contains {
  overflow: hidden;
}
</style>
