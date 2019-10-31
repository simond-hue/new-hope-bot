const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      let user = message.mentions.users.first() || message.author;
      let member = await message.guild.fetchMember(user);

      let userembed = new Discord.RichEmbed()
        .setDescription("User Információ")
        .setColor("#58C2AB")
        .setThumbnail(user.avatarURL)
        .addField("ID:", user.id)
        .addField("Létrehozás dátuma:", user.createdAt)
        .addField("Csatlakozás dátuma:", member.joinedAt)
        .addField("Utoljára látva:", member.lastMessage.createdAt)
      return message.channel.send(userembed);
}
module.exports.help = {
    name: "userinfo",
    type: "legural"
}
