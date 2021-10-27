exports.run = (client, message, args) => {
    client.MCBots.bots[args[0]].bot.end();
    message.channel.send(`Bot ${args[0]} has been disconnected.`);
}