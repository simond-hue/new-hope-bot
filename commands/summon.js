const Discord = require("discord.js");
const fs = require('fs');
var index = require("../index.js");

module.exports.run = async (bot, message, args) => {
    if(!message.member.voiceChannel){
        return message.channel.send(new Discord.RichEmbed()
            .setColor("#DABC12")
            .setTitle("Voice channelben kell lenned, hogy meg tudj idézni!"));
    }
    else{
        if(message.guild.voiceConnection){
            return message.channel.send(new Discord.RichEmbed()
                .setTitle("Már bent vagyok a voice channelen!")
                .setColor("#DABC12"));
        }
        else{
            voice = message.member.voiceChannel;
            connection = message.guild.voiceConnection;
            setInterval(() => {
                var botok = true;
                voice.members.forEach(element => {
                    if(element.user.bot === false) botok = false;
                });
                if(botok){
                    connection.disconnect();
                    servers = index.servers;
                    if(servers[message.guild.id]){
                        delete servers[message.guild.id];
                        index.servers = servers;
                    }
                }
            }, 600000);
            await message.member.voiceChannel.join();
            servers = index.servers;
            if(!servers[message.guild.id]){
                servers[message.guild.id] = {
                    queue: [],
                    information: [],
                    requestedBy: [],
                    requestedByProfPic: [],
                    skips: 0,
                    skippedBy: [],
                    summonedChannel: message.member.voiceChannel.id,
                    summonedVoiceConnection: message.guild.voiceConnection,
                    voltLejatszvaZene: false,
                    page: 0,
                    queueCanBeCalled: true,
                    looped: false,
                    shuffled: false
                };
            }
            setTimeout(() => {
                if(servers[message.guild.id])
                    if(!servers[message.guild.id].voltLejatszvaZene && message.guild.voiceConnection) bot.commands.get("fuckoff").run(bot,message,args);
            }, 300000);
        }
    }
}
module.exports.help = {
    name: "summon",
    type: "music",
    alias: ["connect", "join"]
}

