<template>
  <v-dialog width="auto" h-auto class="fill-height" :model-value="showDialog">
    <v-card>
      <v-card-title> {{ promptId }} </v-card-title>
      <v-card-item>
        <v-list>
          <v-list-item v-for="option in options" class="my-0">
            <v-select
              v-if="option.opType == 'select'"
              v-model="actionData[option.opName]"
              :label="option.opName"
              :items="option.selectVals"
              :disabled="actionData['decline']"
              hide-details
            ></v-select>
            <v-text-field
              v-else-if="option.opType == 'number'"
              type="number"
              v-model.number="actionData[option.opName]"
              :disabled="actionData['decline']"
              :label="option.opName"
              :rules="[rangeRule(option.min, option.max)]"
              hide-details
            >
            </v-text-field>
            <v-checkbox
              v-else-if="option.opType == 'bool'"
              v-model="actionData[option.opName]"
              :label="option.opName"
              hide-details
            >
            </v-checkbox>
          </v-list-item>
        </v-list>
      </v-card-item>
      <v-card-actions>
        <v-btn @click="submitAction"> Submit </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, inject, ref, watch } from "vue";
import { Client } from "@/client";

const props = defineProps(["promptId"]);
const emit = defineEmits(["promptCleared"]);

const client = inject<Client>("$client") as Client;
const actionData: Ref<Record<string, any>> = ref({});

function submitAction() {
  actionData.value["player_ix"] = 0;
  let actionMessage = {
    actionType: props.promptId,
    actionData: actionData.value,
  };
  client.sendMessage("action", actionMessage);
  emit("promptCleared");
}

function rangeRule(min = 0, max = 0): (x: number) => boolean {
  return (x: number) => x >= min && x <= max;
}

const showDialog = computed(() => {
  return props.promptId != "";
});

watch(
  () => props.promptId,
  () => {
    actionData.value = {};
    for (let option of options.value) {
      console.log(option.opName);
      actionData.value[option.opName] = option.default;
    }
  }
);

type Option = {
  opName: string;
  opType: string;
  default: any;
  selectVals?: string[];
  min?: number;
  max?: number;
};
const options: ComputedRef<Option[]> = computed(() => {
  switch (props.promptId) {
    case "selectDiscardForGalleyAction":
      return [
        { opName: "crew_ix", opType: "number", default: 1, min: 1, max: 8 },
        { opName: "discard_ix", opType: "number", default: 1, min: 1, max: 3 },
        { opName: "decline", opType: "bool", default: true },
      ];
    default:
      return [];
  }
});
</script>
