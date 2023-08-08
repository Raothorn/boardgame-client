<template>
  <v-sheet class="fill-height">
    <VSplit :split="70">
      <template #first>
        <v-card id="crew_card" class="fill-height w-100" border>
          <v-list class="fill-height d-flex flex-column justify-start">
            <v-list-item
              v-for="(crew_member, ix) in crew"
              @click="selectedCrewIx = ix"
            >
              <v-sheet :elevation="24" border rounded color="grey-darken-3" class="py-auto">
                <v-container fluid class="py-0">
                  <v-row class="d-flex justify-start align-center">
                    <v-col cols="4">
                      <v-card-item>
                        <h4 v-if="$vuetify.display.mdAndUp">
                          {{ crew_member.name.split(" ")[0] }}
                        </h4>
                      </v-card-item>
                    </v-col>
                    <v-divider :vertical="true"></v-divider>
                    <v-col>
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
                  </v-row>
                </v-container>
              </v-sheet>
            </v-list-item>
          </v-list>
        </v-card>
      </template>
      <template #second>
        <template v-if="selectedCrew != undefined">
          <v-card border class="w-100">
            <v-card-title class="d-flex justify-center">
              {{ selectedCrew.name }}
            </v-card-title>
            <v-card-item>
              <v-table class="rounded">
                <tbody>
                  <tr>
                    <td>Damage</td>
                    <td>{{ selectedCrew.damage }}</td>
                  </tr>
                  <tr>
                    <td>Fatigue</td>
                    <td>{{ selectedCrew.fatigue }}</td>
                  </tr>
                </tbody>
              </v-table>
            </v-card-item>
          </v-card>
        </template>
      </template>
    </VSplit>
  </v-sheet>
</template>

<script setup lang="ts">
import { Client, GameState, Crew } from "@/client";
import { Ref, computed, inject, ref } from "vue";
import SavvyIcon from "./icons/SavvyIcon.vue";
import CraftIcon from "./icons/CraftIcon.vue";
import StrengthIcon from "./icons/StrengthIcon.vue";
import PerceptionIcon from "./icons/PerceptionIcon.vue";
import WitsIcon from "./icons/WitsIcon.vue";
import { VContainer } from "vuetify/lib/components/index.mjs";
import VSplit from "./VSplit.vue";

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;

const selectedCrewIx = ref(0);

const selectedCrew = computed(() => {
  if (crew.value.length == 0) return undefined;

  return crew.value[selectedCrewIx.value];
});

const crew = computed(() => {
  if (gamestate?.value?.crew == undefined) return [];
  return gamestate?.value?.crew.map((crew) => {
    // crew.name = crew.name.split(" ")[0];
    return crew;
  });
});

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
