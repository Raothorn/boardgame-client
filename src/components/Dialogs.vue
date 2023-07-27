<template>
  <v-dialog
    width="auto"
    persistent
    h-auto
    class="fill-height"
    :model-value="showDialog"
  >
    <v-card>
      <v-card-title> {{ promptId }} </v-card-title>
      <v-form ref="form">
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
          <v-btn block @click="submitAction"> Submit </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ComputedRef, Ref, computed, inject, ref, watch } from "vue";
import { Client } from "@/client";
import { VForm } from "vuetify/lib/components/index.mjs";

const props = defineProps(["promptId"]);
const emit = defineEmits(["promptCleared"]);

const client = inject<Client>("$client") as Client;
const actionData: Ref<Record<string, any>> = ref({});
const form = ref<VForm | null>(null);

async function submitAction() {
  const valid = await form.value?.validate();

  if (!valid?.valid) {
    return;
  }

  actionData.value["player_ix"] = 0;
  let actionMessage = {
    actionType: props.promptId,
    actionData: actionData.value,
  };
  client.sendMessage("action", actionMessage);
  emit("promptCleared");
}

function rangeRule(min = 0, max = 0) {
  return (x: number) => (x >= min && x <= max) || "Value must be in range.";
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
        { opName: "crew_ix", opType: "number", default: 0, min: 0, max: 7 },
        { opName: "discard_ix", opType: "number", default: 0, min: 0, max: 2 },
        { opName: "decline", opType: "bool", default: true },
      ];
    default:
      return [];
  }
});
</script>
