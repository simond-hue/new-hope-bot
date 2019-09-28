const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.reply("No ಠ_ಠ");
  if (!args[0]) return message.channel.reply("Usage: pico-clear amount(max 500)");
  if (args[0] > 500) return message.channel.reply("You only can delete 500 messages!");
  try {
      message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`Cleared ${args[0]} messages`).then(msg => msg.delete(5000));
  }); } catch (e) {
    console.log(e);
    }
}
module.exports.help = {
name: "clear",
    type: "admin"
}
