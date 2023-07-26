<template>
    <v-card>
        <template v-slot:title>
            <v-select v-model="actionType" :items="['takeShipAction']">
            </v-select>
        </template>
        <template v-slot:text>
            <v-container>
                <v-row v-for="option in options">
                    <v-select
                        v-if="option.opType == 'select'"
                        v-model="actionData[option.opName]"
                        :label="option.opName"
                        :items="option.selectVals"
                    ></v-select>
                </v-row>
                <v-row>
                    <v-btn
                        variant="outlined"
                        @click="submitAction"
                        :disabled="isFormInvalid"
                        >Submit Action</v-btn
                    >
                </v-row>
            </v-container>
        </template>
    </v-card>
</template>

<script setup lang="ts">
import { Client } from "@/client";
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
    client.sendMessage(actionMessage);
}

const isFormInvalid = computed(() => {
    for (let option of options.value) {
        if (!(option.opName in actionData.value)) {
            console.log(option.opName);
            return true;
        }
    }
    return false;
});

type Option = { opName: string; opType: string; selectVals?: string[] };
const options: ComputedRef<Option[]> = computed(() => {
    switch (actionType.value) {
        case "takeShipAction":
            return [
                {
                    opName: "room",
                    opType: "select",
                    selectVals: ["Bridge", "Galley"],
                },
            ];
        default:
            return [];
    }
});
</script>
