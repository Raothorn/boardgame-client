<template>
  <v-sheet class="fill-height">
    <v-card id="crew_card" class="fill-height w-100" border>
      <v-list class="fill-height d-flex flex-column justify-start">
        <v-list-item
          v-for="(crew_member, ix) in crew"
          @click="selectedCrewIx = ix"
        >
          <v-sheet
            border
            rounded
            :color="isSelectCrewMemberPhase ? 'grey-darken-2' : 'grey-darken-3'"
            class="py-auto"
            :elevation="10"
            @click="clickAction(ix)"
          >
            <v-container fluid class="py-0">
              <v-row class="d-flex justify-start align-center">
                <v-col cols="4">
                  <v-card-item>
                    <h4>
                      {{ crew_member.name.split(" ")[0] }}
                    </h4>
                  </v-card-item>
                </v-col>
                <v-divider :vertical="true"></v-divider>
                <v-col cols="6">
                  <div class="d-flex justify-start">
                    <template v-for="(amount, name) in crew_member.skills">
                      <span v-if="amount > 0">
                        <component
                          class="mx-1"
                          :is="skillIcon(name)"
                        ></component>
                      </span>
                      <span v-if="amount > 1">x{{ amount }}</span>
                    </template>
                  </div>
                </v-col>
                <v-col cols="2">
                  <div class="d-flex justify-end">
                    <template
                      v-for="card in crew_member.equipped_ability_cards"
                    >
                      <v-menu open-on-hover open-delay="100">
                        <template v-slot:activator="{ props }">
                          <v-icon
                            icon="mdi-card"
                            v-bind="props"
                            color="blue-darken-3"
                          ></v-icon>
                        </template>
                        <v-sheet height="250" style="overflow: hidden">
                          <img
                            :src="`/assets/ability_card_deck/${card.deck_ix}.png`"
                            class="fill-height"
                          />
                        </v-sheet>
                      </v-menu>
                    </template>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-list-item>
      </v-list>
    </v-card>
    <v-snackbar
      :model-value="isSelectCrewMemberPhase"
      location="bottom center"
      :timeout="1000"
      color="background"
      contained
    >
      <div class="d-flex justify-center">
        <span>Select Crew Member</span>
      </div>
    </v-snackbar>
  </v-sheet>
</template>

<script setup lang="ts">
import { Ref, computed, inject, ref } from "vue";
import SavvyIcon from "./icons/SavvyIcon.vue";
import CraftIcon from "./icons/CraftIcon.vue";
import StrengthIcon from "./icons/StrengthIcon.vue";
import PerceptionIcon from "./icons/PerceptionIcon.vue";
import WitsIcon from "./icons/WitsIcon.vue";
import { VContainer } from "vuetify/lib/components/index.mjs";
import useClient from "@/stores/ClientState";

const client = useClient();

const selectedCrewIx = ref(0);

// const selectedCrew = computed(() => {
//   if (crew.value.length == 0) return undefined;
//
//   return crew.value[selectedCrewIx.value];
// });

const crew = computed(() => {
  return client.gamestate.crew.map((crew) => {
    // crew.name = crew.name.split(" ")[0];
    return crew;
  });
});

const isSelectCrewMemberPhase = computed(() => {
  return "SelectCrewMemberPhase" in client.gamestate.phase;
});

function clickAction(ix: number) {
  if (isSelectCrewMemberPhase.value) {
    let msg = {
      actionType: "selectCrewMemberAction",
      actionData: { crew_ix: ix, player_ix: 0 },
    };

    client.sendMessage("action", msg);
  }
}

function skillIcon(name: string) {
  if (name == "Savvy") return SavvyIcon;
  else if (name == "Craft") return CraftIcon;
  else if (name == "Perception") return PerceptionIcon;
  else if (name == "Strength") return StrengthIcon;
  else if (name == "Wits") return WitsIcon;
  else return VContainer;
}
</script>

<style scoped>
#crew_card {
  /* height: 400px; */
  overflow-y: auto;
}
</style>
