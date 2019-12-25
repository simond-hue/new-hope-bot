const Discord = require("discord.js");
const request = require('request');

module.exports.run = async (bot,id) => {
    messageChannel = bot.channels.get(id);
    request(`https://konachan.com/post.json?limit=1&tags=rating%3Aexplicit+order%3Arandom`,
    (error, response, body) => {
        if(response.statusCode === 200){
            data = JSON.parse(response.body);
            let count = Object.keys(data).length;
            if(count > 0){
                return messageChannel.send(new Discord.RichEmbed()
                    .setTitle('Ha nem töltene be a kép')
                    .setURL(data[0].file_url)
                    .setImage(data[0].file_url)
                    .setColor('#DABC12'));
            }
            else{
                return messageChannel.send(new Discord.RichEmbed()
                    .setColor('#DABC12')
                    .addField('Hiba!', 'Nincs találat!'));
            }
        }
        else{
            return messageChannel.send(new Discord.RichEmbed()
                .setColor('#DABC12')
                .addField('Hiba!', 'Hiba történt a szerverrel való kommunikációval!'));
        }
    });
}
module.exports.help = {
    name: "autohentai",
    type: "auto"
}