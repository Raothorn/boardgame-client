<template>
  <v-sheet>
    <v-dialog :model-value="true" width="unset" persistent>
      <v-card>
        <v-card-title v-if="'GainCommandPoints' in message">
          You gained {{ message.GainCommandPoints.amount }} tokens!
        </v-card-title>

        <template v-else-if="'DrewAbilityCard' in message">
          <v-card-title>
            You drew: {{ message.DrewAbilityCard.card.name }}
          </v-card-title>
          <v-card-item>
            <img
              :src="`../../assets/ability_card_deck/${message.DrewAbilityCard.card.deck_ix}.png`"
              width="180"
            />
          </v-card-item>
        </template>

        <template v-else-if="'DrewFate' in message">
          <v-card-title>
            Fate draw: {{ message.DrewFate.result }}
          </v-card-title>
        </template>

        <v-card-actions>
          <v-btn class="w-100" @click="accept">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useClient } from "@/stores/ClientState";
import { ClientMessage } from "@/client_socket";

const client = useClient();

const props = defineProps<{
  message: ClientMessage;
}>();

function accept() {
  const msg = {
    actionType: "acceptMessageAction",
    actionData: { player_ix: 0 },
  };

  client.logMessage(props.message);
  client.sendMessage("action", msg);
}
</script>
