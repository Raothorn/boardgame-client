<template>
  <v-card>
  </v-card>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";

const client = useClient();
</script>

<style scoped>
.v-card {
  width: 450px;
}
</style>
