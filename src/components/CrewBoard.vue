<template>
  <v-sheet class="fill-height">
    <v-card id="crew_card" class="fill-height w-100" border>
      <v-list class="fill-height d-flex flex-column justify-start">
        <v-list-item
          v-for="(crewMember, ix) in crew"
          @click="selectedCrewIx = ix"
        >
          <v-sheet
            border
            rounded
            :color="selectCrewMemberPhase ? 'grey-darken-2' : 'grey-darken-3'"
            class="py-auto"
            :elevation="10"
            @click="clickAction(ix)"
          >
            <v-container fluid class="py-0">
              <v-row class="d-flex justify-start align-center crew-member">
                <v-col cols="2">
                  <img
                    :src="`/assets/crew_portraits/${firstName(crewMember)}.png`"
                    width="30"
                  />
                </v-col>
                <v-col cols="">
                  <v-container>
                    <v-row>
                      <div class="d-flex justify-start">
                        <template v-for="(amount, name) in crewMember.skills">
                          <span v-if="amount > 0">
                            <component
                              class="mx-1"
                              :is="skillIcon(name)"
                            ></component>
                          </span>
                          <span v-if="amount > 1">x{{ amount }}</span>
                        </template>
                      </div>
                    </v-row>
                    <v-row>
                      <div class="d-flex justify-start">
                        <v-icon
                          v-if="crewMember.status.includes('Venom')"
                          icon="mdi-water"
                          color="green-darken-4"
                        ></v-icon>
                        <v-icon
                          v-if="crewMember.status.includes('LowMorale')"
                          size="small"
                          icon="mdi-thumb-down"
                          color="red-darken-4"
                        ></v-icon>
                        <v-icon
                          v-if="crewMember.status.includes('Madness')"
                          size="small"
                          icon="mdi-debian"
                          color="purple-darken-4"
                        ></v-icon>
                      </div>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col cols="2">
                  <v-badge color="red-darken-2" :content="crewMember.damage">
                    <v-icon icon="mdi-heart" color="red-darken-4"></v-icon>
                  </v-badge>
                </v-col>
                <v-col cols="2">
                  <div class="d-flex flex-column justify-end">
                    <template v-for="card in crewMember.equippedAbilities">
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
                            :src="`/assets/ability_card_deck/${card}.png`"
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
      :model-value="selectCrewMemberPhase != null"
      location="bottom center"
      :timeout="-1"
      color="background"
      contained
    >
      <div v-if="selectCrewMemberPhase" class="d-flex justify-center">
        <span>{{ selectCrewMemberPhase }}</span>
      </div>
    </v-snackbar>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import SavvyIcon from "./icons/SavvyIcon.vue";
import CraftIcon from "./icons/CraftIcon.vue";
import StrengthIcon from "./icons/StrengthIcon.vue";
import PerceptionIcon from "./icons/PerceptionIcon.vue";
import WitsIcon from "./icons/WitsIcon.vue";
import { VContainer } from "vuetify/lib/components/index.mjs";
import useClient from "@/stores/ClientState";
import { Crew } from "@/client_socket";

const client = useClient();

const selectedCrewIx = ref(0);

const crew = computed(() => {
  return client.gamestate.crew.map((crew) => {
    return crew;
  });
});

const selectCrewMemberPhase = computed(() => {
  if ("SelectCrewMemberPhase" in client.gamestate.phase)
    return client.gamestate.phase.SelectCrewMemberPhase;
  else
    return null
  // Don't prompt anything unless messages are cleared
  // if (
  //   // client.gamestate.message_queue.length == 0 &&
  //   "SelectCrewMemberPhase" in client.gamestate.phase
});

function clickAction(ix: number) {
  if (selectCrewMemberPhase.value) {
    let msg = {
      tag: "SelectCrewMember",
      contents: ix
    };
    client.sendMessage(msg);

  } else {
    client.selectedItem = { crewIx: ix };
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

function firstName(crew: Crew) {
  return crew.crewName.split(" ")[0].toLowerCase();
}
</script>

<style scoped>
#crew_card {
  /* height: 400px; */
  overflow-y: auto;
}

.crew-member {
  min-height: 90px;
}
</style>
