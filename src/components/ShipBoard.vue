<template>
  <object
    id="ship_obj"
    data="assets/ship.svg"
    type="text/svg"
    @load="shipLoad"
  ></object>
</template>

<script setup lang="ts">
import { SVG, Element } from "@svgdotjs/svg.js";
import { Ref, inject, onMounted } from "vue";
import { Color } from "@svgdotjs/svg.js";
import { Client, GamePhase, GameState } from "@/client";
import { watch } from "vue";

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;
var ship_svg: Element;

const rooms: Record<string, string> = {
  "#bridgeRect": "Bridge",
  "#galleyRect": "Galley",
  "#deckRect": "Deck",
};

function selectRoom(roomName: string) {
  let actionMessage = {
    actionType: "takeShipAction",
    actionData: {room: roomName, player_ix: 0}
  };

  client.sendMessage("action", actionMessage);
}

function updatePhase(newPhase: GamePhase) {
  for (let roomId in rooms) {
    let roomName:string = rooms[roomId];
    let rect = ship_svg.findOne(roomId);

    let listener = (e) => {
      selectRoom(roomName);
    };

    if ("ShipAction" in newPhase && newPhase.ShipAction == null) {
      rect?.addClass("selectableRoom");
      rect?.node.addEventListener("click", listener);
    }
    else {
      rect?.removeClass("selectableRoom");
      rect?.node.removeEventListener("click", listener);
    }
  }
}


function updateRooms(newRoom: string) {
    if (ship_svg == undefined) return;

    for (let roomId in rooms) {
      let roomName:string = rooms[roomId];
      let rect = ship_svg.findOne(roomId);
      if(newRoom == roomName) {
        rect?.addClass("selectedRoom");
      }
      else {
        rect?.removeClass("selectedRoom");
      }
    }
}

watch(
  () => gamestate?.value?.phase,
  (newPhase) => {
    if (newPhase != undefined)
      updatePhase(newPhase);
  }
);

watch(
  () => gamestate?.value?.room,
  (room) => {
    if (room) updateRooms(room);
  }
);

function shipLoad() {
  const obj = document.querySelector("#ship_obj") as any;
  const svg = obj.contentDocument as Document;

  ship_svg = SVG(svg.querySelector("#svg48"));

  if (gamestate != undefined) {
    updateRooms(gamestate?.value?.room);
    updatePhase(gamestate?.value?.phase);
  }
}
</script>
