const Discord = require("discord.js");
const rApi = require('ripple-node');


module.exports.run = async (bot, message, args) => {
    let name = args.join(" ");
    if (name == undefined) {
        name = message.author.username;
    }
    rApi.getUserRecentScore(name).then(async recentScore => {
        console.log(recentScore);
        if (recentScore.scores == null) {
            return message.channel.send("This player doesn't have a recent play!");
        }
        else {
            let i;
            var emote;
            let modsName = new Map();
            switch (recentScore.scores[0].rank) {
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
            }
            let enabledMods = recentScore.scores[0].mods;
            let mods = "";
            if (enabledMods === 0) {
                mods = "NM";
            }
            else {
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
            let modName;
            for (i = 33; i > -1; i--) {

                let modsCount = 33;

                for (i = modsCount; i > -1; i--) {
                    let value = Math.pow(2, i);

                    if (enabledMods >= value) {
                        modName = modsName.get(value);

                        switch (modName) {
                            case "NC": {
                                enabledMods -= 64;
                                break;
                            }
                            case "PF": {
                                enabledMods -= 32;
                                break;
                            }
                        }
                        enabledMods -= value;
                    }
                }
            }
            if (modName == undefined) {
                modName = "";
            }
            else {
                modName = "+" + modName;
            }
            let accuracy = recentScore.scores[0].accuracy.toFixed(2);
            rApi.getUserByName(args[0]).then(profile => {
                message.channel.send(new Discord.RichEmbed()
                    .setAuthor(`${profile.username}'s ripple profile`, `https://a.ripple.moe/${profile.id}`, `https://ripple.moe/users/${profile.id}`)
                    .setColor("#ff6ae7")
                    .setThumbnail("https://images.discordapp.net/avatars/289066747443675143/0d8ad3a7a6b0a56f3527019c00ccc4b0.png")
                    .setDescription(`[${recentScore.scores[0].beatmap.song_name}](https://osu.ppy.sh/beatmapsets/${recentScore.scores[0].beatmap.beatmapset_id})`)
                    .addField("Rank and mods:", `${emote} ${modName}`, true)
                    .addField("Score", recentScore.scores[0].score, true)
                    .addField("Accuracy", `${accuracy}%`, true)
                    .addField("PP", Math.floor(recentScore.scores[0].pp), true)
                    .addField("Combo", `${recentScore.scores[0].max_combo}x / <${recentScore.scores[0].beatmap.max_combo}x`)
                    .addField("Hits", `300  100  50  X \n [${recentScore.scores[0].count_300} ${recentScore.scores[0].count_100} ${recentScore.scores[0].count_50} ${recentScore.scores[0].count_miss}]`)
                    .addField("Map stats", `AR: ${recentScore.scores[0].beatmap.ar} OD: ${recentScore.scores[0].beatmap.od} Stars: ${Math.floor(recentScore.scores[0].beatmap.difficulty, -2)}`)
                    .setTimestamp(new Date(recentScore.scores[0].time).toString()));
            });
        }
    });
}
module.exports.help = {
    name: "ripple-recent",
    type: "osu"
}
