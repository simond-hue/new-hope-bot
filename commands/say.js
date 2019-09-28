const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    if (message.member.hasPermission("MANAGE_MESSAGES")) {
        let botmessage = args.join(" ");
        message.delete().catch();
        message.channel.send(botmessage);
    }
    else {
        return message.channel.send("Nope");
    }
}
module.exports.help = {
    name: "say",
    type: "regural"
}
