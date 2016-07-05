"use strict";

class QuentiamObject{
  constructor(client){
    this.client = client;
  }

  send(params={}){
    params.id = this.id;

    this.client.winston.log("debug", `"${this.id}" sending message with ${JSON.stringify(params)}"`);

    this.client.ws_connection.send(JSON.stringify(params));
  }

  receive(data){}
}

module.exports = QuentiamObject;
