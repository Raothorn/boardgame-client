import { defineStore } from "pinia";
import { Ref, computed, ref, watch } from "vue";
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

  const settings: Ref<ClientSettings> = ref(defaultSettings());

  // Socket connection
  const clientSocket = ref(new ClientSocket());
  clientSocket.value.$onStateUpdate((newState: GameState) => {
    console.log(newState);
    _gamestate.value = newState;
  });

  function sendMessage(msgData: object) {
    clientSocket.value.sendMessage(msgData);
  }

  // Global UI state
  const selectedPanel = ref("home");

  const selectedItem: Ref<Selectable> = ref({ crewIx: 0 });

  // Messages
  const messages: Ref<ClientMessage[]> = ref([]);
  function logMessage(message: ClientMessage) {
    messages.value.push(message);
  }

  function selectPanel(panel: string) {
    const panels = ["ship", "map", "event", "challenge", "home", "storybook"];
    if (panels.includes(panel)) {
      selectedPanel.value = panel;
    }
  }

  function playSound(sound: string) {
    const audio = new Audio(`/assets/audio/${sound}.mp3`);
    audio.play();
  }

  return {
    messages,
    logMessage,
    selectPanel,
    selectedPanel,
    selectedItem,
    sendMessage,
    gamestate,
    settings,
    playSound,
  };
});

export type Selectable = { crewIx: number } | null;

export type ClientSettings = {
  debugMode: boolean;
};

function defaultSettings(): ClientSettings {
  return { debugMode: false };
}

export default useClient;
