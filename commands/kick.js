const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if (args[0] === undefined || message.mentions.users.first() === undefined) return message.channel.send(new Discord.RichEmbed()
        .setColor("#5C69A5")
        .addField("Hiba!", "Használat: -kick @<felhasználó> <indok>"));
    let bicon = message.mentions.users.first().displayAvatarURL;
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send(new Discord.RichEmbed()
        .setColor("#5C69A5")
        .addField("Hiba!","Nem található a felhasználó!"));
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(new Discord.RichEmbed()
        .setColor("#5C69A5")
        .addField("Hiba!","Te nem rendelkezel kick jogokkal!"));
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send(new Discord.RichEmbed().
        addField("Hiba!", "Ezt a felhasználót nem lehet kickelni!")
        .setColor("#5C69A5"));

      let kickEmbed = new Discord.RichEmbed()
      .setDescription("~Kick~")
      .setColor("#5C69A5")
      .setThumbnail(bicon)
      .addField("Kickelt felhasználó", `${kUser} with ID ${kUser.id}`)
      .addField("Kickelte", `${message.author} with ID ${message.author.id}`)
      .addField("Ebben a csatornában", message.channel)
      .addField("Ekkor", message.createdAt)
      .addField("Indok", kReason);

      let kickChannel = message.guild.channels.find(c => c.name === "log");
      if (!kickChannel) return message.channel.send("A megadott csatorna nem található!");

      message.guild.member(kUser).kick(kReason);

      message.delete().catch(O_o=>{});
      kickChannel.send(kickEmbed);
}
module.exports.help = {
    name: "kick",
    type: "admin"
}
