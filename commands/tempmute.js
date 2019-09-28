const Discord = require("discord.js");
const ms = require("ms");


module.exports.run = async (bot, message, args) => {
  //pico-tempmute @user s/m/h/d
  if (args[0] === undefined) return message.channel.send("Usage: zeno-tempmute @user time");
  let tomute = message.guild.members.get(message.mentions.members.first().id || args[0]);
  if (!tomute) return message.reply("Couldn't find user.");
  if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them.");

  let muterole = message.guild.roles.find("name", "muted");
  //start to create a role
  if (!muterole){
    try {
      muterole = await message.guild.createRole({
        name: "muted",
        color: "#000000",
        permissions:[]
      })
      message.guild.channels.forEach(async (channel, id) => {
        await channel.overwritePermissions(muterole, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
        });
      });
    } catch (e) {
    console.log(e.stack);
    }
  }
  //end of create role
  let mutetime = args[1];
  if (!mutetime) return message.reply("You didn't specify a time!");

  await(tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> has muted for ${ms(mutetime)/1000} seconds!`)

  setTimeout(function() {
    tomute.removeRole(muterole.id);
    message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));

//end of module
}
module.exports.help = {
name: "tempmute",
    type: "admin"
}
