const QuentiamObject = require("../../QuentiamObject.js");

class PingObject extends QuentiamObject{
  constructor(client){
    super(client);

    this.id = "ping";
  }

  receive(data){
    console.debug("Server sent back a pong!");
  }
}

module.exports = PingObject;
