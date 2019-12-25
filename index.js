const Discord = require("discord.js");
const fs = require("fs");
const botconfig = require("./botconfig.json");
const bot = new Discord.Client({ disableEveryone: true });
const request = require('request');
const autohentai = require('./autoHentai.json')
const autoanime = require('./autoAnime.json');
bot.commands = new Discord.Collection();
bot.type = new Discord.Collection();
servers = {};

//szólánchoz
const wordch = require("./wordchain.js");
const wordchainconfig = require("./wordchainconfig.json");
var wordchains = new Map();

Object.getOwnPropertyNames(wordchainconfig).forEach(
    function(v, i, a) {
        if (v !== "0") {
            wordchains.set(v, new wordch.Wordchain(v, wordchainconfig));
        }
    }
);

//vége

fs.readdir("./commands", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.endsWith(".js"));
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded`);
        bot.commands.set(props.help.name, props);
    });
    console.log("Every command is loaded!");
});

bot.on("message", async message => {
    if (message.author.bot) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let prefix = botconfig.prefix;
    switch (message.content) {
        case 'nigger':
            message.channel.send('nigger');
            break;
        case 'tsun':
            message.channel.send('É-é-ééén egyáltalán nem akarom, hogy rám figyelj vagy valami ilyesmi BAKA~!! >///<');
            break;
        case 'o7':
            message.channel.send('o7');
            break;
        case '\\o':
            message.channel.send('o/');
            break;
        case 'o/':
            message.channel.send('\\o');
            break;
            // Commit próba
        case 'commit':
            message.channel.send('pls működj légyszi');
            break;
    }
    if (message.content === prefix + "delwordchainch") {
        if (message.member.hasPermission("MANAGE_MESSAGES") || message.author.id === "211956737027211264") {
            await wordchains.delete(message.channel.id);
            await message.channel.send("Ez a szoba nem szólánc szoba többé!");
        } else {
            return message.channel.send("No ಠ_ಠ");
        }
    }
    if (wordchains.has(message.channel.id)) {
        await wordchains.get(message.channel.id).processMessage(message, cmd, wordchainconfig);
        fs.writeFileSync("./wordchainconfig.json", JSON.stringify(wordchainconfig));
    }

    if (message.content === prefix + "setwordchainch") {
        if (message.member.hasPermission("MANAGE_MESSAGES") || message.author.id === "211956737027211264") {
            await wordchains.set(message.channel.id, new wordch.Wordchain(message.channel.id, wordchainconfig));
            await message.channel.send("Ez a szoba beállítva szólánc szobának!");
        } else {
            return message.channel.send("No ಠ_ಠ");
        }

    }
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (botconfig.prefix === cmd.slice(0, prefix.length)) {
        log(message);
        try{
            if (commandfile && commandfile.type !== 'auto') commandfile.run(bot, message, args);
            else{
                bot.commands.forEach(element => {
                    if(element.help.alias){
                        var i = 0;
                        while(i<element.help.alias.length){
                            if(element.help.alias[i] === cmd.slice(prefix.length)){
                                element.run(bot,message,args);
                                break;
                            }
                            i++;
                        }
                    }
                });
            }
        }
        catch(err){
            if(err){
                errlog(err);
            }
        }
    }

});

function log(message){
    now = new Date();
    string = fs.readFileSync("./log.txt");
    string += "[" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDay()+ " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "]";
    string += " " + message.author.username + ": " + message.content + "\n";
    fs.writeFileSync("./log.txt", string);
}

function errlog(err){
    string = fs.readFileSync("./log.txt");
    string += err;
    fs.writeFileSync("./log.txt",string);
}

function loopAutoHentai(){
    timeH = Math.floor(Math.random() * (3600000 - 1800000) + 1800000);
    setTimeout(() => {
        if(autohentai){
            for(var attributum in autohentai){
                bot.commands.get('autohentai').run(bot,autohentai[attributum].channel);
            }
            loopAutoHentai();
        }
    }, timeH);
}

function loopAutoAnime(){
    timeA = Math.floor(Math.random() * (3600000 - 1800000) + 1800000);
    setTimeout(() => {
        if(autoanime){
            for(var attributum in autoanime){
                bot.commands.get('autoanime').run(bot,autoanime[attributum].channel);
            }
            loopAutoAnime();
        }
    }, timeA);
}

bot.on("ready", async() => {
    console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
    if (botconfig.activity_type.toUpperCase() == "STREAMING") {
        bot.user.setPresence({
            game: {
                name: botconfig.activity,
                type: botconfig.activity_type,
                url: botconfig.url
            }
        });
    } else {
        bot.user.setActivity(botconfig.activity, { type: botconfig.activity_type });
    }

    loopAutoHentai();
    
    loopAutoAnime();

    console.log(bot.commands);
});

bot.login(/*process.env.token*/"NjI2NTI3NDQ4ODU4ODg2MTg0.XdPYfg.d_6--U-ezGPg-58HqBh3-521pZs");

exports.servers = servers;