import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

export class ClientSocket {
  private socket: WebSocket;
  private onStateUpdate: (gs: GameState) => void;

  constructor() {
    this.onStateUpdate = (_) => {};
    this.socket = new WebSocket("ws://localhost:2000/");

    this.socket.onopen = (_) => {};

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
  players: Player[];
  crew: Crew[];
  map: Map;
  resources: Record<string, number>;
  room: string;
  message_queue: ClientMessage[];
};

export type GamePhase =
  | { ShipActionPhase: ShipActionSubphase | null }
  | { EventPhase: EventCard | null }
  | { ChallengePhase: ChallengePhase }
  | { MainActionPhase: [string | null, number] }
  | { SelectCrewMemberPhase: { crew_ix: number; title: string } }
  | { ExplorePhase: Story }
  | { ResolveEffectPhase: Effect };


export type ShipActionSubphase = {
  DeckAction: { search_tokens_drawn: number[] };
};


export type ChallengePhase = { challenge: Challenge; skill: number | null };
export type Effect = { TakeHealthDamage: number };

export type Map = {
  ship_area: number;
  adjacent_areas: number[];
  adjacent_ports: number[];
  visible_areas: number[];
  visible_ports: number[];
  current_region: number;
};

export type EventCard = {
  name: string;
  options: EventOption[];
  deck_index: number;
};

export type EventOption = { text: string };

export type Challenge = { skill: string; label: string, amount: number };

export type Story = {
  main_text: string;
  options: { text: string }[];
};

export type Crew = {
  name: string;
  fatigue: number;
  damage: number;
  skills: Record<string, number>;
  equipped_ability_cards: AbilityCard[];
  status: string[]
};

export type ClientMessage =
  | { GainCommandPoints: { amount: number } }
  | { DrewAbilityCard: { card: AbilityCard } }
  | { DrewFate: { result: number } }

export type Player = {
  command_tokens: number;
  hand: AbilityCard[];
};

export type AbilityCard = { name: string; deck_ix: number };

export function defaultGamestate(): GameState {
  return {
    phase: { ShipActionPhase: null },
    players: [{ command_tokens: 0, hand: [] }],
    crew: [],
    map: {
      ship_area: 0,
      adjacent_areas: [],
      adjacent_ports: [],
      visible_areas: [],
      visible_ports: [],
      current_region: 0,
    },
    resources: {},
    room: "",
    message_queue: [],
  };
}
