const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
      var uptime = Math.floor(process.uptime());

      var days = Math.trunc(uptime / 3600 / 24);
      var hours = Math.trunc(uptime / 3600) - days * 24;
      var mins = Math.trunc(uptime / 60) - hours * 60;
      var secs = uptime - (mins * 60) - (hours * 3600);

      var JoinedServers = "-**" + bot.guilds.array().map((guild) => guild.name).join("**\n-**") + "**";


      let bicon = bot.user.displayAvatarURL;
      let botembed = new Discord.RichEmbed()
      .setDescription("Bot Information")
      .setColor("#56B82C")
      .setThumbnail(bicon)
      .addField(`Uptime`, `${days} days ${hours} hours, ${mins} minutes, ${secs} seconds`)
      .addField("Bot name", bot.user.username)
      .addField("Created on", bot.user.createdAt)
      .addField("Memory usage:", `${(process.memoryUsage().heapUsed / 1048576).toFixed(2)}MB\n`,);
      return message.channel.send(botembed);
}
module.exports.help = {
name: "botinfo",
    type: "regular"
}
