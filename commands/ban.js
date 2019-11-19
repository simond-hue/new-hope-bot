const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      if (args[0] === undefined || message.mentions.users.first() === undefined) return message.channel.send(new Discord.RichEmbed()
        .setColor("#DABC12")
        .addField("Hiba!", "Használat: -ban @<felhasználó> <indok>"));
      let bicon = message.mentions.users.first().displayAvatarURL;
      let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!bUser) return message.channel.send(new Discord.RichEmbed()
        .setColor("#DABC12")
        .addField("Hiba!","Nem található a felhasználó!"));
      let bReason = args.join(" ").slice(22);
      if(!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(new Discord.RichEmbed()
        .setColor("#DABC12")
        .addField("Hiba!","Te nem rendelkezel ban jogokkal!"));
      if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(new Discord.RichEmbed().
        addField("Hiba!", "Ezt a felhasználót nem lehet bannolni!")
        .setColor("#DABC12"));

      let banEmbed = new Discord.RichEmbed()
      .setDescription("~Ban~")
      .setColor("#DABC12")
      .setThumbnail(bicon)
      .addField("Bannolt felhasználó", `${bUser} ID ${bUser.id}`)
      .addField("A bant kiosztotta", `${message.author} ID ${message.author.id}`)
      .addField("Ebben a csatornában", message.channel)
      .addField("Ekkor", message.createdAt)
      .addField("Indok", bReason);

      let banChannel = message.guild.channels.find(c => c.name === "log");
      if (!banChannel) return message.channel.send("A megadott csatorna nem található!");

      message.guild.member(bUser).ban(bReason);

      message.delete().catch(O_o=>{});
      banChannel.send(banEmbed);
}
module.exports.help = {
    name: "ban",
    type: "admin"
}
