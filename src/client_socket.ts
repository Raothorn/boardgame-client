import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

export class ClientSocket {
  private socket: WebSocket;
  private onStateUpdate: (gs: GameState) => void;

  constructor() {
    this.onStateUpdate = (_) => {};
    this.socket = new WebSocket("ws://localhost:2000/");

    this.socket.onopen = (_) => {
      let name = uuidv4();
      this.socket.send(name);
    };

    this.socket.onmessage = (event) => {
      let msg = JSON.parse(event.data);
      if (msg.msgType == "update") {
        this.onStateUpdate(msg.msgData);
      } else if (msg.msgType == "notify") {
        const $toast = useToast();
        $toast.warning(msg.msgData);
      }
    };
  }

  $onStateUpdate(fn: (gs: GameState) => void) {
    this.onStateUpdate = fn;
  }

  sendMessage(msgData: object) {
    let msg = JSON.stringify(msgData);
    this.socket.send(msg);
  }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default ClientSocket;

export type GameState = {
  phase: GamePhase;
  players: Player[];
  crew: Crew[];
  gameMap: GameMap;
  resources: Record<string, number>;
  room: string;
  // keywords: string[];
  message_queue: ClientMessage[];
};

export type GamePhase =
  | { StartTurnPhase: null }
  | { BridgePhase: null }
  | { DeckPhase: number[] }
  | { EventPhase: EventCard | null }
  | { ChallengePhase: { challenge: Challenge, fate: number | null } }
  | { MainActionPhase: [string | null, number] }
  | { SelectCrewMemberPhase: string }
  | { ExplorePhase: Story }
  | { ResolveEffectPhase: Effect };

export type Effect = { TakeHealthDamage: number };

export type GameMap = {
  shipArea: number;
  adjacentAreas: number[];
  adjacentPorts: number[];
  visibleAreas: number[];
  visiblePorts: number[];
  currentRegion: number;
};

export type EventCard = {
  eventName: string;
  eventOptions: string[];
  eventDeckIndex: number;
};

export type Option = [string, any[]]

export type Challenge = { skill: string, required: number }

export type Story = {
  main_text: string;
  options: StoryOption[];
};

export type StoryOption = {
  text: string;
  required_keyword: string | null;
  forbidden_keyword: string | null;
};

export type Crew = {
  crewName: string;
  fatigue: number;
  damage: number;
  skills: Record<string, number>;
  equippedAbilities: AbilityCard[];
  status: string[];
};

export type ClientMessage =
  | { GainedCommandPoints: number }
  | { DrewAbilityCard: AbilityCard }
  | { DrewFate: number }

export type SerialCard = { label: string; deck: string; index: number };

export type Player = {
  command_tokens: number;
  hand: AbilityCard[];
};

export type AbilityCard = number;

export function defaultGamestate(): GameState {
  return {
    phase: { StartTurnPhase: null },
    players: [{ command_tokens: 0, hand: [] }],
    crew: [],
    gameMap: {
      shipArea: 0,
      adjacentAreas: [],
      adjacentPorts: [],
      visibleAreas: [],
      visiblePorts: [],
      currentRegion: 0,
    },
    resources: {},
    room: "",
    message_queue: [],
  };
}
