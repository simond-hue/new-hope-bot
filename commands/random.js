const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
  
  if (args[0] === undefined) return message.channel.send(randomEmbed = new Discord.RichEmbed()
    .setColor("#DABC12")
    .addField("Usage", "-random <message>"));
  let messageArray = message.content.split(" ");
  let messageString = "";
  
    for (var i = 1; i < messageArray.length; i++) {
      for(var j = 0; j < messageArray[i].length; j++){
        let random = Math.round(Math.random());
        if(random == 0){
          messageString += messageArray[i][j].toLowerCase();
        }
        else{
          messageString += messageArray[i][j].toUpperCase();
        }
      }
      messageString += " ";
    }
  return message.channel.send(messageString);
}
module.exports.help = {
    name: "random",
    type: "fun"
}
