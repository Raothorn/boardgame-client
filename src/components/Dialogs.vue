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
import { GameState } from "@/client";

const gamestate = inject<Ref<GameState>>("state");

const message = computed(() => {
  if (
    gamestate == undefined ||
    gamestate.value == undefined ||
    gamestate.value.message_queue.length == 0
  )
    return null;

  let result = gamestate.value.message_queue.pop();

  return result;
});

const promptComponent = computed(() => {
  const phase = gamestate?.value?.phase;

  if (phase == undefined || gamestate == undefined) return null;

  if ("ShipActionPhase" in phase && phase.ShipActionPhase != null) {
    if (typeof phase.ShipActionPhase === "string") {
      if (phase.ShipActionPhase == "GalleyAction") {
        return SelectDiscardForGalleyDialog;
      }
    } else if ("DeckAction" in phase.ShipActionPhase) {
      return DrawForDeckAction;
    }
  } else if ("EventPhase" in phase) {
    if (phase.EventPhase != null) {
      return SelectEventOption;
    }
  } else if ("ChallengePhase" in phase) {
    return ResolveChallenge;
  }

  return null;
});
</script>
