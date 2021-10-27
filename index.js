const Discord = require("discord.js");
const fs = require("fs");
const { prefix, token } = require("./config.js");

const discordClient = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"]
});

discordClient.config = {
    prefix: prefix,
};

discordClient.MCBots = {
    bots: {},
    stream: "",
};

discordClient.commands = new Discord.Collection();

// import commands from folder and add to discord.js Client
fs.readdirSync("./discord/commands").forEach(file => {
    const command = require(`./discord/commands/${file}`);
    const commandName = file.split(".")[0];
    console.log(`Loading command: ${commandName}`);
    discordClient.commands.set(commandName, command);
    console.log(`Loaded command: ${commandName}`);
});

// import events from folder and add to discord.js Client
fs.readdirSync("./discord/events").forEach(file => {
    const event = require(`./discord/events/${file}`);
    const eventName = file.split(".")[0];
    console.log(`Loading event: ${eventName}`);
    discordClient.on(eventName, event.bind(null, discordClient));
    console.log(`Loaded event: ${eventName}`);
});

discordClient.login(token);