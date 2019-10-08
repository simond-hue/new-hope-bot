const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(message.content.split(' ').length === 2){ //Hosszabb argument check
        let argsSplitSpace = message.content.split(' ')[1];
        if( argsSplitSpace[0] === '#' && //Hexa kód check
            argsSplitSpace.length === 7){
                let i = 1;
                while(i < argsSplitSpace.length){ //Hexakód karakter check
                    if (argsSplitSpace[i].toUpperCase() !== 'A' && 
                        argsSplitSpace[i].toUpperCase() !== 'B' && 
                        argsSplitSpace[i].toUpperCase() !== 'C' && 
                        argsSplitSpace[i].toUpperCase() !== 'D' &&
                        argsSplitSpace[i].toUpperCase() !== 'E' &&
                        argsSplitSpace[i].toUpperCase() !== 'F' &&
                        argsSplitSpace[i] > 9 && argsSplitSpace[i] < 0){
                            break;
                        }
                    i++;
                }
                if(i < 7){
                    return message.channel.send(new Discord.RichEmbed()
                        .setColor("#FFFFFF")
                        .addField("Hiba!", "Nem hexa kódban adtad meg a színt!"));
                }
                else{
                    let lastMessage;
                    message.channel.send(new Discord.RichEmbed()
                            .setColor(argsSplitSpace)
                            .setTitle("Névszín")
                            .setThumbnail(`http://singlecolorimage.com/get/${argsSplitSpace.replace('#','')}/150x150.png`)
                            .addField("Ezt a színt adtad meg!", "Kattints a megfelelő emojira!"))
                        .then(() => {
                            message.channel.fetchMessages({ limit: 1 }).then(messages => {
                                lastMessage = messages.first();
                                lastMessage.react('❌').then(lastMessage.react('👌'));
                        })
                        .then(() => {
                            filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;
                            lastMessage.awaitReactions(filter, {time: 7200})
                            .then(collected => {
                                console.log(collected);
                                if(collected.users === 2){
                                    return message.channel.send(new Discord.RichEmbed()
                                        .setTitle("Névszín")
                                        .addField("A névszín nem változott","Kilépés..."));
                                }
                            })
                        })
                    });
                }
        }
        else{
            message.channel.send(new Discord.RichEmbed()
                        .setColor("#FFFFFF")
                        .addField("Hiba!", "Nem hexa kódban adtad meg a színt!"));
            
        }
    }
    else{
        message.channel.send(new Discord.RichEmbed()
            .setColor("#24A4B2")
            .addField('Hiba!', "Az argumentum több, mint egy elemből áll!"));
    }
}
module.exports.help = {
    name: "color",
    type: "user"
}