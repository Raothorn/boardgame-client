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
                {{ challenge.skill }} Challenge: {{ crewSkill }} + {{ fate }} /
                {{ challenge.amount }}
              </span>
            </div>
          </v-card-title>
          <v-card-subtitle>
            <div v-html="challenge.label"></div>
          </v-card-subtitle>
          <v-card-item>
            <v-list>
              <template v-for="(crew, ix) in crew_members">
                <v-list-item v-if="crew.skill > 0">
                  <v-checkbox
                    v-model="selectedCrew"
                    :value="ix"
                    hide-details
                    density="compact"
                    :disabled="challengePhase.skill != null"
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
              v-if="challengePhase.skill == null"
              variant="tonal"
              color="primary"
              @click="resolveChallenge"
              size="x-large"
              class="mx-auto"
            >
              Draw Fate
            </v-btn>
            <v-btn
              v-else-if="'ChallengePhase' in client.gamestate.phase"
              variant="tonal"
              width="100%"
              @click="acceptResult"
            >
              {{ totalSkill >= challenge.amount ? "Success!" : "Failure..." }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ChallengePhase } from "@/client_socket";
import useClient from "@/stores/ClientState";
import { Ref, computed, inject, ref, watch, onMounted } from "vue";

const client = useClient();
const selectedCrew = ref([]);

const challengePhase: Ref<ChallengePhase> = ref({
  challenge: { skill: "noskill", label: "", amount: 0 },
  skill: null,
});

function resolveChallenge() {
  let actionMessage = {
    actionType: "resolveChallengeAction",
    actionData: { selected_crew: selectedCrew.value },
  };

  client.sendMessage("action", actionMessage);
}

function acceptResult() {
  let actionMessage = {
    actionType: "acceptChallengeResultAction",
    actionData: { player_ix: 0 },
  };
  client.sendMessage("action", actionMessage);
}

// Latch on to the most recent value
watch(
  () => client.gamestate.phase,
  (newPhase) => {
    if ("ChallengePhase" in newPhase) {
      challengePhase.value = newPhase.ChallengePhase;
    }
  },
);

onMounted(() => {
  if ("ChallengePhase" in client.gamestate.phase) {
    challengePhase.value = client.gamestate.phase.ChallengePhase;
  }
});

const challenge = computed(() => {
  return challengePhase.value.challenge;
});

const crew_members = computed(() => {
  let all_crew = [];
  for (let crew of client.gamestate.crew) {
    all_crew.push({
      name: crew.name,
      skill: crew.skills[challenge.value.skill],
    });
  }
  return all_crew;
});

const crewSkill = computed(() => {
  let total = 0;
  for (let crew_ix of selectedCrew.value) {
    let crew = crew_members.value[crew_ix];
    total += crew.skill;
  }
  return total;
});

// const currentSkill = computed(() => {
// })
const fate = computed(() => {
  if (challengePhase.value.skill != null) {
    return (challengePhase.value.skill - crewSkill.value).toString();
  } else {
    return "?";
  }
});

const totalSkill = computed(() => {
  if (challengePhase.value.skill) return challengePhase.value.skill;
  else return crewSkill;
});
</script>
