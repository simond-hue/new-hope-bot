const Discord = require("discord.js");
const fs = require('fs');
var index = require("../index.js");
var timer;
var channelid;
var channelConnection;

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
                    servers = index.getServers();
                    if(servers[message.guild.id]){
                        delete servers[message.guild.id];
                        index.setServers(servers);
                    }
                }
            }, 300000);
            await message.member.voiceChannel.join();
            this.channelid = message.member.voiceChannel.id;
            this.channelConnection = message.guild.voiceConnection;
            index.setVoltLejatszvaZene(false);
            this.timer = setTimeout(() => {
                if(!index.getVoltLejatszvaZene() && message.member.voiceConnection) bot.commands.get("fuckoff").run(bot,message,args);
            }, 300000);
        }
    }
}
module.exports.help = {
    name: "summon",
    type: "music",
    alias: ["connect", "join"]
}

module.exports.channelid = this.channelid;

module.exports.channelConnection = this.channelConnection;
