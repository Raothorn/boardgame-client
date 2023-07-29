<template>
  <v-sheet>
    <v-select v-model="actionType" :items="['takeShipAction']" hide-details>
    </v-select>
    <v-list>
      <v-list-item v-for="option in options" class="my-0">
        <v-select
          v-if="option.opType == 'select'"
          v-model="actionData[option.opName]"
          :label="option.opName"
          :items="option.selectVals"
          hide-details
        ></v-select>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col>
            <v-btn
              variant="tonal"
              class="w-100"
              @click="submitAction"
              :disabled="isFormInvalid"
              >Submit Action</v-btn
            >
          </v-col>
          <v-col>
            <v-btn variant="tonal" class="w-100" @click="endTurn"
              >End Turn</v-btn
            >
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>
<script setup lang="ts">
  import { Client } from "@/client";
  import { watch } from "vue";
  import { ComputedRef, inject } from "vue";
  import { Ref, computed } from "vue";
  import { ref } from "vue";

  const client = inject<Client>("$client") as Client;
  const actionType = ref("takeShipAction");
  const actionData: Ref<Record<string, any>> = ref({});

  function submitAction() {
    actionData.value["player_ix"] = 0;

    let actionMessage = {
      actionType: actionType.value,
      actionData: actionData.value,
    };
    client.sendMessage("action", actionMessage);
  }

  function endTurn() {
    let actionMessage = {
      actionType: "endTurnAction",
      actionData: { player_ix: 0 },
    };

    client.sendMessage("action", actionMessage);
  }

  const isFormInvalid = computed(() => {
    for (let option of options.value) {
      if (!(option.opName in actionData.value)) {
        return true;
      }
    }
    return false;
  });

  watch(actionType, (_) => {
    actionData.value = {};
  });

  type Option = { opName: string; opType: string; selectVals?: string[] };
  const options: ComputedRef<Option[]> = computed(() => {
    switch (actionType.value) {
      case "takeShipAction":
        return [
          {
            opName: "room",
            opType: "select",
            selectVals: ["Bridge", "Galley", "Deck"],
          },
        ];
      default:
        return [];
    }
  });
</script>
