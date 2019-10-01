const Discord = require("discord.js");
const rApi = require('ripple-node');


module.exports.run = async (bot, message, args) => {
    if (args[0] === undefined) return message.channel.send("pico-ripple user");
    let name = args.join(" ");
    if (name == undefined) {
        name = message.author.username;
    }

    rApi.getUserByName(name).then(profile => {
         if (profile.code === 404){
              return message.channel.send(profile.message);
          }
            let osuEmbed = new Discord.RichEmbed()
                .setAuthor(`${profile.username}'s osu profile`, `https://a.ripple.moe/${profile.id}`, `https://ripple.moe/users/${profile.id}`)
                .setColor("#ff6ae7")
                .setThumbnail("https://images.discordapp.net/avatars/289066747443675143/0d8ad3a7a6b0a56f3527019c00ccc4b0.png")
                .addField("PP", `**Ranked:** #${profile.std.global_leaderboard_rank} \n **Country:** #${profile.std.country_leaderboard_rank} ${profile.country} \n **Raw PP:** ${profile.std.pp}`, true)
                .addField("Score:", `**Ranked score:** ${profile.std.ranked_score} \n **Total score:** ${profile.std.total_score}`, true)
                .addField("Other things:", `**Accuracy:** ${profile.std.accuracy.toFixed(2)}% \n **Level:** ${profile.std.level.toFixed(2)} \n **Playcount:** ${profile.std.playcount}`, true);

        return message.channel.send(osuEmbed);

    });
        }
module.exports.help = {
    name: "ripple",
    type: "osu"
}
