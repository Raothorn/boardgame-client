<template>
  <template v-if="promptComponent != null">
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
import { GameState } from "@/client";

const gamestate = inject<Ref<GameState>>("state");

const promptComponent = computed(() => {
  const phase = gamestate?.value?.phase;

  if (phase == undefined) return null;

  if ("ShipAction" in phase && phase.ShipAction != null) {
    if (typeof phase.ShipAction === "string") {
      if (phase.ShipAction == "GalleyAction") {
        return SelectDiscardForGalleyDialog;
      }
    }
    else if ("DeckAction" in phase.ShipAction) {
      return DrawForDeckAction;
    }
  }
  else if ("EventPhase" in phase) {
    if(phase.EventPhase != null) {
      return SelectEventOption;
    }
  }
  else if("ChallengePhase" in phase) {
    return ResolveChallenge;
  }

  return null;
});
</script>
