<template>
  <MessageDialog v-if="message" :message="message"></MessageDialog>
  <template v-else-if="promptComponent != null">
    <div class="d-flex justify-center">
      <v-dialog width="unset" :model-value="promptComponent != null" persistent>
        <component :is="promptComponent"></component>
      </v-dialog>
    </div>
  </template>
</template>

<script setup lang="ts">
import SelectDiscardForGalleyDialog from "./dialogs/SelectDiscardForGalleyDialog.vue";
import { computed } from "vue";
import DrawForDeckAction from "./dialogs/DrawForDeckAction.vue";
import DistributeHealthDamage from "./dialogs/DistributeHealthDamage.vue"
import TakeStatus from "./dialogs/TakeStatus.vue";
import MessageDialog from "./dialogs/MessageDialog.vue";
import useClient from "@/stores/ClientState";
import { VBtn } from "vuetify/lib/components/index.mjs";

const client = useClient();

const message = computed(() => {
  // Quiet notifications
  if (client.gamestate.message_queue.length == 0) {
    return null;
  } else {
    let processed = client.messages.length;
    let message = client.gamestate.message_queue[processed];
    return message;
  }
});

const promptComponent = computed(() => {
  const phase = client.gamestate.phase;

  if ("GalleyPhase" in phase) {
    return SelectDiscardForGalleyDialog;
  }
  else if ("DeckPhase" in phase) {
    return DrawForDeckAction;
  }

  // if ("ShipActionPhase" in phase && phase.ShipActionPhase != null) {
  //   if (typeof phase.ShipActionPhase === "string") {
  //     if (phase.ShipActionPhase == "GalleyAction") {
  //       return SelectDiscardForGalleyDialog;
  //     }
  //   } else if ("DeckAction" in phase.ShipActionPhase) {
  //     return DrawForDeckAction;
  //   }
  // }
  if ("ResolveEffectPhase" in phase) {
    if ("TakeHealthDamage" in phase.ResolveEffectPhase) {
      return DistributeHealthDamage;
    }
    else if ("TakeStatus" in phase.ResolveEffectPhase) {
      return TakeStatus;
    }
    else {
      console.log("implement dialog");
      return VBtn;
    }
  }
  return null;
});
</script>
