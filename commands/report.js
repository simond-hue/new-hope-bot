const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      if (args[0] === undefined) return message.channel.send(new Discord.RichEmbed()
        .setColor("#BC4523")
        .addField("Hiba!", "Használat: -report @<felhasználó> <indok>"));
      let bicon = message.mentions.users.first().displayAvatarURL;
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!rUser) return message.channel.send(new Discord.RichEmbed()
        .setColor("#FF0000")
        .addField("Hiba!","Nem található a felhasználó!"));
      let rReason = args.join(" ").slice(22);

      let reportEmbed = new Discord.RichEmbed()
      .setDescription("Jelentés")
      .setColor("#FF0000")
      .setThumbnail(bicon)
      .addField("Jelentett felhasználó", `${rUser} ID: ${rUser.id}`)
      .addField("Jelentve általa:", `${message.author} ID: ${message.author.id}`)
      .addField("Csatorna", message.channel)
      .addField("Idő", message.createdAt)
      .addField("Ok: ", rReason);

      let reportschannel = message.guild.channels.find(c => c.name === "log");
      if (reportschannel === undefined) return message.channel.send("A megadott csatorna nem található!");
      else{
        message.channel.send(new Discord.RichEmbed()
        .addField("Sikeres!", "Sikeres jelentés!")
        .setColor("#FF0000")).then(msg => msg.delete(5000));
      }
      message.delete().catch(O_o=>{});
      reportschannel.send(reportEmbed);
}
module.exports.help = {
    name: "report",
    type: "legural"
}
