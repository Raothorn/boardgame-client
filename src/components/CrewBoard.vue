<template>
  <v-sheet class="fill-height">
    <v-card id="crew_card" class="fill-height w-100" border>
      <v-list class="fill-height d-flex flex-column justify-start">
        <v-list-item
          v-for="(crew_member, ix) in crew"
          @click="selectedCrewIx = ix"
        >
          <template v-if="$vuetify.display.width > 1350">
            <v-sheet border rounded color="grey-darken-3" class="py-auto">
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
          </template>
          <template v-else>
            <v-sheet class="d-flex justify-start">
              {{ crew_member.name.split(" ")[0] }}
              <template v-for="(amount, name) in crew_member.skills">
                <span v-if="amount > 0">
                  <component class="mx-1" :is="skillIcon(name)"></component>
                </span>
                <span v-if="amount > 1">x{{ amount }}</span>
              </template>
            </v-sheet>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
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

const selectedCrew = computed(() => {
  if (crew.value.length == 0) return undefined;

  return crew.value[selectedCrewIx.value];
});

const crew = computed(() => {
  return client.gamestate.crew.map((crew) => {
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
