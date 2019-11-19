const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const fs = require('fs');
const summon = require('./summon.js');
const request = require('request');
var index = require("../index.js");

var functionInPlay = async function (msg,bt,ar){
    server = index.getServers()[msg.guild.id];
    var stream;
    if(server.information[0].player_response.videoDetails.isLiveContent){
        await new Promise((resolve, reject)=>{
            const format = ytdl.chooseFormat(server.information[0].formats, { quality: [128,127,120,96,95,94,93] , filter: "audioonly", highWaterMark: 1<<25});
            stream = ytdl.downloadFromInfo(server.information[0], format);
            resolve(stream);
        }).then(async()=>{
            if(msg.guild.voiceConnection){
                server.dispatcher = await msg.guild.voiceConnection.playStream(stream);
                msg.channel.send(new Discord.RichEmbed()
                .setColor("#DABC12")
                .setTitle("Jelenlegi zeneszám")
                .setURL(server.queue[0])
                .setDescription(servers[msg.guild.id].information[0].title)
                .setFooter(
                    `Kérte: ${server.requestedBy[0]}`,
                    server.requestedByProfPic[0]
                )
                .setThumbnail(server.information[0].player_response.videoDetails.thumbnail.thumbnails[0].url)
                .setAuthor(
                    "New Hope Bot",
                    "https://cdn.discordapp.com/avatars/626527448858886184/9c28e993dc55dd11fe6e0daf5e4c351b.png"
                ));
            }
        });
    }
    else{
        await new Promise((resolve, reject)=>{
            stream = ytdl.downloadFromInfo(server.information[0], {filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25});
            resolve(stream);
        }).then(async()=>{
            if(msg.guild.voiceConnection){
                server.dispatcher = await msg.guild.voiceConnection.playStream(stream);
                msg.channel.send(new Discord.RichEmbed()
                    .setColor("#DABC12")
                    .setTitle("Jelenlegi zeneszám")
                    .setURL(server.queue[0])
                    .setDescription(servers[msg.guild.id].information[0].title)
                    .setFooter(
                        `Kérte: ${server.requestedBy[0]}`,
                        server.requestedByProfPic[0]
                    )
                    .setThumbnail(server.information[0].player_response.videoDetails.thumbnail.thumbnails[0].url)
                    .setAuthor(
                        "New Hope Bot",
                        "https://cdn.discordapp.com/avatars/626527448858886184/9c28e993dc55dd11fe6e0daf5e4c351b.png"
                    ));
            }
        });
    }
    server.dispatcher.on('start', ()=> {
        msg.guild.voiceConnection.player.streamingData.pausedTime = 0;
    });
    server.dispatcher.on("end", ()=>{
        setTimeout(() => {
        if(msg.guild.voiceConnection && server){
            server.skips = 0;
            server.skippedBy = [];
            server.queue.shift();
            server.information.shift();
            server.requestedBy.shift();
            server.requestedByProfPic.shift();
            if(server.queue[0]){
                return play(msg, bt);
            }
            else{
                server.dispatcher = null;
                if(msg.guild.voiceConnection){
                    setTimeout(()=>{
                        if(msg.guild.voiceConnection && !server.queue[0]) return bt.commands.get("fuckoff").run(bt,msg,ar);
                    },300000);
                }
            }
        }
        }, 1000);
    });
}

var play = async function (msg, bt, ar){
    index.setVoltLejatszvaZene(true);
    server = index.getServers()[msg.guild.id];
    if(server.information[0] === null && server.queue[0] && msg.guild.voiceConnection){
        promise = new Promise((resolve, reject)=>{
            ytdl.getInfo(server.queue[0], async(err,info)=>{
                server.information.pop();
                resolve(info);
                server.information.unshift(info);
            });
        });
        promise.then(async()=>{
            functionInPlay(msg,bt,ar);
        });
    }
    else if(server.information[0] && server.queue[0] && msg.guild.voiceConnection){
        functionInPlay(msg,bt,ar);
    }
}

