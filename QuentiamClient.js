"use strict";

const WebSocket = require("websocket").client;
const EventEmitter = require("events").EventEmitter;

class QuentiamClient{
  constructor(logger_level="debug"){
    this.emitter = new EventEmitter();
    this.winston = require("winston");
    this.objects = [];
    this.ws = new WebSocket();
    this.ws_connection = null;
    this.connect_callbacks = [];

    this.ws.on("connect", (connection) => {
      this.ws_connection = connection;

      this.winston.info("Quentiam client connected.");

      for(let callback of this.connect_callbacks){
        callback();
      }

      connection.on("error", (error) => {
        this.winston.log("error", `Quentiam client had an error during connection: ${error.toString()}`);

        this.emitter.emit("error", error);
      });

      connection.on("close", () => {
        this.winston.log("debug", "Quentiam client closed connection.");

        this.emitter.emit("close");
      });

      connection.on("message", (msg) => {
        if(msg.type === "utf8"){
          let data = JSON.parse(msg.utf8Data);

          this.winston.log("debug", `Got message with id ${data.id} (${msg.utf8Data})`);

          for(let object of this.objects){
            if(object.id === data.id){
              object.receive(data);
            }
          }
        }
      });
    });

    this.winston.level = logger_level;

    this.winston.log("debug", "Created Quentiam client.");
  }

  addObject(object){
    const obj = new object(this);

    this.objects.push(obj);
    this.winston.log("debug", `Added object "${obj.id}"`);

    return obj;
  }

  connect(server){
    this.winston.log("debug", "Connecting to server...");

    this.ws.connect(server);
  }

  onConnect(callback){
    this.connect_callbacks.push(callback);
  }
}

module.exports = QuentiamClient;
