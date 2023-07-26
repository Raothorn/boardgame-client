export class Client {
  private socket: WebSocket;
  private onStateUpdate: (gs: object) => void;

  constructor() {
    this.onStateUpdate = (gs) => {};
    this.socket = new WebSocket("ws://localhost:2000/");

    this.socket.onopen = (event) => {
      console.log("connected");
    };

    this.socket.onmessage = (event) => {
      let newState = JSON.parse(event.data);
      this.onStateUpdate(newState);
    };
  }

  $onStateUpdate(fn: (gs: object) => void) {
    this.onStateUpdate = fn;
  }

  sendMessage(msgData: object) {
    let msg = JSON.stringify(msgData);
    this.socket.send(msg);
  }  
}

// export default { Client };
