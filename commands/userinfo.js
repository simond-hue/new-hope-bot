const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      let user = message.mentions.users.first() || message.author;
      let member = await message.guild.fetchMember(user);
      if(member.lastMessage){
        return(message.channel.send(new Discord.RichEmbed()
        .setDescription("Felhasználó Információja")
        .setColor("#58C2AB")
        .setThumbnail(user.avatarURL)
        .addField("ID:", user.id)
        .addField("Regisztráció dátuma:", user.createdAt)
        .addField("Csatlakozás dátuma:", member.joinedAt)
        .addField("Utoljára látott:", member.lastMessage.createdAt)));
      }
      else{
        return(message.channel.send(new Discord.RichEmbed()
        .setDescription("Felhasználó Információja")
        .setColor("#58C2AB")
        .setThumbnail(user.avatarURL)
        .addField("ID:", user.id)
        .addField("Regisztráció dátuma:", user.createdAt)
        .addField("Csatlakozás dátuma:", member.joinedAt)
        .addField("Utoljára látott:", "N/A")));
      }
}
module.exports.help = {
    name: "userinfo",
    type: "legural"
}
