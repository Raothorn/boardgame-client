<template>
  <p v-if="commandPoints != null">
    You gained {{ commandPoints }} tokens.
  </p>

  <p v-else-if="abilityCard != null">
    You drew
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <a v-bind="props" href="#" @click="client.selectPanel('home')">{{ abilityCard.label }}</a>
      </template>
      <img :src="abilityCard.imgSrc" width="180" />
    </v-menu>
  </p>

  <p v-else-if="'DrewFate' in message">
    Draw fate: {{ message.DrewFate }}
  </p>

  <!-- <p v-else-if="'ModifierTriggered' in message"> -->
  <!--   {{message.ModifierTriggered.text}} -->
  <!--   <v-menu open-on-hover> -->
  <!--     <template v-slot:activator="{ props }"> -->
  <!--       <a v-bind="props" href="#">{{ message.ModifierTriggered.card.label }}</a> -->
  <!--     </template> -->
  <!--     <img :src="cardImgSrc(message.ModifierTriggered.card)" width="180" /> -->
  <!--   </v-menu> -->
  <!-- </p> -->
</template>
<script setup lang="ts">
import { ClientMessage } from "@/client_socket";
import getAbilityCard from "@/datalookup"
import useClient from "@/stores/ClientState";
import { computed } from "vue";

const client = useClient();
const props = defineProps<{ message: ClientMessage }>();

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
