<template>
  <v-container class="fill-height my-0">
    <v-row class="fill-height my-0">
      <v-col cols="2" class="fill-height pl-0">
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
                @click="selectTravelAction"
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
              ></v-btn>
            </template>
          </v-tooltip>
        </div>
      </v-col>
      <v-col class="fill-height py-0">
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";

const client = useClient();

function selectTravelAction() {
  let msg = {
    actionType: "selectMainAction",
    actionData: {player_ix: 0}
  };

  client.sendMessage("action", msg);
}

</script>
