const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(args[0] === undefined) return message.channel.send(new Discord.RichEmbed()
        .addField("Hiba!", "Használat -setprefix <prefix>")
        .setColor("#CD1265"));

    if(message.author.id!==197370398839406592 || //DEV ID-K
       message.author.id!==266553585255317505 ||
       message.author.id!==211956737027211264 ||
       message.author.id!==336471304653897728) return message.channel.send(new Discord.RichEmbed()
        .addField("Hiba!", "Csak szerver admin tudja megváltoztatni a prefixet!")
        .setColor("#CD1265"));

    let fs = require('fs');

    let botconfig = require("../botconfig.json");
    botconfig.prefix = args[0];
    fs.writeFileSync("botconfig.json", JSON.stringify(botconfig), function (err) {
        if (err) return console.log(err);
      });
    message.channel.send(new Discord.RichEmbed()
        .addField("Sikeres prefix változtatás!",`A bot parancsai mostantól a **${botconfig.prefix}** előtaggal érhetőek el!`)
        .setColor("#CD1265"));
}
module.exports.help = {
    name: "setprefix",
    type: "botconfig"
}