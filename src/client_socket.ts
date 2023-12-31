import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

export class ClientSocket {
  private socket: WebSocket;
  private onStateUpdate: (gs: GameState) => void;

  constructor() {
    this.onStateUpdate = (_) => {};
    this.socket = new WebSocket("ws://localhost:2000/");

    this.socket.onopen = (_) => {
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

  sendMessage(msgType: string, msgData: object) {
    let msgObj = { msgType: msgType, msgData: msgData };
    let msg = JSON.stringify(msgObj);
    this.socket.send(msg);
  }
}

export default ClientSocket;

export type GameState = {
  phase: GamePhase;
  players: any[];
  crew: Crew[];
  map: {
    ship_area: number;
    adjacent_areas: number[];
    visible_areas: number[];
    current_region: number;
  };
  resources: Record<string, number>;
  room: string;
  message_queue: ClientMessage[];
};

export type GamePhase =
  | { ShipActionPhase: ShipActionSubphase | null }
  | { EventPhase: EventCard | null }
  | { ChallengePhase: { challenge: Challenge; added: number | null } }
  | { MainActionPhase: any[] };

export type ShipActionSubphase = {
  DeckAction: { search_tokens_drawn: number[] };
};

export type EventCard = {
  name: string;
  options: EventOption[];
  deck_index: number;
};

export type EventOption = { text: string };

export type Challenge = { skill: string; amount: number };

export type Crew = {
  name: string;
  fatigue: number;
  damage: number;
  skills: Record<string, number>;
};

export type ClientMessage =
  | { GainCommandPoints: { amount: number } }
  | { DrewAbilityCard: { card: AbilityCard } };

export type AbilityCard = { name: string; deck_ix: number };

export function defaultGamestate() : GameState {
  return {
    phase: { ShipActionPhase: null},
    players: [],
    crew: [],
    map: {
      ship_area: 0,
      adjacent_areas: [],
      visible_areas: [],
      current_region: 0
    },
    resources: {},
    room: "",
    message_queue: []
  };
}
