const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(message.content.split(' ').length === 2){ //Hosszabb argument check
        let argsSplitSpace = message.content.split(' ')[1];
        if( argsSplitSpace[0] === '#' && //Hexa kód check
            argsSplitSpace.length === 7){
                let i = 1;
                while(i < argsSplitSpace.length){ //Hexakód karakter check
                    if (argsSplitSpace[i] !== 'A' && 
                        argsSplitSpace[i] !== 'B' && 
                        argsSplitSpace[i] !== 'C' && 
                        argsSplitSpace[i] !== 'D' &&
                        argsSplitSpace[i] !== 'E' &&
                        argsSplitSpace[i] !== 'F' &&
                        argsSplitSpace[i] > 9 && argsSplitSpace[i] < 0){
                            console.log(1);
                            break;
                        }
                    i++;
                }
                if(i < argsSplitSpace.length){
                    return message.channel.send(new Discord.RichEmbed()
                        .setColor("#24A4B2")
                        .addField("Hiba!", "Nem hexa kódban adtad meg a színt!"));
                }
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