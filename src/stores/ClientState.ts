import { defineStore } from "pinia";
import { Ref, computed, ref } from "vue";
import ClientSocket, {
  ClientMessage,
  GameState,
  defaultGamestate,
} from "../client_socket";

export const useClient = defineStore("client", () => {
  // Gamestate
  const _gamestate: Ref<GameState | undefined> = ref();

  const gamestate = computed(() => {
    if (_gamestate.value == undefined) {
      return defaultGamestate();
    }
    return _gamestate.value;
  });

  // Socket connection
  const clientSocket = ref(new ClientSocket());
  clientSocket.value.$onStateUpdate((newState: GameState) => {
    _gamestate.value = newState;
  });

  function sendMessage(msgType: string, msgData: object) {
    clientSocket.value.sendMessage(msgType, msgData);
  }

  // Global UI state
  const selectedPanel = ref("main");

  // Messages
  const messages: Ref<string[]> = ref([]);
  function logMessage(message: ClientMessage) {
    let msgStr;
    if ("GainCommandPoints" in message) {
      let pts = message.GainCommandPoints.amount;
      msgStr = `You gained ${pts} command points.`;
    } else if ("DrewAbilityCard" in message) {
      msgStr = `You drew a card.`;
    }
    if (msgStr != undefined) {
      messages.value.push(msgStr);
    }
  }

  function selectPanel(panel: string) {
    selectedPanel.value = panel;
  }

  return {
    messages,
    logMessage,
    selectPanel,
    selectedPanel,
    sendMessage,
    gamestate,
  };
});

export default useClient;
