const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      if (args[0] === undefined) return message.channel.send("Usage: pico-kick @user reason");
      let bicon = message.mentions.users.first().displayAvatarURL;
      let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!kUser) return message.channel.send("Can't find user.");
      let kReason = args.join(" ").slice(22);
      if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("No can do pal!");
      if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");



      let kickEmbed = new Discord.RichEmbed()
      .setDescription("~Kick~")
      .setColor("#5C69A5")
      .setThumbnail(bicon)
      .addField("Kicked user", `${kUser} with ID ${kUser.id}`)
      .addField("Kicked by", `${message.author} with ID ${message.author.id}`)
      .addField("Kicked in", message.channel)
      .addField("Time", message.createdAt)
      .addField("Reason", kReason);

      let kickChannel = message.guild.channels.find(`name`, "parancsok");
      if (!kickChannel) return message.channel.send("Couldn't find the specific channel");

      message.guild.member(kUser).kick(kReason);

      message.delete().catch(O_o=>{});
      kickChannel.send(kickEmbed);
}
module.exports.help = {
    name: "kick",
    type: "admin"
}
