const Discord = require("discord.js");
const bot = new Discord.Client();

const moment = require('moment');
const randomcolor = require('randomcolor');
const beautify = require('js-beautify').js_beautify;

const banid = require("json/banid.json");
const kickid = require("json/kickid.json");
const config = require("json/config.json");
const googleconfig = require("json/googleconfig.json");

const GoogleSearch = require('google-search');
const googleSearch = new GoogleSearch({
    key: googleconfig.key,
    cx: googleconfig.cx
});

process.on('uncaughtException', err => {
    console.log('error: ' + err); //STOPS THE BOT FROM CRASHING
});

bot.on('ready', () => {
    console.log(`Connected! ${config.emojis.success}`);
    console.log(`Logged in as ${bot.user.username}`);
    bot.user.setGame(config.setgame);
});

bot.on("guildMemberAdd", member => {
    let guild = member.guild;
    for (var i = 0; i < kickid.kickids.length; i++) {
        if (member.id == kickid.kickids[i]) {
            kickid.kickids.splice(i, 1);
            break;
        }
    }
    bot.channels.get("227815924135231488").sendMessage(" ", {
        embed: {
            color: 0x3447003,
            author: {
                name: member.user.username,
                icon_url: member.user.avatarURL
            },
            title: "welcome!",
            description: member.user + " just joined",
            timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: 'join message'
            }
        }
    }).catch(console.error);
});

bot.on("guildBanAdd", member => {
    bot.channels.get("227815924135231488").sendMessage(" ", {
        embed: {
            color: 0xFF0000,
            description: `:hammer: **User Banned:** ${member.user.username}#${member.user.discriminator} (${member.id})`
        }
    }).catch(console.error);
    banid.banids.push(member.id);
});

bot.on("guildBanRemove", member => {
    for (var i = 0; i < banid.banids.length; i++) {
        if (member.id == banid.banids[i]) {
            banid.banids.splice(i, 1);
            break;
        }
    }
    bot.channels.get("227815924135231488").sendMessage(" ", {
        embed: {
            color: 0x00FF00,
            description: `:hammer: **User Unbanned:** ${member.user.username}#${member.user.discriminator} (${member.id})`
        }
    }).catch(console.error);
    banid.banids.push(member.id);
});

bot.on("guildMemberRemove", member => {
    for (var i = 0; i < banid.banids.length; i++) {
        if (member.id == banid.banids[i]) {
            return;
        }
    }
    for (var i = 0; i < kickid.kickids.length; i++) {
        if (member.id == kickid.kickids[i]) {
            bot.channels.get("227815924135231488").sendMessage(" ", {
                embed: {
                    color: 0xFFFF00,
                    description: `${member.user.username}#${member.user.discriminator} just got kicked for breaking rules`
                }
            }).catch(console.error);
            return;
        }
    }
    let guild = member.guild;
    bot.channels.get("227815924135231488").sendMessage(" ", {
        embed: {
            color: 0xFFFF00,
            description: `${member.user.username}#${member.user.discriminator} just left the server`
        }
    }).catch(console.error);
});

bot.on("guildCreate", guild => {
    console.log(`New guild added : ${guild.name}, owned by ${guild.owner.user} ${config.emojis.working}`).catch(console.error);
}); // this code does so that when the bot joins a server it says to RSCodes

