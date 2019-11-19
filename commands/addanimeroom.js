const Discord = require("discord.js");
const autoanime = require("../autoAnime.json");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    if(!autoanime[message.guild.id]){
        autoanime[message.guild.id] = {
            channel: message.channel.id
        }
    }
    else{
        autoanime[message.guild.id].channel = message.channel.id;
    }
    console.log(autoanime);
    var cache = [];
    fs.writeFileSync("autoAnime.json", JSON.stringify(autoanime,function(key, value) {
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
                .setTitle('Ez a szoba mostantól automatikus anime szoba!'));
}
module.exports.help = {
    name: "addanimeroom",
    type: "sfw",
    alias: ["aar", "setanimeroom", "sar"]
}