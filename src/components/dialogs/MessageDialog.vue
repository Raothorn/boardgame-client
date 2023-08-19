<template>
  <v-sheet>
    <v-dialog :model-value="true" width="unset" persistent>
      <v-card v-if="commandPoints != null">
        <v-card-title>
          You gained {{ commandPoints }} tokens!
        </v-card-title>
        <v-card-actions>
          <v-btn class="w-100" @click="accept">Ok</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-else-if="abilityCard != null">
        <v-card-title>
          You drew: {{ abilityCard.label }}
        </v-card-title>
        <v-card-item>
          <img
            :src="abilityCard.imgSrc"
            width="180"
          />
        </v-card-item>
        <v-card-actions>
          <v-btn class="w-100" @click="accept">Ok</v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-else-if="'DrewFate' in message">
        <v-card-title>Fate draw: ???</v-card-title>
        <v-card-actions>
          <v-btn class="w-100" @click="accept">Ok</v-btn>
        </v-card-actions>
      </v-card>

      <!-- <v-card v-else-if="'ModifierTriggered' in message" style="max-width: 300px"> -->
      <!--   <v-card-title> -->
      <!--     {{ message.ModifierTriggered.card.label }} triggered -->
      <!--   </v-card-title> -->
      <!--   <v-card-item> -->
      <!--     <div class="d-flex flex-column align-center"> -->
      <!--       <span class="text-center"> -->
      <!--         {{ message.ModifierTriggered.text }} -->
      <!--       </span> -->
      <!--       <img -->
      <!--         :src="cardImgSrc(message.ModifierTriggered.card)" -->
      <!--         width="180" -->
      <!--       /> -->
      <!--     </div> -->
      <!--   </v-card-item> -->
      <!--   <v-card-actions> -->
      <!--     <v-btn class="w-100" @click="accept">Ok</v-btn> -->
      <!--   </v-card-actions> -->
      <!-- </v-card> -->
    </v-dialog>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { useClient } from "@/stores/ClientState";
import { ClientMessage, SerialCard } from "@/client_socket";
import getAbilityCard from "@/datalookup";

const client = useClient();

const props = defineProps<{
  message: ClientMessage;
}>();

function accept() {
  // const msg = {
  //   actionType: "acceptMessageAction",
  //   actionData: { player_ix: 0 },
  // };
  //
  client.logMessage(props.message);
  // client.sendMessage("action", msg);
}

const commandPoints = computed(() => {
  if("GainedCommandPoints" in props.message)
    return props.message.GainedCommandPoints;
  else
    return null;
});

const abilityCard = computed(() => {
  if("DrewAbilityCard" in props.message) {
    const index = props.message.DrewAbilityCard
    return getAbilityCard(index);
  }
  else {
    return null;
  }
})
</script>
