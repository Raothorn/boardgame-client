<template>
  <object
    id="ship_obj"
    data="assets/ship.svg"
    type="text/svg"
    @load="shipLoad"
  ></object>
  <div>
    <v-tooltip v-model="isSelectRoomPhase"  activator="parent" location="top center" origin="auto">
      Select room to perform ship action
    </v-tooltip>
  </div>
</template>

<script setup lang="ts">
import { SVG, Element } from "@svgdotjs/svg.js";
import { Ref, inject, ref } from "vue";
import { Client, GameState } from "@/client";
import { watch } from "vue";
import { computed } from "vue";

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;
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
  let phase = gamestate?.value?.phase;
  return (
    phase != undefined && "ShipAction" in phase && phase.ShipAction == null
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
    let rect = ship_svg.findOne(roomId);

    const listener = () => {
      selectRoom(roomName);
    };

    if (isPhase) {
      rect?.addClass("selectableRoom");
      rect?.node.addEventListener("click", listener);
    } else {
      rect?.removeClass("selectableRoom");
      rect?.node.replaceWith(rect?.node.cloneNode(true));
    }
  }
});

watch(
  () => gamestate?.value?.room,
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

  ship_svg = SVG(svg.querySelector("#svg48")).size("100%", "100%");

  svg_loaded.value = true;
}
</script>

