<template>
  <v-card class="fill-height">
    <v-tabs v-model="tab" density="compact" fixed-tabs>
      <v-tab value="shipview">Ship</v-tab>
      <v-tab value="gamestate">Game State</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="shipview">
          <div class="window">
            <ShipBoard></ShipBoard>
          </div>
        </v-window-item>
        <v-window-item value="gamestate">
          <div class="window">
            <GameDisplay></GameDisplay>
          </div>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import ActionSelector from "./ActionSelector.vue";
import GameDisplay from "./GameDisplay.vue";
import { ref } from "vue";
import ShipBoard from "./ShipBoard.vue";

const tab = ref("shipview");
</script>

<style scoped>
.window {
  overflow-y: auto;
}
</style>
