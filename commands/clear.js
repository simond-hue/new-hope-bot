const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(new Discord.RichEmbed()
    .setColor("#FFFFFF")
    .addField("Hiba!", "Nincs jogod üzeneteket törölni!"));
  if (!args[0]) return message.channel.send(new Discord.RichEmbed()
    .setColor("#FFFFFF")
    .addField("Hiba!", "Használat: -clear <üzenetek_száma>"));
  if (args[0] > 500) return message.channel.send(new Discord.RichEmbed()
    .setColor("#FFFFFF")
    .addField("Hiba!", "Max 500 üzenetet törölhetsz!"));
  try {
      message.channel.bulkDelete(args[0]).then(() => {
      message.channel.send(`${args[0]} üzenet lett letörölve!`).then(msg => msg.delete(5000));
  }); } catch (e) {
      console.log(e);
    }
}
module.exports.help = {
    name: "clear",
    type: "admin"
}
