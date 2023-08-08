import { defineStore } from 'pinia'
import { Ref, ref } from 'vue';
import { ClientMessage } from '@/client';

export const useMessageLogStore = defineStore('messageLog', () => {
  const messages: Ref<string[]> = ref([]);

  function logMessage(message: ClientMessage) {
    let msgStr;
    if ("GainCommandPoints" in message)  {
      let pts = message.GainCommandPoints.amount;
      msgStr = `You gained ${pts} command points.`;
    }
    else if("DrewAbilityCard" in message) {
      msgStr = `You drew a card.`;
    }
    if (msgStr != undefined) {
      messages.value.push(msgStr);
    }
  };

  return {messages, logMessage}
});