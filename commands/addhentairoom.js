const Discord = require("discord.js");
const autohentai = require("../autoHentai.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    if(!message.channel.nsfw) return message.channel.send(new Discord.RichEmbed()
                                        .setColor("#DABC12")
                                        .setTitle("A szoba nem NSFW!"));
    if(!autohentai[message.guild.id]){
        autohentai[message.guild.id] = {
            channel: message.channel.id
        }
    }
    else{
        autohentai[message.guild.id].channel = message.channel.id;
    }
    console.log(autohentai);
    var cache = [];
    fs.writeFileSync("autoHentai.json", JSON.stringify(autohentai,function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return;
            }

            cache.push(value);
        }
        return value;
    }), function (err) {
        if (err) return console.log(err);
    });
    return message.channel.send(new Discord.RichEmbed()
                .setColor("#DABC12")
                .setTitle('Ez a szoba mostantól automatikus hentai szoba!'));
}
module.exports.help = {
    name: "addhentairoom",
    type: "nsfw",
    alias: ["ahr", "sethentairoom", "shr"]
}