<template>
  <v-card>
    <v-card-title class="mx-auto">
      Distribute {{ totalDamage - damage }} health damage.
    </v-card-title>
    <v-card-item>
      <v-list>
        <v-list-item class="py-0" v-for="(crew, ix) in client.gamestate.crew">
          <v-container>
            <v-row>
              <v-col cols="1">
                {{ crewDamage[ix] }}
              </v-col>
              <v-col cols="7">
                {{ crew.name }}
              </v-col>
              <v-col cols="2">
                <v-btn
                  density="compact"
                  icon="mdi-minus"
                  @click="decreaseDamage(ix)"
                ></v-btn>
              </v-col>
              <v-col cols="2">
                <v-btn
                  density="compact"
                  icon="mdi-plus"
                  @click="increaseDamage(ix)"
                ></v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-list-item>
      </v-list>
    </v-card-item>
    <v-card-actions>
      <v-btn block variant="tonal" @click="confirm">Confirm</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";
import { computed, ref } from "vue";

const client = useClient();
const crewDamage = ref([0, 0, 0, 0, 0, 0, 0, 0]);

const damage = computed(() => {
  let total = 0;
  for (const damage of crewDamage.value) total += damage;
  return total;
});

const totalDamage = computed(() => {
  let phase = client.gamestate.phase;
  if (
    "ResolveEffectPhase" in phase &&
    "TakeHealthDamage" in phase.ResolveEffectPhase
  ) {
    return phase.ResolveEffectPhase.TakeHealthDamage;
  } else {
    return 0;
  }
});

function increaseDamage(crewIx: number) {
  if (damage.value < totalDamage.value) {
    crewDamage.value[crewIx]++;
  }
}

function decreaseDamage(crewIx: number) {
  if (crewDamage.value[crewIx] > 0) {
    crewDamage.value[crewIx]--;
  }
}

function confirm() {
  let msg = {
    actionType: "confirmHealthDistributionAction",
    actionData: { crew_damage: crewDamage.value, player_ix: 0 },
  };

  client.sendMessage("action", msg);
}
</script>

<style scoped>
.v-card {
  width: 450px;
}
</style>
