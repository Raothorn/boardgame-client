<template>
  <v-card v-if="event" class="fill-height">
    <v-container class="fill-height">
      <v-row class="fill-height align-center">
        <v-col cols="8" md="6">
          <v-card-item class="d-flex justify-center">
            <img :src="`../../assets/event_deck/${event.deck_index}.png`" />
          </v-card-item>
        </v-col>
        <v-col cols="4" md="6" class="fill-height">
          <div v-if="'EventPhase' in client.gamestate.phase && event != null" class="fill-height d-flex flex-column justify-center">
            <v-btn
                @click="optionSelected(null)"
                color="primary"
                size="x-large"
                variant="tonal"
                class="my-2"
                v-if="event.options.length == 0"
              >Continue</v-btn>
            <template v-else v-for="(option, ix) in event.options">
              <v-btn
                @click="optionSelected(ix)"
                color="primary"
                size="x-large"
                class="my-2"
                variant="tonal"
              >
                <template v-if="$vuetify.display.mdAndUp">
                  {{ option.text }}
                </template>
                <template v-else>
                  Option {{ ix + 1 }}
                </template>
              </v-btn>
            </template>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { EventCard } from "@/client_socket";
import useClient from "@/stores/ClientState";
import { Ref, onMounted, ref, watch } from "vue";

const client = useClient();

const event: Ref<EventCard | null> = ref(null)

watch (
  () => client.gamestate.phase,
  (newPhase) => {
    if ("EventPhase" in newPhase) {
      event.value = newPhase.EventPhase;
      if (event.value != null) {
        client.playSound("flipcard");
      }
    }
  }
);

onMounted(() => {
  if ("EventPhase" in client.gamestate.phase) {
    event.value = client.gamestate.phase.EventPhase;
  }
});

function optionSelected(optionIx: number| null) {
  let actionMessage = {
    actionType: "selectEventOptionAction",
    actionData: { player_ix: 0, option_ix: optionIx },
  };

  client.sendMessage("action", actionMessage);
}

function drawEventCard() {
  let actionMsg = {
    actionType: "handleEventPhaseAction",
    actionData: { player_ix: 0 },
  };
  client.sendMessage("action", actionMsg);
}
</script>

<style scoped>
img {
  width: auto;
  height: 400px;
}
</style>
