const { LavalinkVoiceConnectionManager } = require('@thesharks/tyr');
const fs = require('fs');
const f = require('../util/misc.js');

module.exports = async () => {
  console.log(c.hex('63D1F4')(`\n\nSuccesfully logged in as:\n\t${client.user.username}#${client.user.discriminator}\n`));
  // client.createMessage(k.conf.logChannel, {embed: {
  //   title: `Logged In`,
  //   description: `As: \`${client.user.username}#${client.user.discriminator} (${client.user.id})\`\nTime: \`${moment(new Date()).format("hh:mm:ss a")} (GMT ${new Date().getTimezoneOffset() / -60})\``,
  //   color: 0x63D1F4
  // }});

  commands = await f.updateCmdList(commands);

  sql.run('CREATE TABLE IF NOT EXISTS users (id TEXT, rrWins INT, rrLosses INT, rrTotal INT, coinWins INT, coinLosses INT, coinTotal INT, rpsWins INT, rpsLosses INT, rpsTotal INT, rollsTotal INT, bjWins INT, bjLosses INT, bjTotal INT)');

  client.guilds.forEach(g => {
    if(!guilds[g.id]) {
      guilds[g.id] = k.conf.defaultConfig;
      guilds[g.id].id = g.id;
      guilds[g.id].prefix = k.conf.basePrefix;
      queue[g.id] = [];
    }
  });

  var roles = require('../storage/roles.json');
  rolesave = roles;

  let nodes = [
    { host: k.lavalink.host, port: k.lavalink.port, password: k.lavalink.pass, region: 'us' }
  ];

  client.voiceConnections = new LavalinkVoiceConnectionManager(nodes, {shards: client.shards.size, userId: client.user.id});

  await f.updateStatus(k.conf.statuses);
};
