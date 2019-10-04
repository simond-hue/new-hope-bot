const Discord = require("discord.js");

//TODO: megjegyeztetni az activity-t

module.exports.run = async (bot, message, args) => {
    if (message.member.id=197370398839406592 || //DEV ID-K
        message.member.id==266553585255317505 ||
        message.member.id==211956737027211264 ||
        message.member.id==336471304653897728){
            let messageStringSplit = message.content.split(" ");
            let activity = "";
            for(var i = 2; i < messageStringSplit.length; i++){
                activity += messageStringSplit[i] + " ";
            }
            bot.user.setActivity(activity, { type: messageStringSplit[1] });
            return message.channel.send(new Discord.RichEmbed()
                .setColor("#AB1256")
                .addField("Sikeres átnevezés!", `A bot activityje mostantól ${messageStringSplit[1]} ${activity}`));
        }
    else{
        return message.channel.send(new Discord.RichEmbed()
            .setColor("#AB1256")
            .addField("Hiba!", "Csak a developerek tudják az activity-t változtatni!"));
    }
}
module.exports.help = {
    name: "setactivity",
    type: "botconfig"
}