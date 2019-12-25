const Discord = require("discord.js");
const index = require("../index.js");
const ytdl = require("ytdl-core");

function timeNormalization(time){
    if(time >= 3600){
        var currentLength = time;
        hour = Math.floor(time/3600);
        currentLength -= hour*3600;
        if(hour < 10) hour = "0"+hour;
        minutes = Math.floor(time/60);
        currentLength -= minutes*60;
        if(minutes < 10) minutes = "0"+minutes;
        seconds = currentLength;
        if(seconds < 10) seconds = "0"+seconds;
        return `${hour}:${minutes}:${seconds}`;
    }
    else{
        var currentLength = time;
        minutes = Math.floor(time/60);
        currentLength -= minutes*60;
        if(minutes < 10) minutes = "0"+minutes;
        seconds = currentLength;
        if(seconds < 10) seconds = "0"+seconds;
        return `${minutes}:${seconds}`;
    }
}

async function listingCommand(server, message){
    await listing(server, message)
    .then(async()=>{
        var timeT = (server.information[0].length_seconds*1000 - server.dispatcher.time);
        await message.channel.fetchMessages({ limit: 1 }).then(async(messages) => {
            server.lastMessage = messages.first();
            if(server.queue.length<=10) return;
            const collector = server.lastMessage.createReactionCollector((reaction, user) =>
                user.id !== message.guild.me.id &&
                (reaction.emoji.name === "⬅️" ||
                reaction.emoji.name === "➡️" ||
                reaction.emoji.name === "⏩" ||
                reaction.emoji.name === "⏪")
            ,{ time: timeT });
            server.reactionCollectorOnLastMessage = collector;
            collector.once("collect", async(reaction) => {
                switch(reaction.emoji.name){
                    case "➡️": server.page++;    break;
                    case "⬅️": server.page--;    break;
                    case "⏪": server.page = 0;  break;
                    case "⏩": 
                        if(Math.floor(server.queue.length/10) === server.queue.length/10)
                            server.page = Math.floor(server.queue.length/10)-1;
                        else
                            server.page = Math.floor(server.queue.length/10);    
                        break;
                }
                server.lastMessage.clearReactions();
                return listingCommand(server,message);
            });
            if((server.page*10)+(server.queue.length%10) === server.queue.length || (Math.floor(server.queue.length/10) === server.queue.length/10 && server.page!=0)){
                try{
                    await server.lastMessage.react('⏪');
                    await server.lastMessage.react('⬅️');
                }
                catch(err){ 
                    if(err.code !== 10008) console.log(err) 
                }
            }
            else if(server.page === 0 && (server.page*10)+(server.queue.length%10) !== server.queue.length){
                try{
                    await server.lastMessage.react('➡️');
                    await server.lastMessage.react('⏩');
                }
                catch(err){ 
                    if(err.code !== 10008) console.log(err)  
                }
            }
            else{
                try{
                    await server.lastMessage.react('⏪');
                    await server.lastMessage.react('⬅️');
                    await server.lastMessage.react('➡️');
                    await server.lastMessage.react('⏩');
                }
                catch(err){ 
                    if(err.code !== 10008) console.log(err)  
                }
            }
        })
    });
}

async function listing(server, message){
    var queueEmbed = new Discord.RichEmbed()
    .setColor("#DABC12")
    .setTitle("Lejátszási lista")
    .setFooter(server.page+1+"/"+Math.ceil(server.queue.length/10))
    .setAuthor(
        "New Hope Bot",
        "https://cdn.discordapp.com/avatars/626527448858886184/9c28e993dc55dd11fe6e0daf5e4c351b.png"
    )
    .setThumbnail(message.guild.iconURL);
    var fromto;
    if(server.queue.length-server.page*10 < 10){
        fromto = server.queue.length;
    }
    else{
        fromto = server.page*10+10;
    }
    var promiseArray = [];
    for(var i = server.page*10; i < fromto; i++){
        if(!server.information[i] || server.information[i] === null)   
            promiseArray.push(new Promise((resolve, reject)=>{
                ytdl.getInfo(server.queue[i],async(err,info) =>{
                    resolve(info);
                })
            }));
        else promiseArray.push(null);
    }
    promiseArray.map(p => p);
    await Promise.all(promiseArray)
    .then((value)=>{
        for(var i = server.page*10; i < fromto; i++){
            if(value[i%10] !== null){
                server.information[i] = value[i%10];
            }
        }
        for(var i = server.page*10; i < fromto; i++){
            if(server.information[i]){
                var length = timeNormalization(server.information[i].length_seconds);
                queueEmbed.addField(`${(i+1)}.`, `[${server.information[i].title}](${server.queue[i]}) Hossz: ${length}`);
            }
            else{
                server.information[i] = null;
                queueEmbed.addField(`${i+1}`,'*A videó nem elérhető*');
            }
        }
    });
    return message.channel.send(queueEmbed);
}

module.exports.run = async (bot, message, args) =>{
    server = index.servers[message.guild.id];
    if(!message.guild.voiceConnection)                      return message.channel.send(new Discord.RichEmbed()
                                                                .setColor("#DABC12")
                                                                .setTitle('Nem vagyok voice channelen'));
    if(!server.queue[0] && message.guild.voiceConnection)   return message.channel.send(new Discord.RichEmbed()
                                                                .setColor("#DABC12")
                                                                .setTitle('Üres a lejátszási lista!'));
    if(!message.guild.me.hasPermission("MANAGE_MESSAGES"))  return message.channel.send(new Discord.RichEmbed()
                                                                .setColor("#DABC12")
                                                                .setTitle('Szükségem van üzenet kezelési jogra!'));
    if(!server.queueCanBeCalled) return message.channel.send(new Discord.RichEmbed()
                                    .setColor("#DABC12")
                                    .setTitle('A lejátszási list még töltődik!'));  
    server.page = 0;
    listingCommand(server,message);

}
module.exports.help = {
    name: "queue",
    type: "music",
    alias: ["q"]
}
