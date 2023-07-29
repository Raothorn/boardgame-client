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

export type PromptMsg = { promptType: string; promptData: object };

export type GameState = {
  phase: { ShipAction: (ShipActionSubphase | null)} | string;
  players: any[];
  crew: any[];
  resources: { coins: number; meat: number; grain: number };
  room: string;
  prompt: any | null;
};


export type ShipActionSubphase =
  | { GalleyAction: { gain_phase_complete: boolean } }
  | { DeckAction: { search_tokens_drawn: number[] } };