<template>
  <v-sheet id="ship_board" class="d-flex flex-column justify-center fill-height">
    <div id="ship_container" style="position: relative">
      <object
        id="ship_obj"
        data="assets/ship.svg"
        type="text/svg"
        @load="shipLoad"
      ></object>
      <v-snackbar
        :model-value="isSelectRoomPhase"
        location="bottom center"
        origin="overlap"
        contained
      >
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
const svg_loaded = ref(false);

var ship_svg: Element;

const rooms: Record<string, string> = {
  "#bridge": "Bridge",
  "#galley": "Galley",
  "#deck": "Deck",
  "#quarters": "Quarters",
  "#sickbay": "Sickbay",
};

const isSelectRoomPhase = computed(() => {
  let phase = client.gamestate.phase;
  return (
     "ShipActionPhase" in phase && phase.ShipActionPhase == null
  );
});

function selectRoom(roomName: string) {
  let actionMessage = {
    actionType: "takeShipAction",
    actionData: { room: roomName, player_ix: 0 },
  };

  client.sendMessage("action", actionMessage);
}

watch([isSelectRoomPhase, svg_loaded], ([isPhase, _loaded]) => {
  if (ship_svg == undefined) return;
  for (let roomId in rooms) {
    let roomName: string = rooms[roomId];
    let rect = ship_svg.findOne(roomId) as Element;
    if (!rect) break;

    if (isPhase) {
      rect.addClass("selectableRoom");
      rect.click(() => selectRoom(roomName));
    } else {
      rect.removeClass("selectableRoom");
      rect.click(null);
    }
  }
});

watch(
  () => client.gamestate.room,
  (newRoom) => {
    if (ship_svg == undefined || newRoom == undefined) return;

    for (let roomId in rooms) {
      let roomName: string = rooms[roomId];
      let rect = ship_svg.findOne(roomId);
      if (newRoom == roomName) {
        rect?.addClass("selectedRoom");
      } else {
        rect?.removeClass("selectedRoom");
      }
    }
  },
);

function shipLoad() {
  const obj = document.querySelector("#ship_obj") as any;
  const svg = obj.contentDocument as Document;

  ship_svg = SVG(svg.querySelector("#svg48"));
  svg_loaded.value = true;
  resize();

  function resize ()  {
    let height = document.getElementById("ship_board")?.offsetHeight;
    height = (height == undefined) ? 0 : height;

    let width = document.getElementById("ship_board")?.offsetWidth;

    width = (width == undefined) ? 0 : width;
    ship_svg.size(width, height);
  }

  window.addEventListener('resize', resize);
}
</script>
