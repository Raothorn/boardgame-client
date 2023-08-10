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
import { Ref, computed, inject } from "vue";
import DrawForDeckAction from "./dialogs/DrawForDeckAction.vue";
import SelectEventOption from "./dialogs/SelectEventOption.vue";
import ResolveChallenge from "./dialogs/ResolveChallenge.vue";
import MessageDialog from "./dialogs/MessageDialog.vue";
import useClient from "@/stores/ClientState";

const client = useClient();

const message = computed(() => {
  if (client.gamestate.message_queue.length == 0) {
    return null;
  } else {
    return client.gamestate.message_queue.slice(-1)[0];
  }
});

const promptComponent = computed(() => {
  const phase = client.gamestate.phase;

  if ("ShipActionPhase" in phase && phase.ShipActionPhase != null) {
    if (typeof phase.ShipActionPhase === "string") {
      if (phase.ShipActionPhase == "GalleyAction") {
        return SelectDiscardForGalleyDialog;
      }
    } else if ("DeckAction" in phase.ShipActionPhase) {
      return DrawForDeckAction;
    }
  }
  return null;
});
</script>
