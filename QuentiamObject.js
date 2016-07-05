"use strict";

class QuentiamObject{
  constructor(client){
    this.client = client;
  }

  send(params={}){
    params.id = this.id;

    console.debug(`"${this.id}" sending message with ${JSON.stringify(params)}"`);

    this.client.ws.send(JSON.stringify(params));
  }

  receive(data){}
}

module.exports = QuentiamObject;
