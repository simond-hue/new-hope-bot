const Discord = require("discord.js");
const request = require('request');

module.exports.run = async(bot, message, args) => {
    let name = args.join(" ");
    if (name == "") {
        name = message.author.username;
    }
    let osuEmbed = new Discord.RichEmbed()
        .setColor("#ff6ae7")
        .setThumbnail("https://images.discordapp.net/avatars/289066747443675143/0d8ad3a7a6b0a56f3527019c00ccc4b0.png");
    request(`https://osu.ppy.sh/api/get_user?k=ff99e1fd848cec589c11b99b773bfcd49d132e9a&u=${name}&type=string`, (error, response, body) => {
        let profile = JSON.parse(response.body)[0];
        if(profile == undefined) message.channel.send(new Discord.RichEmbed()
            .setColor("#ff6ae7")
            .addField("Hiba!","Nem megfelelő felhasználónév!"));
        else{
            let data = response.body;
            profile = JSON.parse(data)[0];
            request(`https://osu.ppy.sh/api/get_user_recent?k=ff99e1fd848cec589c11b99b773bfcd49d132e9a&u=${name}&limit=1&type=string`, (error, response, body) => {
                let data = response.body;
                let recentScore = JSON.parse(data)[0];
                
                if (recentScore == undefined) {
                    message.channel.send(new Discord.RichEmbed()
                        .setColor("#ff6ae7")
                        .addField(`${profile.username} játékosnak nem volt mostanában play-e!`, "Próbáld újra!"));
                } 
                else {
                    request(`https://osu.ppy.sh/api/get_beatmaps?k=ff99e1fd848cec589c11b99b773bfcd49d132e9a&b=${recentScore.beatmap_id}`, (error, response, body) => {
                        let data = response.body;
                        let beatmap = JSON.parse(data)[0];

                        var count300 = parseInt(recentScore.count300);
                        var count100 = parseInt(recentScore.count100);
                        var count50 = parseInt(recentScore.count50);
                        var countmiss = parseInt(recentScore.countmiss);

                        var score3 = count300 * 300;
                        var score1 = count100 * 100;
                        var score5 = count50 * 50;

                        var divider = (count300 + count100 + count50 + countmiss) * 300;

                        let accuracy = ((score3 + score1 + score5) * 1.0 / divider * 100).toFixed(2);

                        let i;
                        var emote;
                        let modsName = new Map();
                        switch (recentScore.rank) {
                            case "SS":
                                emote = "<:rankingSSsmall:481162115382509568>";
                                break;
                            case "S":
                                emote = "<:rankingSsmall:481162134726901770>";
                                break;
                            case "A":
                                emote = "<:rankingAsmall:481162172962045982>";
                                break;
                            case "B":
                                emote = "<:rankingBsmall:481162185192767499>";
                                break;
                            case "C":
                                emote = "<:rankingCsmall:481162196919910422>";
                                break;
                            case "D":
                                emote = "<:rankingDsmall:481162208634470404>";
                                break;
                            case "F":
                                emote = "<:rankingFsmall:496669845446852608>";
                                break;
                            case "XH":
                                emote = "<:rankingXHsmall:627598978468413460>";
                                break;
                            default:
                                emote = recentScore.rank;
                        }
                        let enabledMods = recentScore.enabled_mods;
                        let mods = "";
                        if (enabledMods === 0) {
                            mods = "NM";
                        } else {
                            modsName.set(1, "NF");
                            modsName.set(2, "EZ");
                            modsName.set(4, "TD");
                            modsName.set(8, "HD");
                            modsName.set(16, "HR");
                            modsName.set(32, "SD");
                            modsName.set(64, "DT");
                            modsName.set(128, "RX");
                            modsName.set(256, "HT");
                            modsName.set(576, "NC");
                            modsName.set(1024, "FL");
                            modsName.set(2048, "AU");
                            modsName.set(4096, "SO");
                            modsName.set(8192, "AP");
                            modsName.set(16384, "PF");
                            modsName.set(32768, "K4");
                            modsName.set(65536, "K5");
                            modsName.set(131072, "K6");
                            modsName.set(262144, "K7");
                            modsName.set(524288, "K8");
                            modsName.set(1048576, "FI");
                            modsName.set(2097152, "RN");
                            modsName.set(4194304, "CN");
                            modsName.set(8388608, "TG");
                            modsName.set(16777216, "K9");
                            modsName.set(33554432, "KC");
                            modsName.set(67108864, "K1");
                            modsName.set(134217728, "K3");
                            modsName.set(268435456, "K2");
                            modsName.set(536870912, "SV2");
                            modsName.set(1073741824, "LM");
                        }
                        let modName = "";
                        for (i = 33; i > -1; i--) {

                            let modsCount = 33;

                            for (i = modsCount; i > -1; i--) {
                                let value = Math.pow(2, i);

                                if (enabledMods >= value) {
                                    modName += modsName.get(value);

                                    switch (modName) {
                                        case "NC":
                                            {
                                                enabledMods -= 64;
                                                break;
                                            }
                                        case "PF":
                                            {
                                                enabledMods -= 32;
                                                break;
                                            }
                                    }
                                    enabledMods -= value;
                                }
                            }
                        }
                        if (modName === undefined) {
                            modName = "";
                        } else {
                            modName = "+" + modName;
                        }


                        message.channel.send(new Discord.RichEmbed()
                            .setAuthor(`${profile.username}'s osu profile`, `https://a.ppy.sh/${profile.user_id}`, `https://osu.ppy.sh/users/${profile.user_id}`)
                            .setColor("#ff6ae7")
                            .setThumbnail(`https://a.ppy.sh/${profile.user_id}`)
                            .setDescription(`[${beatmap.title} by ${beatmap.artist}](https://osu.ppy.sh/beatmapsets/${beatmap.beatmapset_id})`)
                            .addField("Rank and mods:", `${emote} ${modName}`, true)
                            .addField("Score", recentScore.score, true)
                            .addField("Accuracy", `${accuracy}%`, true)
                            .addField("PP", "i'm lazy to calculate it", true)
                            .addField("Combo", `${recentScore.maxcombo}x / <${beatmap.max_combo}x`)
                            .addField("Hits", `[${recentScore.count300} ${recentScore.count100} ${recentScore.count50} ${recentScore.countmiss}] \n 300  100  50  X`)
                            .addField("Map stats", `AR: ${beatmap.diff_approach} OD: ${beatmap.diff_size} Stars: ${parseInt(beatmap.difficultyrating).toFixed(2)}`)
                            .setTimestamp(new Date(recentScore.date).toString()));

                    });
                }
            });
        }
        
    });
}
module.exports.help = {
    name: "recent",
    type: "osu"
}
