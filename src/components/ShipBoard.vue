<template>
  <v-sheet id="ship_board" class="d-flex flex-column justify-center fill-height">
    <div id="ship_container" style="position: relative">
      <object id="ship_obj" data="assets/ship.svg" type="text/svg" @load="shipLoad"></object>
      <v-snackbar :model-value="isStartTurnPhase" location="bottom center" origin="overlap" contained>
        Select room to perform ship action
      </v-snackbar>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";
import { SVG, Element } from "@svgdotjs/svg.js";
import { Ref, inject, ref } from "vue";
import { watch } from "vue";
import { computed } from "vue";

const client = useClient();

var ship_svg: Ref<Element | null> = ref(null);

const rooms: Record<string, string> = {
  "#bridge": "Bridge",
  "#galley": "Galley",
  "#deck": "Deck",
  "#quarters": "Quarters",
  "#sickbay": "Sickbay",
};

const isStartTurnPhase = computed(() => {
  let phase = client.gamestate.phase;
  return "StartTurnPhase" in phase;
});

function selectRoom(roomName: string) {
  let actionMessage = {
    tag: "SelectShipRoom",
    contents: roomName,
  };

  client.sendMessage(actionMessage);
}

watch([isStartTurnPhase, ship_svg], ([isPhase, _loaded]) => {
  // Force svg resize

  resize();

  if (ship_svg == undefined) return;
  for (let roomId in rooms) {
    let roomName: string = rooms[roomId];
    let rect = ship_svg.value?.findOne(roomId) as Element;
    if (!rect) break;

    if (isPhase) {
      rect?.addClass("selectableRoom");
      rect?.click(() => selectRoom(roomName));
    } else {
      rect?.removeClass("selectableRoom");
      rect?.click(null);
    }
  }
});

watch(() => client.selectedPanel, (panel) => {
  if (panel == 'ship') {
    setTimeout(() => {
      resize();
    }, 50);
  }
});

watch(
  () => client.gamestate.room,
  (_room) => paintRooms(),
);

function paintRooms() {
  if (ship_svg.value == undefined) return;
  let currentRoom = client.gamestate.room;
  console.log(currentRoom);
  for (let roomId in rooms) {
    let roomName: string = rooms[roomId];
    let rect = ship_svg.value.findOne(roomId);

    if (currentRoom == roomName) {
      rect?.addClass("selectedRoom");
    } else {
      rect?.removeClass("selectedRoom");
    }
  }
}

function shipLoad() {
  const obj = document.querySelector("#ship_obj") as any;
  const svg = obj.contentDocument as Document;

  ship_svg.value = SVG(svg.querySelector("#svg48"));
  resize();

  paintRooms();

  window.addEventListener("resize", resize);
}

function resize() {
  let height = document.getElementById("ship_board")?.offsetHeight;
  height = height == undefined ? 0 : height;

  let width = document.getElementById("ship_board")?.offsetWidth;

  width = width == undefined ? 0 : width;
  ship_svg.value?.size(width, height);
}
</script>
