const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  if (args[0] === undefined) return message.channel.send("Usage: zeno-random message");
  let messageArray = message.content.split("");
  let messageString = "";
    for (var i = 12; i < messageArray.length; i++) {
      if ((Math.random() * 10) > 5) {
        messageString += messageArray[i].toUpperCase();
      }
      else if((Math.random() * 10) < 5) {
        messageString += messageArray[i].toLowerCase();
      }
      else {
        messageString += messageArray[i];
      }
    }
  return message.channel.send(messageString);
}
module.exports.help = {
name: "random",
    type: "fun"
}
