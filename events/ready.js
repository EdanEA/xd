const fs = require('fs');
const f = require('../util/misc.js');
module.exports = async () => {
  console.log(c.hex('63D1F4')(`\n\nSuccesfully logged in as:\n\t${client.user.username}#${client.user.discriminator}\n`));
  client.createMessage(k.conf.logChannel, {embed: {
    title: `Logged In`,
    description: `As: \`${client.user.username}#${client.user.discriminator} (${client.user.id})\`\nTime: \`${moment(new Date()).format("hh:mm:ss a")} (GMT ${new Date().getTimezoneOffset() / -60})\``,
    color: 0x63D1F4
  }});

  commands = await f.updateCmdList(commands);

  sql.run('CREATE TABLE IF NOT EXISTS users (id TEXT, rrWins INT, rrLosses INT, rrTotal INT, coinWins INT, coinLosses INT, coinTotal INT, rpsWins INT, rpsLosses INT, rpsTotal INT, rollsTotal INT, bjWins INT, bjLosses INT, bjTotal INT)');

  client.guilds.forEach(g => {
    if(!guilds[g.id])
      guilds[g.id] = {
        logging: {
          wgb: false,
          wgbChannel: null,
          logEnabled: false,
          logChannel: null,
          events: []
        },
        music: {
          defaultSearch: "youtube",
          defaultSearchCount: 3,
          anySkip: false,
          singleRepeat: false,
          queueRepeat: false,
          channel: "",
          msgType: 1
        },
        mod: {
          mutes: [],
          muteRoleId: null,
          roleSaveActive: false
        },
        color: "EE7600",
        prefix: ":",
        id: g.id
      };

      queue[g.id] = [];
  });

  var roles = require('../storage/roles.json');
  for(var r of Object.keys(roles)) {
    rolesave[r] = roles[r];
  }

  if(fs.existsSync(`./storage/temp.json`)) {
    await fs.readFile('./storage/temp.json', (err, data) => {
      if(err) throw err;

      var q = JSON.parse(data);

      for(var id of Object.keys(q)) {
        queue[id] = q[id];
      }

      fs.unlink('./storage/temp.json', (err) => {
        if(err) throw err;
      });
    });
  }

  await f.updateStatus(k.conf.statuses);
};
