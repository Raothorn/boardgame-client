<template>
  <v-container class="fill-height my-0">
    <v-row class="fill-height my-0">
      <v-col v-if="panel=='empty'" cols="2" class="fill-height pl-0">
        <div
          class="fill-height d-flex flex-column align-center justify-space-evenly"
        >
          <v-tooltip text="Travel">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-large"
                icon="mdi-ship-wheel"
                variant="tonal"
                @click="panel='travel'"
              ></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Explore">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-large"
                icon="mdi-notebook"
                variant="tonal"
                @click="panel='empty'"
              ></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Visit Port">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-large"
                icon="mdi-pier"
                variant="tonal"
                @click="panel='empty'"
              ></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip text="Visit Market">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-large"
                icon="mdi-hand-coin"
                variant="tonal"
                @click="panel='empty'"
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </v-col>
      <v-col class="fill-height py-0">
        <v-window class="fill-height" :model-value="panel">
          <v-window-item class="fill-height" value="travel">
            <Map :highlight-areas="true"></Map>
          </v-window-item>
          <v-window-item class="fill-height" value="empty">

          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Map from "./Map.vue";

const panel = ref("empty");

</script>
