const Commando = require('discord.js-commando');
const bot = new Commando.Client();
const token = '1vj6Hx06b-Y8gA9GpveLDAbKGHMCBe9a';

bot.registry.registerGroup('simple', 'Simple');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + '/commands');

bot.on('message', function(xd){
    if(xd.author.bot) return;
    else
    {
        switch(xd.content){
            case 'nigger': xd.channel.send('nigger'); break;
            case 'tsun': xd.channel.send('É-é-ééén egyáltalán nem akarom, hogy rám figyelj vagy valami ilyesmi BAKA~!! >///<'); break;
            case 'o7': xd.channel.send('o7'); break;
            case '\\o': xd.channel.send('o/'); break;
            case 'o/': xd.channel.send('\\o'); break;
        }
    }
});

bot.on('ready', function(){
    console.log('Készen állok tes');
});

bot.login(token);