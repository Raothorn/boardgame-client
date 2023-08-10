<template>
  <v-card width="400">
    <v-card-title>
      <div class="d-flex justify-space-evenly">
        <span>{{ challenge.skill }} Challenge: {{ challenge.amount }} </span>
        <span :style="{ color: totalSkill < challenge.amount ? 'red' : 'green' }">
          Total: {{ crewSkill }} +
          {{ challengePhase.added ? challengePhase.added : "?" }}
        </span>
      </div>
    </v-card-title>
    <v-card-item> </v-card-item>
    <v-card-item>
      <v-list density="compact">
        <template v-for="(crew, ix) in crew_members">
          <v-list-item v-if="crew.skill > 0">
            <v-checkbox
              v-model="selectedCrew"
              :value="ix"
              hide-details
              :disabled="challengePhase.added != null || crew.skill < 1"
              density="compact"
            >
              <template v-slot:label>
                <v-row>
                  <v-col cols="6"> {{ crew.name }} </v-col>
                  <v-spacer />
                  <v-col class="ms-auto"> {{ crew.skill }} </v-col>
                </v-row>
              </template>
            </v-checkbox>
          </v-list-item>
        </template>
      </v-list>
    </v-card-item>
    <v-card-actions>
      <v-btn v-if="!challengePhase.added" variant="tonal" width="100%" @click="resolveChallenge">
        Resolve Challenge
      </v-btn>
      <v-btn v-else variant="tonal" width="100%" @click="acceptResult">
        {{ totalSkill >= challenge.amount ? "Success!" : "Failure..." }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import useClientStore from "@/stores/ClientState";
import { Ref, computed, inject, ref } from "vue";

const client = useClientStore();
const selectedCrew = ref([]);

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

const challengePhase = computed(() => {
  let phase = client.gamestate.phase;
  if (phase == undefined || !("ChallengePhase" in phase))
    return { challenge: { skill: "noskill", amount: 0 }, added: 0 };

  return phase.ChallengePhase;
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

const totalSkill = computed(() => {
  let total = crewSkill.value;
  if (challengePhase.value.added) total += challengePhase.value.added;
  return total;
});
</script>