bot.on('message', message => { //start of command list

    if (message.author.bot) return;
    if (!message.content.startsWith(config.client.prefix)) return;

    let command = message.content.split(" ")[0];
    command = command.slice(config.client.prefix.length);

    let args = message.content.split(" ").slice(1);
    var argresult = args.join(" ");

    let guild = message.guild

    for (var i = 0; i < config.block.length; i++) {
        if (message.author.id == config.block[i]) {
            return;
        }
    }

    if (command === "membercount") {
        message.channel.sendMessage(`${message.guild.memberCount}`);
    }
    if (command === "serverinfo") {
        let guild = message.guild;
        message.channel.sendMessage("", {embed: {
          color: 0x006400,
          author: {
            name: guild.name,
            icon_url: guild.icon,
          },
          description: `ID: ${guild.id}`,
          thumbnail: guild.icon,
          fields: [
            {
              name: "Default Channel",
              value: guild.defaultChannel
            },
            {
              name: "Region",
              value: guild.region
            },
            {
              name: `Members [${guild.memberCount}]`,
              value: guild.members.filter(online).size
            },
            {
              name: "Server Owner",
              value: `${guild.owner.username}#${guild.owner.discriminator} (${guild.owner.id})`
            },
            {
              name: "Created On",
              value: guild.createdAt
            }
          ]

        }}).catch(console.error);
    }
    if (command === "google") {
    	googleSearch.build({
 		q: args,
  		start: 5,
  		gl: "co.uk", //geolocation, 
  		lr: "lang_en",
 		num: 1, // Number of search results to return between 1 and 10, inclusive 
  		siteSearch: "https://google.com" // Restricts results to URLs from a specified site 
	}, function(error, response) {
  		message.channel.sendMessage(response);
	});
    }
    if (command === "reduceindent") {
        let whitespace = string.match(/^(\s+)/);

    	if (!whitespace) return string;

    	whitespace = whitespace[0].replace('\n', '');

    	let lines = string.split('\n');
    	let reformattedLines = [];

    	lines.forEach((line) => {
    	  reformattedLines.push(line.replace(whitespace, ''));
    	});

    	return reformattedLines.join('\n');
    }
    if (command === "botservers") {
        message.channel.sendMessage(bot.guilds.map(g => `${g.name} | ${g.memberCount}`));
    }
    if (command === "setbotavatarurl") {
        if (!message.author.id === config.creator.Jimmy) {
            return message.reply("pleb ur not the bot creator").catch(console.error);
        }
        let args = message.content.split(" ").slice(1);
        let text = args[0];
        bot.user.setAvatarURL(text);
        message.channel.sendMessage("my profile pic has been changed to " + text);
    }
    if (command === 'embed') {
        let modRole = message.guild.roles.find("name", "Staff");
        if (!message.member.roles.has(modRole.id) || !message.author.id === config.creator.Jimmy) {
            return message.reply("pleb ur not staff").catch(console.error);
        }
        let noto = message.content.split(" ").slice(1).join(" ");
        message.delete()
        var embed = new Discord.RichEmbed();
        embed.setColor(randomcolor())
            .setDescription(noto)
        message.channel.sendEmbed(
            embed, {
                disableEveryone: true
            }
        );
    }
    if (command === "setgame") {
        if (!message.author.id === config.creator.Jimmy) {
            return message.reply("pleb ur not Jimmy").catch(console.error);
        }
        bot.user.setGame(argresult);
    }
    if (command === "setstatus") {
        if (!message.author.id === config.creator.Jimmy) {
            return message.reply("pleb ur not Jimmy").catch(console.error);
        }
        bot.user.setStatus(argresult);
    }
    if (command === "date") {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        message.channel.sendMessage("it's the **`" + day + "/" + month + "/" + year + "`** in Belgium");
    }
    if (command === "beautify") {
        let messages = message.channel.messages.array().reverse().filter(msg => msg.author.id !== message.client.user.id);
    	let code;

    	let codeRegex = /```(?:js|json|javascript)?\n?((?:\n|.)+?)\n?```/ig;

    	for (let m = 0; m < messages.length; m++) {
    	  let msg = messages[m];
     	  let groups = codeRegex.exec(msg.content);

     	 if (groups && groups[1] && groups[1].length) {
     	   code = groups[1];
     	   break;
     	 }
   	 }

   	 if (!code) {
   	   return message.channel.sendMessage(`${config.emojis.warn} No JavaScript code blocks found.`);
   	 }

   	 let beautifiedCode = beautify(code, { indent_size: 2, brace_style: 'none' });
    	beautifiedCode = this.reduceIndentation(beautifiedCode);

    	message.channel.sendMessage(`${'```js'}\n${beautifiedCode}\n${'```'}`);
    }
    if (command === "mutefrombot") {
        let modRole = message.guild.roles.find("name", "Staff");
        if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
            return message.reply("pleb ur not admin").catch(console.error);
        }
        let member = message.guild.member(message.mentions.users.first());
        config.block.push(member.id);
        message.channel.sendMessage(member + " has been added to the muted list " + config.emojis.success);
    }
    if (command === "unmutefrombot") {
        let modRole = message.guild.roles.find("name", "Staff");
        if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
            return message.reply("pleb ur not admin").catch(console.error);
        }
        let member = message.guild.member(message.mentions.users.first());
        for (var i = 0; i < config.block.length; i++) {
            if (member.id == config.block[i]) {
                config.block.splice(i, 1);
                message.channel.sendMessage(member + " has been removed from the muted list " + config.emojis.success);
                break;
            }
        }

    }
    if (command === "addrole") {
        let modRole = message.guild.roles.find("name", "Staff");
        if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
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
        message.channel.sendMessage("role " + role + " has been added :thumbsup:")
    }
    if (command === "delrole") {
        let modRole = message.guild.roles.find("name", "Staff");
        if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
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
        message.channel.sendMessage("role " + role + " has been deleted :thumbsup:")
    }
    if (command === "sourcecode") {
        message.channel.sendMessage("https://github.com/Server-Hub-Discord/staff-mod-bot");
    }
    if (command === "avatar") {
        let args = message.content.split(' ');
        args.shift();
        args.shift();
        let member = message.guild.member(message.mentions.users.first());
        return message.reply(member.user.avatarURL)
    }
    if (command === "announce") {
        let modRole = message.guild.roles.find("name", "Staff");
        if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
            return message.reply("pleb ur not admin").catch(console.error);
        }
        let noto = message.content.split(" ").slice(1).join(" ");
        var guildss = bot.channels.get(260884357894373376)
        guildss.sendMessage("**:information_source: Announcement [" + moment().format("Do MMMM YYYY ") + "]**", {
            embed: {
                color: 0x00b7c6,
                description: noto,
                footer: {
                    author: message.author.username + '#' + message.author.discriminator,
                    icon_url: member.user.avatarURL
                }
            }
        }).catch(console.error);
    }
    if (command === "ping") {
        message.channel.sendMessage("Yes, yes I'm on").catch(console.error);
    }
    if (command === "creator") {
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
        message.channel.sendMessage("https://www.zelfmoord1813.be/").catch(console.error);
        let modRole = message.guild.roles.find("name", "Staff");
        let adminRole = message.guild.roles.find("name", "Owner");
        var cmds;
        cmds += `**My Normal Commands are:** \n ${config.client.prefix}membercount \n ${config.client.prefix}serverinfo \n ${config.client.prefix}botservers \n ${config.client.prefix}date \n ${config.client.prefix}sourcecode \n ${config.client.prefix}pokemon \n ${config.client.prefix}avatar \n ${config.client.prefix}ping \n ${config.client.prefix}creator \n ${config.client.prefix}help \n ${config.client.prefix}stats \n ${config.client.prefix}myuserinfo`;
        if (message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy) {
            cmds += `**My Staff commands are** \n ${config.client.prefix}embed [what you want to embed] \n ${config.client.prefix}addrole {user} [role] \n ${config.client.prefix}delrole {user} [role] \n ${config.client.prefix}announce [what you want to announce in #announcements] \n ${config.client.prefix}say [what you want to say] \n ${config.client.prefix}kick {user} \n \n more details on how to use these commands coming soon`;
            return cmds;
        }
        if (message.member.roles.has(adminRole.id) || message.author.id === config.creator.Jimmy) {
            cmds += `My Owner/Creator Commands are: \n ${config.client.prefix}setbotavatarurl (only Jimmy) \n ${config.client.prefix}setstatus (only Jimmy) \n ${config.client.prefix}shutdown \n ${config.client.prefix}restart`;
            return cmds;
        }
        message.author.sendMessage(" ", {
            embed: {
                color: 0x00b7c6,
            },
            title: "Command List",
            description: cmds,
            footer: {
                icon_url: bot.user.avatarURL,
            }
	    }}).catch(console.error);

    }
    if (command === "say") {
        let modRole = message.guild.roles.find("name", "Staff");
        if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
            return message.reply("pleb ur not an admin").catch(console.error);
        }
        message.channel.sendMessage(args.join(" ")).catch(console.error);
    }
    if (command === "kick") {
        let modRole = message.guild.roles.find("name", "Staff");
        let userToKick = message.mentions.users.first();
        if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
            return message.reply("pleb ur not mod").catch(console.error);
        }
        if (message.mention.user.size === 0) {
            return message.reply("please mention a user to kick").catch(console.error);
        }
        let kickMember = message.guild.member(message.mentions.users.first());
        if (!kickMember) {
            return message.reply("that user dont exist bOi").catch(console.error);
        }
        if (!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
            return message.reply("i dont have the permission (KICK_MEMBER) to do this :sadface:").catch(console.error);
        }
        kickid.kickids.push(member.id);
        //we need to get a *GuildMember* object, mentions are only users. Then, we kick!
        message.guild.member(userToKick).kick().then(member => {
            message.reply(`${member.user.username} was kicked.`).catch(console.error);
        });
    }
    if (command === "shutdown") {
        let modRole = message.guild.roles.find("name", "Owner");
        let userToKick = message.mentions.users.first();
        if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
            return message.reply("pleb ur not admin").catch(console.error);
        }
        message.channel.sendMessage("no hanky panky while I'm gone ok :wave:")
        bot.destroy()
    }
    if (command === "restart") {
        let modRole = message.guild.roles.find("name", "Owner");
        let userToKick = message.mentions.users.first();
        if (!(message.member.roles.has(modRole.id) || message.author.id === config.creator.Jimmy)) {
            return message.reply("pleb ur not admin").catch(console.error);
        }
        message.channel.sendMessage("ok brb bois :wave:")
        process.exit(1)
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
            .addField('Joined Discord', `${moment(message.author.createdAt).format('MM.DD.YY')}`, true)
            .addField('Joined Server', `${moment(message.member.joinedAt).format('MM.DD.YY')}`, true)
            .addField('Roles', `\`${message.member.roles.filter(r => r.name).size}\``, true)
            .addField('Is Bot', `${message.author.bot}`, true)
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

}); // END message handler
bot.on("disconnect", () => {
  console.log("Disconnected.");
});


bot.login(process.argv[2]);
