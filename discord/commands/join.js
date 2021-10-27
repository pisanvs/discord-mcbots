const mineflayer = require('mineflayer');
const mineflayerViewer = require('prismarine-viewer').headless;

const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;
const { GoalNear, GoalFollow } = require('mineflayer-pathfinder').goals;

const killaura = require('mineflayer-kill-aura');

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

exports.run = (client, message, args) => {
    if (args.length == 4) {
        let options = {
            host: args[0],
            port: args[1],
            username: args[2]
        };

        let bot = mineflayer.createBot(options);
        bot.loadPlugin(pathfinder);

        let id = genRanHex(8);
        client.MCBots.bots[id] = { bot: bot, host: options.host, port: options.port, username: options.username, owner: args[3] };

        let mcData;
        let defaultMove;

        let attacking;

        message.channel.send(`Bot ${id} created.`);

        bot.on('login', () => {
            message.channel.send(`Bot ${id} logged in.`);
        });

        bot.on('end', () => {
            message.channel.send(`Bot ${id} ended.`);
            delete client.MCBots.bots[id];
        });

        bot.on('spawn', () => {
            mcData = require('minecraft-data')(bot.version)
            defaultMove = new Movements(bot, mcData)
            defaultMove.allow1by1towers = true;
            defaultMove.allowFreeMotion = true;
            defaultMove.scafoldingBlocks = [mcData.itemsByName.dirt.id, mcData.itemsByName.stone.id];
            defaultMove.allowParkour = true;
            defaultMove.digCost = 5;
            bot.look(0, 180)
        })

        bot.on('whisper', (u, m) => {
            if (u == args[3]) {
                if (m === 'come') {
                    const target = bot.players[u] ? bot.players[u].entity : null
                    if (!target) {
                        bot.whisper(u, 'I don\'t see you !')
                        return
                    }
                    const p = target.position

                    bot.pathfinder.setMovements(defaultMove)
                    bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
                }
                // follow message sender
                if (m === 'follow') {
                    const target = bot.players[u] ? bot.players[u].entity : null
                    if (!target) {
                        bot.whisper(u, 'I don\'t see you !')
                        return
                    }
                    bot.pathfinder.setMovements(defaultMove)
                    bot.pathfinder.setGoal(new GoalFollow(target, 1), true)
                }
                if (m.startsWith('attack')) {
                    targetU = m.split(' ')[1]
                    const target = bot.players[targetU] ? bot.players[targetU].entity : null
                    if (!target) {
                        bot.whisper(u, 'I don\'t see target !')
                        return
                    }
                    bot.pathfinder.setMovements(defaultMove)
                    bot.pathfinder.setGoal(new GoalFollow(target, 1), true)
                    attacking = true
                    setInterval(() => {
                        if (attacking) {
                            if (!target) {
                                bot.whisper(u, 'I don\'t see target !')
                                attacking = false
                                return
                            }
                            if (target.position.distanceTo(bot.entity.position) > 3) {
                                return
                            }
                            bot.setControlState('sprint', true)
                            bot.setControlState('jump', true)
                            bot.lookAt(target.position)
                            bot.attack(target);
                        }
                    }, 500)
                }
                if (m === 'stop') {
                    attacking = false
                    bot.pathfinder.stop();
                    bot.setControlState('sprint', false)
                    bot.setControlState('jump', false)
                }
            }
        })
        bot.on('chat', (u, m) => {
            if (u == args[3]) {
                const target = bot.players[u] ? bot.players[u].entity : null
                if (m === 'bots, assemble!') {
                    if (!target) {
                        bot.whisper(u, 'I don\'t see you !')
                        return
                    }
                    const p = target.position

                    bot.pathfinder.setMovements(defaultMove)
                    bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
                }
                if (m === 'bots, follow me!') {
                    if (!target) {
                        bot.whisper(u, 'I don\'t see you !')
                        return
                    }
                    bot.pathfinder.setMovements(defaultMove)
                    bot.pathfinder.setGoal(new GoalFollow(target, 1), true)
                }
                if (m.startsWith('bots, attack')) {
                    targetU = m.split(' ')[2]
                    const target = bot.players[targetU] ? bot.players[targetU].entity : null
                    if (!target) {
                        bot.whisper(u, 'I don\'t see target !')
                        return
                    }
                    bot.pathfinder.setMovements(defaultMove)
                    bot.pathfinder.setGoal(new GoalFollow(target, 1), true)
                    attacking = true
                    setInterval(() => {
                        if (attacking) {
                            if (!target) {
                                bot.whisper(u, 'I don\'t see target !')
                                attacking = false
                                return
                            }
                            if (target.position.distanceTo(bot.entity.position) > 3) {
                                return
                            }
                            bot.setControlState('sprint', true)
                            bot.setControlState('jump', true)
                            bot.lookAt(target.position)
                            bot.attack(target);
                        }
                    }, 500)
                }
                if (m === 'stop') {
                    attacking = false
                    bot.pathfinder.stop();
                    bot.setControlState('sprint', false)
                    bot.setControlState('jump', false)

                }
            }
        });
    } else {
        message.channel.send("```yaml\nUsage: " + client.config.prefix + "join <server> <port> <user> <owner>\n```")
    }
}