var playlistRequest = async function (url, page, msg, bt, ar){
    request(url, async(error, response, body)=>{
        if(response.statusCode === 200){
            newUrl = url.replace(('&pageToken='+page),'');
            if(!msg.guild.voiceConnection) await msg.member.voiceChannel.join();
            if(!servers[msg.guild.id]){
                servers[msg.guild.id] = {
                    queue: [],
                    information: [],
                    requestedBy: [],
                    requestedByProfPic: [],
                    skips: 0,
                    skippedBy: []
                };
            }
            server = index.getServers()[msg.guild.id];
            data = JSON.parse(response.body);
            if(!data.prevPageToken) msg.channel.send(new Discord.RichEmbed()
                                                    .setColor('#DABC12')
                                                    .setTitle(`${data.pageInfo.totalResults} szám lett hozzáadva a lejátszási listához!`));
            data.items.forEach(element => { 
                server.queue.push('https://www.youtube.com/watch?v=' + element.snippet.resourceId.videoId);
                server.information.push(null);
                server.requestedBy.push(msg.member.user.username);
                server.requestedByProfPic.push(`https://cdn.discordapp.com/avatars/${msg.member.user.id}/${msg.member.user.avatar}.png`);
            });
            if(!url.includes('&pageToken='+page) && !server.dispatcher) play(msg,bt,ar);
            if(data.nextPageToken) playlistRequest(newUrl+"&pageToken="+data.nextPageToken,data.nextPageToken,msg,bt,ar);
        }
        else if(statusCode === 404){
            return msg.channel.send(new Discord.RichEmbed()
                .setColor('#DABC12')
                .addField('Hiba!', 'Nem volt találat!'));
        }
        else{
            return msg.channel.send(new Discord.RichEmbed()
                .setColor('#DABC12')
                .setTitle("Nem volt találat!"));
        }
    })
}

async function afterPromise(msg,bt,ar,lnk){
    servers = index.getServers();
    var info = servers[msg.guild.id].information[servers[msg.guild.id].information.length-1];
    var thumbnail = info.player_response.videoDetails.thumbnail.thumbnails;
    await msg.channel.send(new Discord.RichEmbed()
            .setTitle("Kért zeneszám")
            .setDescription(`${info.title}\n\nJelenlegi pozíciója a lejátszási listában: ${index.getServers()[msg.guild.id].queue.length}`)
            .setURL(lnk)
            .setColor("#DABC12")
            .setFooter(
                `Kérte: ${servers[msg.guild.id].requestedBy[servers[msg.guild.id].requestedBy.length-1]}`,
                servers[msg.guild.id].requestedByProfPic[servers[msg.guild.id].requestedByProfPic.length-1]
            )
            .setThumbnail(thumbnail[0].url)
            .setAuthor(
                "New Hope Bot",
                "https://cdn.discordapp.com/avatars/626527448858886184/9c28e993dc55dd11fe6e0daf5e4c351b.png"
            ));
    if(!servers[msg.guild.id].dispatcher){
        play(msg, bt, ar);
        if(!summon.channelConnection) summon.channelConnection = msg.guild.voiceConnection;
        voice = msg.member.voiceChannel;
        connection = msg.guild.voiceConnection;
        setInterval(() => {
            var botok = true;
            voice.members.forEach(element => {
                if(element.user.bot === false) botok = false;
            });
            if(botok){
                connection.disconnect();
                servers = index.getServers();
                if(servers[msg.guild.id]){
                    delete servers[msg.guild.id];
                    index.setServers(servers);
                }
            }
        }, 300000);
    }
}

