const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      if (args[0] === undefined) return message.channel.send("Usage: zeno-report @user reason");
      let bicon = message.mentions.users.first().displayAvatarURL;
      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!rUser) return message.channel.send("Couldn't find user.");
      let rReason = args.join(" ").slice(22);

      let reportEmbed = new Discord.RichEmbed()
      .setDescription("Jelentés")
      .setColor("#FF0000")
      .setThumbnail(bicon)
      .addField("Jelentett felhasználó", `${rUser} with ID: ${rUser.id}`)
      .addField("Jelentve általa:", `${message.author} with ID: ${message.author.id}`)
      .addField("Csatorna", message.channel)
      .addField("Idő", message.createdAt)
      .addField("Ok: ", rReason);

      let reportschannel = message.guild.channels.find(`name`, "parancsok");
      if (!reportschannel) return message.channel.send("Couldn't find the specific channel");
      message.delete().catch(O_o=>{});
      reportschannel.send(reportEmbed);
}
module.exports.help = {
name: "report",
    type: "legural"
}
