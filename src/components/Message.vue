<template>
  <p v-if="'GainCommandPoints' in message">
    You gained {{ message.GainCommandPoints.amount }} tokens.
  </p>

  <p v-else-if="'DrewAbilityCard' in message">
    You drew
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <a v-bind="props" href="#" @click="client.selectPanel('home')">{{ message.DrewAbilityCard.card.label }}</a>
      </template>
      <img :src="cardImgSrc(message.DrewAbilityCard.card)" width="180" />
    </v-menu>
  </p>

  <p v-else-if="'DrewFate' in message">
    Draw fate: {{ message.DrewFate.result }}
  </p>

  <p v-else-if="'ModifierTriggered' in message">
    {{message.ModifierTriggered.text}}
    <v-menu open-on-hover>
      <template v-slot:activator="{ props }">
        <a v-bind="props" href="#">{{ message.ModifierTriggered.card.label }}</a>
      </template>
      <img :src="cardImgSrc(message.ModifierTriggered.card)" width="180" />
    </v-menu>
  </p>
</template>
<script setup lang="ts">
import { ClientMessage, SerialCard } from "@/client_socket";
import useClient from "@/stores/ClientState";
import { computed } from "vue";

const client = useClient();
const props = defineProps<{ message: ClientMessage }>();

function cardImgSrc(card: SerialCard) {
  let cardImgSrc = `/assets/${card["deck"]}/${card["index"]}.png`;
  return cardImgSrc;
}
// const labelText = computed(() => {
//   let label = props.label.slice();
//   return label.split("\[")[0];
// });
//
// const labelLink = computed(() => {
//   let label = props.label.replace(/(\r\n|\n|\r)/gm, "");
//
//   let regex = /\[[^\]]*\]/g;
//   if (regex.test(label)) {
//     let matches = label.match(regex);
//     let match = matches ? matches[0] : "";
//     let card = getCard(match);
//
//
//     return { linkText: card["label"], imgSrc: cardImgSrc };
//   }
//   else {
//     return null;
//   }
// });
//
// function getCard(card: string) {
//   // Fix string
//   card = card.slice(1, -1);
//   card = card.replaceAll("'", '"');
//   console.log(card)
//
//   console.log(JSON.parse(card))
//   return (JSON.parse(card));
// }
</script>
