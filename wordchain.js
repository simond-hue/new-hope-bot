const fs = require("fs");
const Discord = require("discord.js");
const betuk = ['a', 'á', 'b', 'c', 'd', 'e', 'é', 'f', 'g', 'h', 'i', 'í', 'j', 'k', 'l', 'm', 'n', 'o', 'ó', 'ö', 'ő', 'p', 'q', 'r', 's', 't', 'u', 'ú', 'ü', 'ű', 'v', 'w', 'x', 'y', 'z'];

module.exports.Wordchain = class Wordchain {
    constructor(channelid, wordchconfig) {

        if (!wordchconfig[channelid]) {
            wordchconfig[channelid] = {
                channelid: channelid,
                start: false,
                lastID: undefined,
                lastCharacter: undefined,
                szavak: [],
                lancpontokid: [],
                lancpontok: []
            };
        }
        this.wordchainobj = wordchconfig[channelid];
        console.log(this.wordchainobj);
    }

    async processMessage(message, cmd, wordchconfig) {
        if (!this.wordchainobj.start) {
            var word = cmd.toLowerCase();
            if (word.length < 2) {
                message.delete().catch();
                await message.channel.send("Hosszabb szót írj!").then(msg => {
                    msg.delete(3000)
                });
                return this.wordchainobj;
            }
            for (var i = 0; i < word.length; i++) {
                let rossz = true;
                for (var j = 0; j < betuk.length; j++) {
                    if (word[i] == betuk[j]) {
                        rossz = false;
                        break;
                    }
                }
                if (rossz) {
                    message.delete().catch();
                    await message.channel.send("Nem megfelelő karaktert használtál!").then(msg => {
                        msg.delete(3000)
                    });
                    return this.wordchainobj;
                }
            }
            this.wordchainobj.lastID = message.author.id;
            if (word.endsWith("cs") || word.endsWith("ty") || word.endsWith("zs") || word.endsWith("sz") || word.endsWith("ny") || word.endsWith("dz") || word.endsWith("gy") || word.endsWith("ly")) {
                this.wordchainobj.lastCharacter = word[word.length - 2] + word[word.length - 1];
            } else if (word.endsWith("dzs")) {
                this.wordchainobj.lastCharacter = word[word.length - 3] + [word.length - 2] + word[word.length - 1];
            } else this.wordchainobj.lastCharacter = word[word.length - 1];
            this.wordchainobj.start = true;
            this.wordchainobj.szavak.push(word);
            message.channel.send("A legelső szó: " + word);
            this.wordchainobj.lancpontokid.push(this.wordchainobj.lastID);
            this.wordchainobj.lancpontok.push(1);
            wordchconfig[message.channel.id] = this.wordchainobj;
            await message.channel.send("A következő szónak ezzel a karakterrel kell kezdődnie: " + this.wordchainobj.lastCharacter);
            return this.wordchainobj;
        } else if (this.wordchainobj.start) {
            if (message.author.id === this.wordchainobj.lastID) {
                message.delete().catch();
                await message.channel.send("Nem írhatsz egymás után kétszer!").then(msg => {
                    msg.delete(3000)
                });
                return this.wordchainobj;
            }
            word = cmd.toLowerCase();
            if (word.length < 2) {
                message.delete().catch();
                await message.channel.send("Hosszabb szót írj!").then(msg => {
                    msg.delete(3000)
                });
                return this.wordchainobj;
            }
            for (var i = 0; i < word.length; i++) {
                var rossz = true;
                for (var j = 0; j < betuk.length; j++) {
                    if (word[i] == betuk[j]) {
                        rossz = false;
                        break;
                    }
                }
                if (rossz) {
                    message.delete().catch();
                    await message.channel.send("Nem megfelelő karaktert használtál!").then(msg => {
                        msg.delete(3000)
                    });
                    return this.wordchainobj;
                }
            }
            if (word.startsWith(this.wordchainobj.lastCharacter)) {
                for (var i = 0; i < this.wordchainobj.szavak.length; i++) {
                    if (word === this.wordchainobj.szavak[i]) {
                        let user = undefined;
                        let current = 0;
                        for (var j = 0; j < this.wordchainobj.lancpontok.length; j++) {
                            if (this.wordchainobj.lancpontok[j] > current) {
                                let tempusr = message.guild.members.get(this.wordchainobj.lancpontokid[j]);
                                if (tempusr !== undefined) {
                                    current = this.wordchainobj.lancpontok[j];
                                    user = tempusr;
                                }
                            }
                        }
                        var coins = require(`./files/points.json`);
                        if (!coins[user]) {
                            coins[user] = {
                                coins: 1
                            };
                        } else {
                            coins[user].coins += 1;
                        }
                        let data = JSON.stringify(coins);
                        fs.writeFileSync(`./files/points.json`, data);

                        this.wordchainobj = {
                            channelid: message.channel.id,
                            start: false,
                            lastID: undefined,
                            lastCharacter: undefined,
                            szavak: [],
                            lancpontokid: [],
                            lancpontok: []
                        };

                        wordchconfig[message.channel.id] = this.wordchainobj;
                        let wordChainEmbedEnd = new Discord.RichEmbed()
                            .setDescription("A játék véget ért! Nem használhatjátok kétszer ugyan azt a szót!")
                            .setColor("#314e5f")
                            .addField("Aki elrontotta a szóláncot:", `<@${message.author.id}>`)
                            .addField(`A legtöbb szót író személy: <@${user.id}>`, `Akinek ${coins[user].coins} pontja van.`);
                        await message.channel.send(wordChainEmbedEnd);
                        return this.wordchainobj;
                    }
                }
                if (word.endsWith("cs") || word.endsWith("ty") || word.endsWith("zs") || word.endsWith("sz") || word.endsWith("ny") || word.endsWith("dz") || word.endsWith("gy") || word.endsWith("ly")) {
                    this.wordchainobj.lastCharacter = word[word.length - 2] + word[word.length - 1];
                } else if (word.endsWith("dzs")) {
                    this.wordchainobj.lastCharacter = word[word.length - 3] + [word.length - 2] + word[word.length - 1];
                } else this.wordchainobj.lastCharacter = word[word.length - 1];
                this.wordchainobj.lastID = message.author.id;
                this.wordchainobj.szavak.push(word);
                if (this.wordchainobj.lancpontokid.includes(message.author.id)) {
                    this.wordchainobj.lancpontok[this.wordchainobj.lancpontokid.indexOf(message.author.id)] += 1;
                } else {
                    this.wordchainobj.lancpontokid.push(message.author.id);
                    this.wordchainobj.lancpontok.push(1);
                }
                wordchconfig[message.channel.id] = this.wordchainobj;
                await message.channel.send("A következő szónak ezzel a betűvel kell kezdődnie: " + this.wordchainobj.lastCharacter);
                return this.wordchainobj;
            } else {
                message.delete().catch();
                await message.channel.send("Nem megfelelő betűvel kezdted a szót!").then(msg => {
                    msg.delete(3000)
                });
                return this.wordchainobj;
            }
        }
    }
}