const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");

process.on('uncaughtException', err =>{
    console.log('error: ' + err);//STOPS THE BOT FROM CRASHING
});

bot.on('ready',() => {
	console.log(`Connected! ${config.emojis.success}`);
	bot.channels.get("265446863350661131").sendMessage(`${bot.user.username} test works`);
  bot.destroy()
});

bot.login(config.token);
