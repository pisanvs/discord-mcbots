exports.run = (client, message, args) => {
    if ( args.length == 0 ) {
        let list = Object.keys(client.MCBots.bots).map(e => `${e} ${client.MCBots.bots[e].host}:${client.MCBots.bots[e].port} ${client.MCBots.bots[e].username}`);
        message.channel.send("Currently active bots:\n```yaml\n"+ "ID, Server IP, Username\n" + (list.join('\n') || 'None') +"```");
    } else {
        message.channel.send("```yaml\nUsage: " + client.config.prefix + "list (no arguments)\n```");
    }
}