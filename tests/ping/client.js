"use strict";

const QuentiamClient = require("../../QuentiamClient.js");
let client = new QuentiamClient();

let PingObject = client.addObject(require("./PingObject.js"));

client.onConnect(function(){
  PingObject.send();
});

client.connect("ws://localhost:7777");
