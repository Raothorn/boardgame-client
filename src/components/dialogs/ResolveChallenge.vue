<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card
          class="fill-height d-flex flex-column justify-center align-center"
          :elevation="0"
        >
          <v-card-title>
            <div class="d-flex justify-space-between">
              <span>
                {{ testedSkill }} Challenge: {{ selectedCrewSkillTotal }} /
                {{ requiredSkill }}
              </span>
            </div>
          </v-card-title>
          <v-card-item>
            <v-list>
              <template v-for="(crew, ix) in crewMembers">
                <v-list-item v-if="crew.skill > 0">
                  <v-checkbox
                    v-model="selectedCrew"
                    :value="ix"
                    hide-details
                    density="compact"
                    >
                    <template v-slot:label>
                      {{ crew.name }} {{ crew.skill }}
                    </template>
                  </v-checkbox>
                </v-list-item>
              </template>
            </v-list>
          </v-card-item>
          <v-card-actions>
            <v-btn
              variant="tonal"
              color="primary"
              @click="resolveChallenge"
              size="x-large"
              class="mx-auto"
            >
              Draw Fate
            </v-btn>
            <v-btn
              variant="tonal"
              width="100%"
              @click="acceptResult"
            >
              <!-- {{ totalSkill >= challenge.amount ? "Success!" : "Failure..." }} -->
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Challenge } from "@/client_socket";
import useClient from "@/stores/ClientState";
import { Ref, computed, inject, ref, watch, onMounted } from "vue";

const client = useClient();
const selectedCrew = ref([]);


function resolveChallenge() {
}

function acceptResult() {
}

const challengePhase = computed(() => {
  let phase = client.gamestate.phase;
  if (phase && "ChallengePhase" in phase) {
    return phase.ChallengePhase;
  }
  else {
    let defChallenge: Challenge = { skill: "Error", required: 0 }
    let defPhase = { challenge: defChallenge, fate: null }
    return defPhase;
  }
});

const challenge = computed(() => {
  return challengePhase.value.challenge;
});

const testedSkill = computed(() => {
  return challenge.value.skill;
});

const requiredSkill = computed(() => {
  return challenge.value.required;
});

const fate = computed(() => {
  return challengePhase.value.fate;
});

const crewMembers = computed(() => {
  let all_crew = [];
  for (let crew of client.gamestate.crew) {
    all_crew.push({
      name: crew.crewName,
      skill: crew.skills[testedSkill.value],
    });
  }
  return all_crew;
});

const selectedCrewSkillTotal = computed(() => {
  let total = 0;
  for (let crew_ix of selectedCrew.value) {
    let crew = crewMembers.value[crew_ix];
    total += crew.skill;
  }
  return total;
});

</script>
