const Discord = require("discord.js");
const fs = require("fs");
const botconfig = require("./botconfig.json");
const bot = new Discord.Client({ disableEveryone: true });
bot.commands = new Discord.Collection();
bot.type = new Discord.Collection();

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
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(botconfig.prefix === cmd.slice(0,prefix.length)){
        if (commandfile) commandfile.run(bot, message, args);
    }
    
});

bot.on("ready", async() => {
    console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
    if(botconfig.activity_type.toUpperCase() == "STREAMING"){
        bot.user.setPresence({
            game: {
                name: botconfig.activity,
                type: botconfig.activity_type,
                url: botconfig.url
            }
        });
    }
    else{
        bot.user.setActivity(botconfig.activity, { type: botconfig.activity_type });
    }
    console.log(bot.commands);
});

bot.login(botconfig.token);