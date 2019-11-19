const Discord = require("discord.js");
const index = require("../index.js");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

module.exports.run = async (bot, message, args) => {
    if(!message.member.voiceChannel) return message.channel.send(new Discord.RichEmbed()
                                                                .setColor("#DABC12")
                                                                .setTitle("Voice channelben kell lenned, hogy véletlenszerű lejátszást alkalmazd!")); 
    // TÖBB KEZELÉS KELL, CSAK ELŐBB MEGCSINÁLOM MÁS TESZTELÉSHEZ
    server = index.getServers()[message.guild.id];
    if(server.queue[0]){
        for(var i = 1; i < server.queue.length; i++){
            csereltElem = getRandomInt(1,server.queue.length-1);

            tempQueue = server.queue[i];
            server.queue[i] = server.queue[csereltElem];
            server.queue[csereltElem] = tempQueue;

            tempInfo = server.information[i];
            server.information[i] = server.information[csereltElem];
            server.information[csereltElem] = tempInfo;
        }
    }
    return message.channel.send(new Discord.RichEmbed()
                .setColor("#DABC12")
                .setTitle("Véletlenszerű lejátszás")); 
}
module.exports.help = {
    name: "shuffle",
    type: "music",
    alias: ["random", "randomize", "rnd", "shuff"]
}