module.exports.run = async (bot, message, args) => {
    if(message.content.split(' ').length==1){
        return message.channel.send(new Discord.RichEmbed()
            .setColor("#DABC12")
            .addField("Hiba!","Üres argumentum!"))
    }
    else{
        if(!message.member.voiceChannel) return message.channel.send(new Discord.RichEmbed()
                                                .setColor("#DABC12")
                                                .setTitle("Voice channelben kell lenned, hogy tudj zenét lejátszani!"));
        if(!summon.channelid || !message.guild.voiceConnection) summon.channelid = message.member.voiceChannel.id;

        if(summon.channelid !== message.member.voiceChannel.id && message.member.voiceChannel.members.get('626527448858886184'))
            if(message.member.voiceChannel.id === message.member.voiceChannel.members.get('626527448858886184').voiceChannelID)
                summon.channelid = message.member.voiceChannel.id;
        if(summon.channelid === message.member.voiceChannel.id){
            var link = message.content.split(' ')[1];
            if(link.startsWith('https://www.youtube.com/playlist?')){ //HA PLAYLISTET AD MEG A USER
                if(!message.guild.voiceConnection) await message.member.voiceChannel.join()
                var listID = link.split('?')[1].substr(5);
                if(listID.match(/[a-zA-Z0-9_-]/g)){
                    playlistRequest(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${listID}&key=AIzaSyBHaQui_pXc1RtZhYCOrCiudDtSoQCMv-M`,
                    '',
                    message,
                    bot,
                    args);
                } 
            }
            else if(link.startsWith("https://www.youtube.com/watch?") || link.startsWith('https://youtu.be/')){ //HA LINKET AD MEG A USER
                if(message.content.split(' ').length > 2){
                    return message.channel.send(new Discord.RichEmbed()
                        .setColor("#DABC12")
                        .addField("Hiba!","Az argumentum több elemet tartalmaz!"));
                }
                var vidID;
                if(link.startsWith("https://www.youtube.com/watch?")) vidID = link.split("?")[1].split('&')[0].substr(2);
                else if(link.startsWith("https://youtu.be/")) vidID = link.split('/')[3];
                if(vidID.match(/[a-zA-Z0-9_-]{11}/g)){ //HA video id formátum változna, át kellesz majd írni
                    if(!message.guild.voiceConnection) await message.member.voiceChannel.join()
                    servers = index.getServers();
                    if(!servers[message.guild.id]){
                        servers[message.guild.id] = {
                            queue: [],
                            information: [],
                            requestedBy: [],
                            requestedByProfPic: [],
                            skips: 0,
                            skippedBy: []
                        };
                    }
                    servers[message.guild.id].queue.push(link);
                    servers[message.guild.id].requestedBy.push(message.member.user.username);
                    servers[message.guild.id].requestedByProfPic.push(`https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png`);
                    await new Promise((resolve, reject)=>{
                        ytdl.getInfo(link,{downloadURL: true}, async(err,info)=>{
                            resolvable = servers[message.guild.id].information.push(info);
                            resolve(resolvable);
                        });
                    })
                    .then(()=>{
                        afterPromise(message,bot,args,link);
                    })
                    .catch((error)=>{
                        console.log(error);
                    });
                }
            }
            else{ //HA NEM LINKET AD MEG A USER
                arg = message.content.split(' ');
                let query = [];
                for(var i = 1; i<arg.length; i++){
                    query[i] = arg[i];
                }
                request(`https://www.googleapis.com/youtube/v3/search?part=id&q=${encodeURIComponent(query.join('+'))}&type=video&key=AIzaSyBHaQui_pXc1RtZhYCOrCiudDtSoQCMv-M&maxResults=1`,
                    async(error, response, body) =>{
                        if(response.statusCode === 200){
                            let data = JSON.parse(response.body);
                            let count = Object.keys(data.items).length;
                            if(count>0){
                                if(!message.guild.voiceConnection) await message.member.voiceChannel.join()
                                let vidID = data.items[0].id.videoId;
                                index = require("../index.js");
                                servers = index.getServers();
                                if(!servers[message.guild.id]){
                                    servers[message.guild.id] = {
                                        queue: [],
                                        information: [],
                                        requestedBy: [],
                                        requestedByProfPic: [],
                                        skips: 0,
                                        skippedBy: []
                                    };
                                }
                                servers[message.guild.id].queue.push(`https://www.youtube.com/watch?v=${vidID}`);
                                servers[message.guild.id].requestedBy.push(message.member.user.username);
                                servers[message.guild.id].requestedByProfPic.push(`https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png`);
                                index.setServers(servers);
                                new Promise((resolve, reject)=>{
                                    ytdl.getInfo(`https://www.youtube.com/watch?v=${vidID}`, {downloadURL: true}, async(err,info)=>{
                                        resolvable = servers[message.guild.id].information.push(info);
                                        resolve(resolvable);
                                    });
                                })
                            .then(()=>{
                                afterPromise(message,bot,args,servers[message.guild.id].queue[servers[message.guild.id].queue.length-1]);
                                return;
                            })
                            .catch((error)=>{
                                console.log(error);
                            });
                                
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
        else{
            return message.channel.send(new Discord.RichEmbed()
                .setColor("#DABC12")
                .addField("Hiba!","Nem vagyunk ugyanabban a szobában!"));
        }
        
    }
}
module.exports.help = {
    name: "play",
    type: "music",
    alias: ["p"]
}

module.exports.play = play;