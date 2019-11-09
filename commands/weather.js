const Discord = require("discord.js");
const request = require('request');

module.exports.run = async (bot, message, args) => {
    let arg = message.content.split(' ');
    let telepules = "";
    if(arg.length === 1){
        telepules = "Budapest";
    }
    else if(arg.length > 2){
        return message.channel.send(new Discord.RichEmbed()
        .setColor("#d6f43d")    
        .addField("Hiba!", "Túl sok argumentum!"));
    }
    else{
        telepules = arg[1];
    }
    request(`http://api.openweathermap.org/data/2.5/weather?q=${telepules}&APPID=15e2356fca76b640e9fb6d2fcc1ad012&units=metric`,
        (error, response, body) => {
            if(response.statusCode == 200){
                data = JSON.parse(response.body);
                embed = new Discord.RichEmbed()
                    .setThumbnail(`http://openweathermap.org/img/w/${data.weather[0].icon}.png`);
                message.channel.send(embed);
            }
            else{
                return message.channel.send(new Discord.RichEmbed()
                .setColor("#d6f43d")
                .addField("Hiba!", "Hiba történt a szerverrel való kommunikációval!"));
            }
    });
}
module.exports.help = {
    name: "weather",
    type: "weather"
}
