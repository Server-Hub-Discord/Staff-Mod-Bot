//modules
const moment = require('moment');
const randomcolor = require('randomcolor');
const Discord = require("discord.js");

//bot client
const bot = new Discord.Client();

//json(s)
const config = require("./config.json");



process.on('uncaughtException', err =>{
	console.log(moment().format("Do MMMM YYYY ") + 'error: ' + err);//STOPS THE BOT FROM CRASHING
});

bot.on('ready',() => {
	console.log(`---------------------------------------------`)
	console.log(`Connected! ${config.emojis.success}`);
	console.log(`Logged in as ${bot.user.username}`);
	console.log(`token = ${config.token}`);
	console.log(`game = ${config.setgame}`);
	console.log(`prefix = ${config.client.prefix}`);
	console.log(`console emojis = ${config.emojis}`)
	console.log(`---------------------------------------------`)
	bot.user.setGame(config.setgame);
});

bot.on("guildMemberAdd", member =>{
  bot.channels.get("260884608667615243").sendMessage("", {embed: {
		color: 0xFFFF00,
		description: `${member.user} Welcome to Server Hub! A place where you can advertise your server! Post your server in #submit_server and make sure to read #info and #rules :smile: `
	}}).catch(console.error);
});

bot.on("guildBanAdd", member =>{
	bot.channels.get("227815924135231488").sendMessage("", {embed: {
		color: 0xFF0000,
		description: `:hammer: **User Banned:** ${member.user.username}#${member.user.discriminator} (${member.id})`
	}}).catch(console.error);
});

bot.on("guildBanRemove", member =>{
	bot.channels.get("227815924135231488").sendMessage("", {embed: {
		color: 0x00FF00,
		description: `:hammer: **User Unbanned:** ${member.user.username}#${member.user.discriminator} (${member.id})`
	}}).catch(console.error);
	banid.banids.push(member.id);
});

bot.on("guildMemberRemove", member => {
	bot.channels.get("260884608667615243").sendMessage("", {embed: {
		color: 0xFFFF00,
		description: `${member.user.username}#${member.user.discriminator} just left the server`
	}}).catch(console.error);
});

bot.on("guildCreate", guild => {
	console.log(`New guild added : ${guild.name}, owned by ${guild.owner.user} ${config.emojis.working}`).catch(console.error);
	if (!guild.id === '260882540238209024') {
		var noto = `Hey I'm ${bot.user.username}.\n Unfortunatley I'm a bot made for this server only https://discord.gg/tPksgxK.\n Feel free to join ;) but please dont use commands unless they're normal shitposting commands`;
		var embed = new Discord.RichEmbed();
			embed.setColor(randomcolor())
				.setDescription(noto)
		guild.defaultChannel.sendEmbed(
			embed, {
				disableEveryone: true
			}
		);
	}
}); // this code does so that when the bot joins a server it says to the hoster

