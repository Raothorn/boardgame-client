<template>
  <v-card class="fill-height">
    <v-card-item>
      <v-table class="rounded">
        <tbody>
          <tr v-for="(value, key) in client.gamestate">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";

const client = useClient();
</script>

<style scoped>
.v-card {
  overflow-y:scroll;
}
</style>
