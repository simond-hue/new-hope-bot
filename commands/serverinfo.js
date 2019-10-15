const Discord = require("discord.js");
const os = require('os');

module.exports.run = async (bot, message, args) => {
      let sicon = message.guild.iconURL;
      let serverembed = new Discord.RichEmbed()
      .setDescription("Szerver Információ")
      .setColor("#58C2AB")
      .setThumbnail(sicon)
      .addField("Szerver neve:", message.guild.name)
      .addField("Létrehozás dátuma:", message.guild.createdAt)
      .addField("Belépésed dátuma:", message.member.joinedAt)
      .addField("Tagok száma:", message.guild.memberCount)
      return message.channel.send(serverembed);
}
module.exports.help = {
    name: "serverinfo",
    type: "legural"
}