bot.on('message', message => { //start of command list

	if(message.author.bot) return;
  let args = message.content.split(" ").slice(1);
  var argresult = args.join(" ");

  if (message.content.startsWith('[]' + 'eval')) {
    if(message.author.id !== "226003765889597440") return;
    try {
      var code = args.join(" ");
      var evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);

      message.channel.sendCode("xl", clean(evaled));
      message.delete();
    } catch (err) {
      message.channel.sendMessage(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  }
	if(!message.content.startsWith(config.client.prefix))return;

	let command = message.content.split(" ")[0];
	command = command.slice(config.client.prefix.length);


	let guild = message.guild

	if (command === "wiki") {
		message.channel.sendMessage('https://github.com/Server-Hub-Discord/Staff-Mod-Bot/wiki');
	}
	if (command === "membercount") {
		message.channel.sendMessage(`${message.guild.memberCount}`);
	}
	if (command === "lmeo") {
		message.channel.sendMessage("L\nM\nA\nO\no\no\no\n。\n。\n.\n.\n.");
	}
	if (command === "serverinfo") {
        let guild = message.guild;
        function online(m) {
          return m.presence.status === "online"
        }
        message.channel.sendMessage(" ", {embed: {
          color: 0x006400,
          author: {
            name: guild.name,
            icon_url: guild.iconURL,
          },
          description: `ID: ${guild.id}`,
          fields: [
            {
              name: "Default Channel",
              value: guild.defaultChannel.toString()
            },
            {
              name: "Region",
              value: guild.region
            },
            {
              name: `Members [${guild.memberCount}]`,
              value: message.guild.members.filter(online).size
            },
            {
              name: "Server Owner",
              value: `${guild.owner.user.username}#${guild.owner.user.discriminator} (${guild.owner.id})`
            },
            {
              name: "Created On",
              value: guild.createdAt
            }
          ],
          timestamp: new Date(),
          footer: {
            icon_url: bot.user.avatarURL,
            text: '© Staff-Mod-Bot'
          }

        }}).catch(console.error);
    }
	if (command === "botservers") {
		message.channel.sendMessage(bot.guilds.map(g => `${g.name} | ${g.memberCount}`));
	}
	if (command === "setbotavatarurl") {
		if (!config.creator.Jimmy.includes(message.author.id)) {
			return message.reply("pleb ur not the bot creator").catch(console.error);
		}
		let args = message.content.split(" ").slice(1);
		let text = args[0];
		bot.user.setAvatar(text);
		message.channel.sendMessage("my profile pic has been changed to " + text);
	}
	if (command === 'embed') {
		let modRole = message.guild.roles.find("name", "Staff");
		if (!(message.member.roles.has(modRole.id) || config.creator.Jimmy.includes(message.author.id))) {
			return message.reply("pleb ur not staff").catch(console.error);
		}
		let noto = message.content.split(" ").slice(1).join(" ");
		const embed = new Discord.RichEmbed()
    embed.setColor(randomcolor())
			.setDescription(noto)
		message.channel.sendEmbed(
			embed, {
				disableEveryone: true
			}
		);
	}
	if (command === "setgame") {
		if (!config.creator.Jimmy.includes(message.author.id)) {
			return message.reply("pleb ur not Jimmy").catch(console.error);
		}
		bot.user.setGame(argresult);
	}
	if (command === "setstatus") {
		if (!config.creator.Jimmy.includes(message.author.id)) {
			return message.reply("pleb ur not Jimmy").catch(console.error);
		}
		bot.user.setStatus(argresult);
	}
	if (command === "date") {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day  = date.getDate();
		message.channel.sendMessage("it's the **`" + day + "/" + month + "/" + year + "`** in Belgium");
	}
	if (command === "addrole") {
		let modRole = message.guild.roles.find("name", "Staff");
		if(!(message.member.roles.has(modRole.id) || config.creator.Jimmy.includes(message.author.id))) {
			return message.reply("pleb ur not admin").catch(console.error);
		}
		let args = message.content.split(' ');
		args.shift();
		args.shift();
		let role = message.guild.roles.find("name", args.join(" "));
		// Let's pretend you mentioned the user you want to add a role to (!addrole @user Role Name):
		let member = message.guild.member(message.mentions.users.first());
		// or the person who made the command: let member = msg.member;
		// Add the role!
		member.addRole(role.id).catch(console.error);
		message.channel.sendMessage("role " + args.join(" ") + " has been added  👍");

	}
	if (command === "delrole") {
		let modRole = message.guild.roles.find("name", "Staff");
		if(!(message.member.roles.has(modRole.id) || config.creator.Jimmy.includes(message.author.id))) {
			return message.reply("pleb ur not mod").catch(console.error);
		}
		let args = message.content.split(' ');
		args.shift();
		args.shift();
		let role = message.guild.roles.find("name", args.join(" "));
		// Let's pretend you mentioned the user you want to add a role to (!addrole @user Role Name):
		let member = message.guild.member(message.mentions.users.first());
		// or the person who made the command: let member = msg.member;
		member.removeRole(role.id).catch(console.error);
		message.channel.sendMessage("role " + args.join(" ") + " has been deleted 👍");
	}
	if (command === "sourcecode"){
		message.channel.sendMessage("https://github.com/Server-Hub-Discord/staff-mod-bot");
	}
	if (command === "avatar") {
		let args = message.content.split(' ');
		args.shift();
		args.shift();
		let member = message.guild.member(message.mentions.users.first());
    if (!member) {
      message.channel.sendMessage(message.author.avatarURL);
      return;
    }
		return message.reply(member.user.avatarURL)
	}
	if (command === "announce"){
		let modRole = message.guild.roles.find("name", "Staff");
		if (!(message.member.roles.has(modRole.id) || config.creator.Jimmy.includes(message.author.id))) {
			return message.reply("pleb ur not admin").catch(console.error);
		}
		let noto = message.content.split(" ").slice(1).join(" ");
	  bot.channels.get('260884357894373376').sendMessage("**:information_source: Announcement [" + moment().format("Do MMMM YYYY ") + "]**", {embed: {
			color: 0x00b7c6,
			description: noto,
			footer: {
				text: `${message.author.username}#${message.author.discriminator}`,
				icon_url: message.author.avatarURL
			}
		}}).catch(console.error);
    message.delete();
	}
	if (command === "ping"){
		message.channel.sendMessage("Yes, yes I'm on").catch(console.error);
	}
	if (command === "creator"){
		var embed = new Discord.RichEmbed();
		embed.setColor(randomcolor())
		.setDescription(`my creator is <@${config.creator.Jimmy}>`)
		message.channel.sendEmbed(
			embed, {
				disableEveryone: true
			}
		);
	}
  if (command === "help") {
      message.channel.sendMessage("check your dms :rocket:").catch(console.error);
      let modRole = message.guild.roles.find("name", "Staff");
      let adminRole = message.guild.roles.find("name", "Owner");
      var cmds = ``;
      cmds += `**My Normal Commands are:** \n ${config.client.prefix}membercount \n ${config.client.prefix}serverinfo \n ${config.client.prefix}botservers \n ${config.client.prefix}date \n ${config.client.prefix}sourcecode \n ${config.client.prefix}avatar \n ${config.client.prefix}ping \n ${config.client.prefix}creator \n ${config.client.prefix}help \n ${config.client.prefix}stats \n ${config.client.prefix}myuserinfo`;
      if (message.member.roles.has(modRole.id) || config.creator.Jimmy.includes(message.author.id)) {
          cmds += `\n\n **My Staff commands are** \n ${config.client.prefix}embed [what you want to embed] \n ${config.client.prefix}addrole {user} [role] \n ${config.client.prefix}delrole {user} [role] \n ${config.client.prefix}announce [what you want to announce in #announcements] \n ${config.client.prefix}say [what you want to say] \n ${config.client.prefix}kick {user} \n \n more details on how to use these commands coming soon`;
      }
      if (message.member.roles.has(adminRole.id) || config.creator.Jimmy.includes(message.author.id)) {
          cmds += `\n\n **My Owner/Creator Commands are:** \n ${config.client.prefix}setbotavatarurl (only Jimmy) \n ${config.client.prefix}setstatus (only Jimmy) \n ${config.client.prefix}shutdown \n ${config.client.prefix}restart`;
      }
      message.author.sendMessage(" ", {
          embed: {
              color: 0x00b7c6,
          title: "Command List",
          description: cmds,
    }}).catch(console.error);

  }
  if (command === "say") {
      let modRole = message.guild.roles.find("name", "Staff");
      if (!(message.member.roles.has(modRole.id) || config.creator.Jimmy.includes(message.author.id))) {
          return message.reply("pleb ur not an admin").catch(console.error);
      }
      let CHannel = args[0];
      if (CHannel !== message.mentions.channels.first()) {
        return message.reply(args.join(" ")).catch(console.error);
      }
      if(CHannel == message.mentions.channels.first()){
      let CHaNnel = message.mentions.channels.first();
      const messageContent = message.content.split(" ").slice(3).join(" ");
      CHaNnel.sendMessage(messageContent).catch(console.error);
      message.delete();
    }
  }
  if (command === "kick") {
    let modRole = message.guild.roles.find("name", "Staff");
    if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
        return message.reply("pleb ur not an admin").catch(console.error);
    }
  // I'll make a code example on how to check if the user is allowed, one day!
    let userToKick = message.mentions.users.first();
    //we need to get a *GuildMember* object, mentions are only users. Then, we kick!
    message.guild.member(userToKick).kick();
    message.channel.sendMessage(`kicked.`);
  // see I even catch the error!
}
	if (command === "shutdown") {
		let modRole = message.guild.roles.find("name", "Owner");
		let userToKick = message.mentions.users.first();
		if(!(message.member.roles.has(modRole.id) || config.creator.Jimmy.includes(message.author.id))) {
				return message.reply("pleb ur not admin").catch(console.error);
		}
		message.channel.sendMessage("no hanky panky while I'm gone ok :wave:")
		bot.destroy()
	}
	if (command === "stats") {
		var embed = new Discord.RichEmbed();
		embed.setColor(randomcolor())
			.setFooter(' ', ' ')
			.setThumbnail(`${bot.user.avatarURL}`)
			.setTimestamp()
			.addField('Servers', `${bot.guilds.size}`, true)
			.addField('Users', `${bot.users.size}`, false)
			.addField('Discord Version', `${Discord.version}`, false)
			.addField('Uptime', (Math.round(bot.uptime / (1000 * 60 * 60))) + " hours, " + (Math.round(bot.uptime / (1000 * 60)) % 60) + " minutes, and " + (Math.round(bot.uptime / 1000) % 60) + " seconds")
		message.channel.sendEmbed(
			embed, {
				disableEveryone: true
			}
		);
	}
	if (command === "myuserinfo") {
    let member = message.guild.member(message.mentions.users.first());
    if (!member) {
      var embed = new Discord.RichEmbed();
  		embed.addField("Username", `${message.author.username}#${message.author.discriminator}`, true)
  			.addField("ID", `${message.author.id}`, true)
  			.setColor(randomcolor())
  			.setFooter(' ', ' ')
  			.setThumbnail(`${message.author.avatarURL}`)
  			.setTimestamp()
  			.setURL(`${message.author.avatarURL}`)
  			.addField('Currently', `${message.author.presence.status}`, true)
  			.addField('Game', `${message.author.presence.game === null ? "No Game" : message.author.presence.game.name}`, true)
  			.addField('Joined Discord', `${moment(message.author.createdAt).format('DD.MM.YY')}`, true)
  			.addField('Joined Server', `${moment(message.member.joinedAt).format('DD.MM.YY')}`, true)
  			.addField('Roles', `\`${message.member.roles.filter(r => r.name).size}\``, true)
  			.addField('Is Bot', `${message.author.bot}`, true)
  		message.channel.sendEmbed(
  			embed, {
  				disableEveryone: true
  			}
  		);
    }
		var embed = new Discord.RichEmbed();
		embed.addField("Username", `${member.user.username}#${member.user.discriminator}`, true)
			.addField("ID", `${member.user.id}`, true)
			.setColor(randomcolor())
			.setFooter(' ', ' ')
			.setThumbnail(`${member.user.avatarURL}`)
			.setTimestamp()
			.setURL(`${member.user.avatarURL}`)
			.addField('Currently', `${member.user.presence.status}`, true)
			.addField('Game', `${member.user.presence.game === null ? "No Game" : member.presence.game.name}`, true)
			.addField('Joined Discord', `${moment(member.user.createdAt).format('MM.DD.YY')}`, true)
			.addField('Joined Server', `${moment(member.user.joinedAt).format('MM.DD.YY')}`, true)
			.addField('Roles', `\`${member.roles.filter(r => r.name).size}\``, true)
			.addField('Is Bot', `${member.user.bot}`, true)
		message.channel.sendEmbed(
			embed, {
				disableEveryone: true
			}
		);
	}
  	if (command === "uptime") {
     	 const toHHMMSS = seconds => {
     	     let secNum = parseInt(seconds, 10);
     	     let hours = Math.floor(secNum / 3600);
     	     let minutes = Math.floor((secNum - (hours * 3600)) / 60);
     	     seconds = secNum - (hours * 3600) - (minutes * 60);
     	     if (hours < 10) hours = "0" + hours;
     	     if (minutes < 10) minutes = "0" + minutes;
     	     if (seconds < 10) seconds = "0" + seconds;
     	     return hours + ":" + minutes + ":" + seconds;
     	 };
     	 message.channel.sendMessage("**Uptime: " + toHHMMSS(process.uptime()) + " **");
  	}
	if (command === "githublinkmaker") {
		message.channel.sendMessage("Their GitHub link is <https://github.com/" + args[0] + "/>")
	}
}); // END message handler

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}

bot.login(config.token);

