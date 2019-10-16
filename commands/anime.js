const Discord = require("discord.js");
const request = require('request');

module.exports.run = async (bot, message, args) => {
    let arg = message.content.split(' ');
    if(arg.length === 1){
        request(`https://konachan.com/post.json?limit=1000&tags=rating%3Asafe`,
        (error, response, body) => {
            if(response.statusCode === 200){
                data = JSON.parse(response.body);
                let count = Object.keys(data).length;
                if(count > 0){
                    let rnd = Math.floor(Math.random() * Math.floor(count));
                    return message.channel.send(new Discord.RichEmbed()
                        .setImage(data[rnd].file_url)
                        .setColor('#DABC12'));
                }
                else{
                    return message.channel.send(new Discord.RichEmbed()
                        .setColor('#DABC12')
                        .addField('Hiba!', 'Nincs találat!'));
                }
            }
            else{
                return message.channel.send(new Discord.RichEmbed()
                    .setColor('#DABC12')
                    .addField('Hiba!', 'Hiba történt a szerverrel való kommunikációval!'));
            }
        });
    }
    else{
        request(`https://konachan.com/post.json?limit=1000&tags=rating%3Asafe`+arg.join("+"),
        (error, response, body) => {
            if(response.statusCode === 200){
                data = JSON.parse(response.body);
                let count = Object.keys(data).length;
                if(count > 0){
                    let rnd = Math.floor(Math.random() * Math.floor(count));
                    return message.channel.send(new Discord.RichEmbed()
                        .setImage(data[rnd].file_url)
                        .setColor('#DABC12'));
                }
                else{
                    return message.channel.send(new Discord.RichEmbed()
                        .setColor('#DABC12')
                        .addField('Hiba!', 'Nem volt találat!'));
                }
            }
            else{
                return message.channel.send(new Discord.RichEmbed()
                    .setColor('#DABC12')
                    .addField('Hiba!', 'Hiba történt a szerverrel való kommunikációval!'));
            }
        });
    }
}
module.exports.help = {
    name: "anime",
    type: "sfw"
}
