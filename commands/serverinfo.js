const Discord = require("discord.js");
const os = require('os');

module.exports.run = async (bot, message, args) => {
      let sicon = message.guild.iconURL;
      let serverembed = new Discord.RichEmbed()
      .setDescription("Server Information")
      .setColor("#58C2AB")
      .setThumbnail(sicon)
      .addField("Server name", message.guild.name)
      .addField("Created on", message.guild.createdAt)
      .addField("You joined at", message.member.joinedAt)
      .addField("Total Members", message.guild.memberCount)
      return message.channel.send(serverembed);
}
module.exports.help = {
name: "serverinfo",
    type: "legural"
}
