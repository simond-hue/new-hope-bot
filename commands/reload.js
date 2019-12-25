const Discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    let botconfig = require("../botconfig.json");
    message.channel.send(new Discord.RichEmbed()
        .setColor("#DABC12")
        .addField("Újraindítás...", "Újraindítás..."))
    .then(msg => bot.destroy())
    .then(() => bot.login(/*process.env.token*/"NjI2NTI3NDQ4ODU4ODg2MTg0.XdPYfg.d_6--U-ezGPg-58HqBh3-521pZs"));
    bot.commands = new Discord.Collection();
    fs.readdir("./commands", (err, files) => {
        if (err) console.log(err);
    
        let jsfile = files.filter(f => f.endsWith(".js"));
        if (jsfile.length <= 0) {
            console.log("Couldn't find commands.");
            return;
        }
    
        jsfile.forEach((f, i) => {
            let props = require(`./${f}`);
            console.log(`${f} loaded`);
            bot.commands.set(props.help.name, props);
        });
        console.log("Every command is loaded!");
    });
}
module.exports.help = {
    name: "reload",
    type: "botconfig"
}
