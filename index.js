const dotenv = require('dotenv');
if(process.env.NODE_ENV !== 'production')
    dotenv.config();

const { BOT_TOKEN } = process.env;

const Discord = require('discord.js');

const client = new Discord.Client();

const { default_prefix } = require('./config.json');

const db = require('quick.db')

const { readdirSync } = require('fs');

const { join } = require('path');


client.commands= new Discord.Collection();
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}


client.on("error", console.error);

client.on('ready', () => {
    console.clear();
    console.log("Bot Online");
    console.log("Bot Default Prefix is:", config.default_prefix)
    console.log("Logged in as:", client.user.tag)
   client.user.setActivity(".help | AlieNGaming");  
});

client.on("message", async message => {

let prefix = await db.get(`prefix_${message.guild.id}`);
if(prefix === null) prefix = default_prefix;

    if (message.author.bot) return false;

    if (message.content.includes("@here") || message.content.includes("@everyone")) return false;

    if (message.mentions.has(client.user.id)) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Help\n\n')
        .setThumbnail(client.user.displayAvatarURL())
	.addField('`setseller`', `Sets Seller Key. Run again to change applications \nArgs: **${prefix}setseller**`)
        .addField('`setprefix`', `Change the bot prefix. \nArgs: **${prefix}setprefix**`)
        .addField("Current Bot Prefix Is:", `\`${prefix}\``)
        .setColor("#00FFFF")
        .addField('`add`', `Add key(s). \nArgs: **${prefix}add**`)
        .addField('`del`', `Delete key. \nArgs: **${prefix}del**`)
        .addField('`info`', `Key Information. \nArgs: **${prefix}info**`)
	.addField('`stats`', `Application Statistics. \nArgs: **${prefix}stats**`)
        .addField('`reset`', `Reset key. \nArgs: **${prefix}reset**`)
	.addField('`upload`', `Upload File. \nArgs: **${prefix}reset**`)
        .setFooter('KeyAuth Discord Bot', client.user.displayAvatarURL())
        .setTimestamp()

        message.channel.send(embed)
    };


    if(message.content.startsWith(prefix)) {

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return;;
        if(!message.member.roles.cache.find(x => x.name == "perms")) return message.channel.send(`${message.author.toString()} does not have a role named \`perms\` and therefore cant execute any commands. If you're a server owner create role called that and give it to users you want to be able to execute commands`);
        try {
            message.delete();
            client.commands.get(command).run(client, message, args);
        } catch (error){
            console.error(error);
        }
    }

})


client.login(BOT_TOKEN);

    
