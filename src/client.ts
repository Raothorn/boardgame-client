import { useToast } from "vue-toast-notification";
import 'vue-toast-notification/dist/theme-default.css'

export class Client {
  private socket: WebSocket;
  private onStateUpdate: (gs: object) => void;
  private onPrompt: (prompt: string) => void;


  constructor() {
    this.onStateUpdate = (_) => {};
    this.onPrompt = (_) => {};
    this.socket = new WebSocket("ws://localhost:2000/");

    this.socket.onopen = (event) => {
      console.log("connected");
    };

    this.socket.onmessage = (event) => {
      let msg = JSON.parse(event.data);
      if(msg.msgType == "update") {
        this.onStateUpdate(msg.msgData);
      }
      else if(msg.msgType == "notify") {
        const $toast = useToast();
        $toast.warning(msg.msgData);
      }
      else if(msg.msgType == "prompt") {
        this.onPrompt(msg.msgData);
      }
    };
  }

  $onStateUpdate(fn: (gs: object) => void) {
    this.onStateUpdate = fn;
  }

  $onPrompt(fn: (prompt: string) => void) {
    this.onPrompt=fn;
  }

  sendMessage(msgType: string, msgData: object) {
    let msgObj = { msgType: msgType, msgData: msgData }
    let msg = JSON.stringify(msgObj);
    this.socket.send(msg);
  }  
}