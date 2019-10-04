const Discord = require("discord.js");

//TO DO: befejezni

module.exports.run = async (bot, message, args) => {
    let botconfig = require("./botconfig.json");
    message.channel.send(new Discord.RichEmbed()
        .setColor("#FFFFFF")
        .addField("Újraindítás...", "Újraindítás..."))
    .then(msg => bot.destroy())
    .then(() => bot.login(botconfig.token));
}
module.exports.help = {
    name: "reload",
    type: "botconfig"
}
