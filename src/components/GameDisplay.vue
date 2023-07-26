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
import { Client } from "@/client";
import { onBeforeUnmount } from "vue";
import { onMounted } from "vue";
import { inject } from "vue";

const props = defineProps(["gamestate"]);

const client = inject<Client>("$client") as Client;

function restart() {
  client.sendMessage("restart", {});
}

onBeforeUnmount(restart);
</script>
