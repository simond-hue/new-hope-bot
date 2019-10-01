const Discord = require("discord.js");
const request = require('request');


module.exports.run = async(bot, message, args) => {

    let name = args.join(" ");
    if (name === undefined) {
        name = message.author.username;
    }

    request(`https://osu.ppy.sh/api/get_user?k=ff99e1fd848cec589c11b99b773bfcd49d132e9a&u=${name}&type=string`, (error, response, body) => {
        let data = response.body;
        if (data === "[]") {
            return message.channel.send("That user could not be found!");
        }
        let obj = JSON.parse(data)[0];
        let osuEmbed = new Discord.RichEmbed()
            .setAuthor(`${obj.username}'s osu profile`, `https://a.ppy.sh/${obj.user_id}`, `https://osu.ppy.sh/users/${obj.user_id}`)
            .setColor("#ff6ae7")
            .setThumbnail(`https://a.ppy.sh/${obj.user_id}`)
            .addField("PP", `**Ranked:** #${obj.pp_rank} \n **Country:** #${obj.pp_country_rank} ${obj.country} \n **Raw PP:** ${obj.pp_raw}`, true)
            .addField("Map ranks:", `**SS:** ${obj.count_rank_ss} \n **S:** ${obj.count_rank_s} \n **A:** ${obj.count_rank_a}`, true)
            .addField("Hit:", `**300:** ${obj.count300} \n **100:** ${obj.count100} \n **50:** ${obj.count50}`, true)
            .addField("Other things:", `**Accuracy:** ${Math.floor(obj.accuracy)}% \n **Level:** ${obj.level} \n **Playcount:** ${obj.playcount}`, true)
            .addField("Score:", `**Ranked score:** ${obj.ranked_score} \n **Total score:** ${obj.total_score}`, true);

        return message.channel.send(osuEmbed);


    });




}
module.exports.help = {
    name: "osu",
    type: "osu"
}