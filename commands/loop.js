const Discord = require("discord.js");
const index = require("../index.js");

function giveError(message, msg){
    return message.channel.send(new Discord.RichEmbed().setColor('#DABC12').setTitle(msg));
}

module.exports.run = async (bot, message, args) => {
    if(!message.guild.voiceConnection) return giveError(message, 'Nem vagyok voice channelen!');
    if(!message.member.voiceChannel) return giveError(message, 'Voice channelben kell lenned, hogy meg tudd állíani a zenelejátszót!');
    let server = index.servers[message.guild.id];
    if(server.information[server.shuffleind].player_response.videoDetails.isLive) return giveError(message,'Live-ot nem lehet loop-olni!');
    if(servers[message.guild.id].summonedChannel !== message.member.voiceChannel.id && message.member.voiceChannel.members.get('626527448858886184'))
        if(message.member.voiceChannel.id === message.member.voiceChannel.members.get('626527448858886184').voiceChannelID)
            servers[message.guild.id].summonedChannel = message.member.voiceChannel.id;
    if(server.summonedChannel !== message.member.voiceChannel.id) return giveError(message, 'Nem vagyunk ugyanabban a szobában!');
    if(!server.dispatcher) return giveError(message, 'Nincs zene a lejátszóban!');
    if(server.looped) return giveError(message, 'A zene már loop-olva van!');

    server.looped = true;

    return giveError(message, 'Loop-olva!');
}
module.exports.help = {
    name: "loop",
    type: "music",
    alias: ['cycle', 'l']
}