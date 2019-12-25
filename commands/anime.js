const Discord = require("discord.js");
const request = require('request');

module.exports.run = async (bot, message, args) => {
    let arg = message.content.split(' ');
    if(arg.length === 1){
        request(`https://konachan.com/post.json?limit=1&tags=rating%3Asafe+order%3Arandom`,
        (error, response, body) => {
            if(response.statusCode === 200){
                data = JSON.parse(response.body);
                let count = Object.keys(data).length;
                if(count > 0){
                    return message.channel.send(new Discord.RichEmbed()
                        .setTitle('Ha nem töltene be a kép')
                        .setURL(data[0].file_url)
                        .setImage(data[0].file_url)
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
        let query = [];
        for(var i = 1; i<arg.length; i++){
            query[i] = arg[i];
        }
        request(`https://konachan.com/post.json?limit=1&tags=rating%3Asafe+order%3Arandom`+query.join('+'),
        (error, response, body) => {
            if(response.statusCode === 200){
                data = JSON.parse(response.body);
                let count = Object.keys(data).length;
                if(count > 0){
                    return message.channel.send(new Discord.RichEmbed()
                        .setTitle('Ha nem töltene be a kép')
                        .setURL(data[0].file_url)
                        .setImage(data[0].file_url)
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
