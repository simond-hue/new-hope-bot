const Discord = require("discord.js");
const index = require("../index.js");
const summon = require("./summon.js");

module.exports.run = async (bot, message, args) => {
    if(summon.channelConnection != null || message.guild.voiceConnection){
        if(!message.member.voiceChannel && index.servers[message.guild.id].dispatcher)
            return message.channel.send(new Discord.RichEmbed()
                                        .setColor("#DABC12")
                                        .setTitle("Ne akard már elrontani a többiek jólétét!"));
        if(summon.channelConnection) {
            summon.channelConnection.disconnect();
            summon.channelConnection = null;
        }

        if(message.guild.voiceConnection) message.guild.voiceConnection.disconnect();

        servers = index.getServers();
        if(servers[message.guild.id]){
            await delete servers[message.guild.id];
            await index.setServers(servers);
        }
        index.setVoltLejatszvaZene(false);
    }
    else{
        return message.channel.send(new Discord.RichEmbed()
            .setTitle("Nem vagyok bent a voice channelben!")
            .setColor("#DABC12"));
    }
}
module.exports.help = {
    name: "fuckoff",
    type: "music",
    alias: ["disconnect", "dc"]
}