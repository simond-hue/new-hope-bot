const Discord = require("discord.js");
const request = require('request');

module.exports.run = async (bot, message, args) => {
    let telepules = "";
    let msg = "";
    if(message.content.split(' ').length===1){
        telepules = 'Budapest';
    }
    else{
        for(let i = 1; i < message.content.split(' ').length; i++){
            telepules += message.content.split(' ')[i]+" ";
        }
    }
    request(`https://api.openweathermap.org/data/2.5/weather?q=${telepules}&units=metric&appid=15e2356fca76b640e9fb6d2fcc1ad012`, 
        (error, response, body) => {  
            if(response.statusCode === 200){
                data = JSON.parse(response.body);
                console.log(data);
                let napkelte = new Date(data.sys.sunrise);
                let napkelteString = "";
                if(napkelte.getHours() <= 9){
                    napkelteString += "0" + napkelte.getHours()+":";
                }
                else{
                    napkelteString += napkelte.getHours()+":";
                }

                if(napkelte.getMinutes() <= 9){
                    napkelteString += "0" + napkelte.getMinutes()+":";
                }
                else{
                    napkelteString += napkelte.getMinutes()+":";
                }

                if(napkelte.getSeconds() <= 9){
                    napkelteString += "0" + napkelte.getSeconds();
                }
                else{
                    napkelteString += napkelte.getSeconds();
                }

                let napnyugta = new Date(data.sys.sunset);
                let napnyugtaString = "";
                if(napnyugta.getHours() <= 9){
                    napnyugtaString += "0" + napnyugta.getHours()+":";
                }
                else{
                    napnyugtaString += napnyugta.getHours()+":";
                }

                if(napnyugta.getMinutes() <= 9){
                    napnyugtaString += "0" + napnyugta.getMinutes()+":";
                }
                else{
                    napnyugtaString += napnyugta.getMinutes()+":";
                }

                if(napnyugta.getSeconds() <= 9){
                    napnyugtaString += "0" + napnyugta.getSeconds();
                }
                else{
                    napnyugtaString += napnyugta.getSeconds();
                }

                message.channel.send(new Discord.RichEmbed()
                    .setColor("#72bac1")
                    .setTitle("Időjárás")
                    .setThumbnail(`http://openweathermap.org/img/w/${data.weather[0].icon}.png`)
                    .addField("Település",`${data.name}, ${data.sys.country}`)
                    .addField("Hőm️érséklet °C/°F", `${data.main.temp} °C/${Math.round((data.main.temp * (9/5) + 32)*100)/100} °F`)
                    .addField("Minimum hőmérséklet °C/°F", `${data.main.temp_min} °C/${Math.round((data.main.temp_min * (9/5) + 32)*100)/100} °F`,true)
                    .addField("Maximum hőmérséklet °C/°F", `${data.main.temp_max} °C/${Math.round((data.main.temp_max * (9/5) + 32)*100)/100} °F`,true)
                    .addField(`Napkelte`,`${napkelteString} AM`,true)
                    .addField(`Napnyugta`,`${napnyugtaString} PM`,true)
                    .addField("Jelenlegi idő", `bonyolult lesz megoldani xd`));
            }
            else if(response.statusCode === 404){
                message.channel.send(new Discord.RichEmbed()
                    .setColor("#72bac1")
                    .setTitle("Időjárás")
                    .addField("Hiba","Nem volt találat!"));
            }
            else{
                message.channel.send(new Discord.RichEmbed()
                    .setColor("#72bac1")
                    .setTitle("Időjárás")
                    .addField("Hiba","Hiba történt a szerverrel való kommunikációval!"));
            }
        });
        
}
module.exports.help = {
    name: "weather",
    type: "weather"
}