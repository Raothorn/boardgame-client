<template>
  <v-card border v-if="selectedCrew" class="fill-height w-100">
    <v-card-title class="d-flex justify-center">
      {{ selectedCrew.crewName }}
    </v-card-title>
    <v-card-item>
      <v-table class="rounded">
        <tbody>
          <tr>
            <td>Damage</td>
            <td> {{ selectedCrew.damage }} </td>
          </tr>
          <tr>
            <td>Fatigue</td>
            <td> {{ selectedCrew.fatigue }} </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import useClient from '@/stores/ClientState';
import { computed } from 'vue';

const client = useClient();

const selectedCrew = computed(() => {
  if (client.selectedItem == null) return null;

  if ("crewIx" in client.selectedItem) {
    return client.gamestate.crew[client.selectedItem.crewIx]
  }
});
</script>
