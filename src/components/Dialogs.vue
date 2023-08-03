<template>
  <template v-if="isPrompt">
    <div class="d-flex justify-center">
      <v-dialog width="unset" :model-value="isPrompt" persistent>
        <component :is="promptComponent"></component>
      </v-dialog>
    </div>
  </template>
</template>

<script setup lang="ts">
import { PromptMsg } from "@/client";
import SelectDiscardForGalleyDialog from "./dialogs/SelectDiscardForGalleyDialog.vue";
import { computed } from "vue";
import { VContainer } from "vuetify/lib/components/index.mjs";
import DrawForDeckAction from "./dialogs/DrawForDeckAction.vue";
import ChooseTokenForDeckAction from "./dialogs/ChooseTokenForDeckAction.vue";
import SelectEventOption from "./dialogs/SelectEventOption.vue";
import ResolveChallenge from "./dialogs/ResolveChallenge.vue"

const props = defineProps<{
  currentPrompt: PromptMsg | undefined;
}>();

const promptComponent = computed(() => {
  if (props.currentPrompt == null) {
    return VContainer;
  }

  switch (props.currentPrompt?.promptType) {
    case "selectDiscardForGalleyAction":
      return SelectDiscardForGalleyDialog;
    case "drawForDeckAction":
      return DrawForDeckAction;
    case "chooseTokenForDeckAction":
      return ChooseTokenForDeckAction;
    case "selectEventOption":
      return SelectEventOption;
    case "resolveChallenge":
      return ResolveChallenge;
    default:
      return VContainer;
  }
});

const isPrompt = computed(() => props.currentPrompt != undefined);
</script>
