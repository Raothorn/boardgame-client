<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-card :elevation="5" color="grey-darken-3">
          <v-card-title>Ship</v-card-title>
          <v-card-item>
            <div class="d-flex flex-column">
              <span>Coins: {{ client.gamestate.resources["Coin"] }}</span>
              <span>Meat: {{ client.gamestate.resources["Meat"] }}</span>
              <span>Vegetables: {{ client.gamestate.resources["Veggies"] }}</span>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card :elevation="5" color="grey-darken-3">
          <v-card-title>Player</v-card-title>
          <v-card-item>
            <div class="d-flex flex-column">
              <span>Command points: {{ player.command_tokens }}</span>
            </div>
          </v-card-item>
          <v-card-item>
            <div class="d-flex justify-center">
              <div v-for="(card, hand_ix) in player.hand">
                <img
                  class="mx-2"
                  :src="abilityCardImage(card)"
                  width="120"
                />
                <v-menu activator="parent">
                  <v-list density="compact">
                    <v-list-item
                      @click="equipAbilityCard(hand_ix)"
                      >
                      Equip Card
                    </v-list-item>
                    <v-divider/>
                    <v-list-item>
                      Use Card
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </div>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import useClient from "@/stores/ClientState";
import { computed } from "vue";

const client = useClient();

const player = computed(() => {
  return client.gamestate.players[0];
});

function abilityCardImage(ix: number) {
  return `/assets/ability_card_deck/${ix}.png`;
}

function equipAbilityCard(handIx: number) {
  if ("SelectCrewMemberPhase" in client.gamestate.phase) return;

  let msg = {
    tag: "EquipAbilityCard",
    contents: handIx
  };

  client.sendMessage(msg);
}
</script>
