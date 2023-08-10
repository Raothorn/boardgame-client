<template>
  <v-card>
    <v-container class="fill-height my-0">
      <v-row class="fill-height my-0">
        <v-col>
          <v-tooltip text="Travel">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-large"
                icon="mdi-ship-wheel"
                variant="tonal"
                @click="selectTravelAction"
              ></v-btn>
            </template>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-tooltip text="Explore">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-large"
                icon="mdi-notebook"
                variant="tonal"
              ></v-btn>
            </template>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-tooltip text="Visit Port">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-large"
                icon="mdi-pier"
                variant="tonal"
              ></v-btn>
            </template>
          </v-tooltip>
        </v-col>
        <v-col>
          <v-tooltip text="Visit Market">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                size="x-large"
                icon="mdi-hand-coin"
                variant="tonal"
              ></v-btn>
            </template>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";

const client = useClient();

function selectTravelAction() {
  let msg = {
    actionType: "selectMainAction",
    actionData: { player_ix: 0 },
  };

  client.sendMessage("action", msg);
  client.selectPanel("map");
}
</script>
