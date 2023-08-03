<template>
  <v-card width="400">
    <v-card-title>
      <div class="d-flex justify-space-evenly">
        <span>{{ challenge.skill }} Challenge: {{ challenge.amount }} </span>
        <span :style="{color: totalSkill < challenge.amount ? 'red' : 'green'}">
          Total: {{ totalSkill }}
        </span>
      </div>
    </v-card-title>
    <v-card-item>
    </v-card-item>
    <v-card-item>
      <v-list>
        <v-list-item v-for="(crew, ix) in crew_members">
          <v-checkbox v-model="selectedCrew" :value="ix" hide-details>
            <template v-slot:label>
              <v-row>
                <v-col cols="6"> {{ crew.name }} </v-col>
                <v-spacer />
                <v-col class="ms-auto"> {{ crew.skill }} </v-col>
              </v-row>
            </template>
          </v-checkbox>
        </v-list-item>
      </v-list>
    </v-card-item>
    <v-card-actions >
      <v-btn variant="tonal" width="100%" @click="resolveChallenge">Resolve Challenge</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { Client, GameState } from "@/client";
import { Ref, computed, inject, ref } from 'vue';

const gamestate = inject<Ref<GameState>>("state");
const client = inject<Client>("$client") as Client;
const selectedCrew = ref([]);

function resolveChallenge() {
  let actionMessage = {
    actionType: "resolveChallengeAction",
    actionData: { selected_crew: selectedCrew.value }
  };

  client.sendMessage("action", actionMessage);
}

const challenge = computed(() => {
  let phase = gamestate?.value.phase;
  if (phase == undefined || !("ChallengePhase" in phase))
    return { skill: "noskill", amount: 0 };

  return phase.ChallengePhase
});

const crew_members = computed(() => {
  if (gamestate?.value.crew == undefined) return [];

  let all_crew = [];
  for (let crew of gamestate?.value.crew) {
    all_crew.push({ name: crew.name, skill: crew.skills[challenge.value.skill] });
  }
  return all_crew;
});

const totalSkill = computed(() => {
  let total = 0;
  for (let crew_ix of selectedCrew.value) {
    let crew = crew_members.value[crew_ix];
    total += crew.skill;
  }
  return total;
});
</script>
