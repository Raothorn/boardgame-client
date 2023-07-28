<template>
  <template v-if="isPrompt">
    <v-container>
      <v-row>
        <v-dialog width="unset" :model-value="isPrompt" persistent>
          <v-card>
            <v-card-title>Select discard</v-card-title>
            <v-card-item>
              <component :is="promptComponent"></component>
            </v-card-item>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </template>
</template>

<script setup lang="ts">
import { PromptMsg } from "@/client";
import SelectDiscardForGalleyDialog from "./dialogs/SelectDiscardForGalleyDialog.vue";
import { computed } from "vue";
import { VContainer } from "vuetify/lib/components/index.mjs";

const props = defineProps<{ currentPrompt: PromptMsg | null }>();

const promptComponent = computed(() => {
  if (props.currentPrompt == null) {
    return VContainer;
  }

  switch (props.currentPrompt?.promptType) {
    case "selectDiscardForGalleyAction":
      return SelectDiscardForGalleyDialog;
    default:
      return VContainer;
  }
});

function onDialogHandled() {

}

const isPrompt = computed(() => props.currentPrompt != null);

</script>