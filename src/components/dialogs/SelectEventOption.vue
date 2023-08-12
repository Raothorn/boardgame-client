<template>
  <v-container class="fill-height">
    <v-row class="fill-height">
      <div class="fill-height my-auto" v-if="event == null">
        <img
          class="card"
          src="/assets/event_deck/back.png"
          @click="drawEventCard"
        />
        <img
          class="deck"
          src="/assets/event_deck/back.png"
          @click="drawEventCard"
        />
      </div>
      <div class="fill-height" v-else>
        <img
          class="card_shifted"
          :src="`/assets/event_deck/${event.deck_index}.png`"
          @click="drawEventCard"
          @load="cardFlipIn()"
        />
        <div
          v-if="actualEvent"
          id="options_pane"
          class="deck fill-height d-flex flex-column justify-space-evenly"
        >
          <template v-for="(option, ix) in event.options">
            <v-btn
              @click="optionSelected(ix)"
              color="primary"
              size="x-large"
              variant="tonal"
            >
              <template v-if="$vuetify.display.mdAndUp">
                {{ option.text }}
              </template>
              <template v-else>Option {{ ix + 1 }}</template>
            </v-btn>
          </template>
        </div>
        <!-- </v-col> -->
      </div>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { EventCard } from "@/client_socket";
import useClient from "@/stores/ClientState";
import { Ref, computed, onMounted, ref, watch } from "vue";
import { gsap } from "gsap";

const client = useClient();

const event: Ref<EventCard | null> = ref(null);

// We distinguish between the "actual" event and the cached version.
// We need both.
const actualEvent = computed(() => {
  let phase = client.gamestate.phase;

  if ("EventPhase" in phase && phase.EventPhase != null) {
    return phase.EventPhase;
  } else {
    return null;
  }
});

watch(
  () => client.gamestate.phase,
  (newPhase) => {
    if ("EventPhase" in newPhase) {
      if (newPhase.EventPhase != null) {
        let tl = gsap.timeline();
        client.playSound("flipcard");
        tl.to(".card", {
          duration: 0.5,
          left: 100,
          scaleX: 0,
        });
        tl.to(".deck", {
          opacity: 0,
        });

        tl.call(() => {
          event.value = newPhase.EventPhase;
        });
      } else {
        event.value = null;
      }
    }
  },
);

function cardFlipIn() {
  console.log("flipping")
  gsap.to(".card_shifted", {
    duration: 0.5,
    scaleX: 1,
  });
}

onMounted(() => {
  if ("EventPhase" in client.gamestate.phase) {
    event.value = client.gamestate.phase.EventPhase;
  }
});

function optionSelected(optionIx: number) {
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

.card {
  position: absolute;
  right: 100px;
}

.card_shifted {
  position: absolute;
  transform: scaleX(0);
  left: 100px;
}

.deck {
  position: absolute;
  right: 100px;
}
</style>
