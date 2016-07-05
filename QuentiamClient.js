"use strict";

const EventEmitter = require("events").EventEmitter;

class QuentiamClient{
  constructor(){
    this.emitter = new EventEmitter();
    this.objects = [];
    this.ws = null;
    this.connect_callbacks = [];

    console.debug("Created Quentiam client.");
  }

  addObject(object){
    const obj = new object(this);

    this.objects.push(obj);
    console.debug(`Added object "${obj.id}"`);

    return obj;
  }

  connect(server){
    console.debug("Connecting to server...");

    this.ws = new WebSocket(server);

    this.ws.onopen = () => {
      console.info("Quentiam client connected.");

      for(let callback of this.connect_callbacks){
        callback();
      }
    };

    this.ws.onerror = (error) => {
      console.error(`Quentiam client had an error during connection: ${error.toString()}`);

      this.emitter.emit("error", error);
    };

    this.ws.onclose = () => {
      console.debug("Quentiam client closed connection.");

      this.emitter.emit("close");
    };

    this.ws.onmessage = (msg) => {
      let data = JSON.parse(msg.data);

      console.debug(`Got message with id ${data.id} (${msg.data})`);

      for(let object of this.objects){
        if(object.id === data.id){
          object.receive(data);
        }
      }
    };
  }

  onConnect(callback){
    this.connect_callbacks.push(callback);
  }
}

module.exports = QuentiamClient;
