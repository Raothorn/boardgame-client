import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

export class Client {
  private socket: WebSocket;
  private onStateUpdate: (gs: GameState) => void;

  constructor() {
    this.onStateUpdate = (_) => {};
    this.socket = new WebSocket("ws://localhost:2000/");

    this.socket.onopen = (event) => {
      console.log("connected");
    };

    this.socket.onmessage = (event) => {
      let msg = JSON.parse(event.data);
      console.log(msg);
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

export type GameState = {
  phase: GamePhase;
  players: any[];
  crew: Crew[];
  resources: Record<string, number>;
  room: string;
  message_queue: ClientMessage[];
};

export type GamePhase =
  | { ShipAction: ShipActionSubphase | null }
  | { EventPhase: EventCard | null }
  | { ChallengePhase: { challenge: Challenge; added: number | null } };

export type ShipActionSubphase =
  | { DeckAction: { search_tokens_drawn: number[] } }
  | string;

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

export type AbilityCard = { name: string, deck_ix: number }
