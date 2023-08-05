<template>
  <v-card>
    <v-card-item>
      <v-table class="rounded">
        <tbody>
          <tr v-for="(value, key) in gamestate">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-item>
    <v-card-actions>
      <v-btn variant="tonal" class="mx-auto" @click="restart"> Restart </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { Client, GameState } from "@/client";
import { Ref, onBeforeUnmount } from "vue";
import { inject } from "vue";

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;

function restart() {
  client.sendMessage("restart", {});
}

onBeforeUnmount(restart);
</script>

<style scoped>
v-table {
  overflow: hidden;
}
</style>
