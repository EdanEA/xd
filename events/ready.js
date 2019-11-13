const fs = require('fs');
const f = require('../util/misc.js');
module.exports = async () => {
  console.log(c.hex('63D1F4')(`\n\nSuccesfully logged in as:\n\t${client.user.username}#${client.user.discriminator}\n`));
  client.createMessage(k.conf.logChannel, {embed: {
    title: `Logged In`,
    description: `As: \`${client.user.username}#${client.user.discriminator} (${client.user.id})\`\nTime: \`${moment(new Date()).format("hh:mm:ss a")} (GMT ${new Date().getTimezoneOffset() / -60})\``,
    color: 0x63D1F4
  }});

  var cmds = {
    music: [],
    fun: [],
    mod: [],
    misc: [],
    beta: [],
    staff: [],
    owner: []
  };

  await fs.readdirSync('./cmds').forEach(f => {
    let name = f.split('.')[0];
    var i = require(`../cmds/${f}`).info;

    switch(i.type) {
      case "music":
        cmds.music.push(name);
        break;

      case "fun":
        cmds.fun.push(name);
        break;

      case "mod":
        cmds.mod.push(name);
        break;

      case "staff":
        cmds.staff.push(name);
        break;

      case "owner":
        cmds.owner.push(name);
        break;

      case "beta":
        cmds.beta.push(name);
        break;

      case "misc.":
        cmds.misc.push(name);
        break;

      case "help":
        break;

      default:
        console.log(`Unindexed command type on ${f}.`);
        break;
    }
  });

  commands = cmds;

  sql.run('CREATE TABLE IF NOT EXISTS users (id TEXT, rrWins INT, rrLosses INT, rrTotal INT, coinWins INT, coinLosses INT, coinTotal INT, rpsWins INT, rpsLosses INT, rpsTotal INT, rollsTotal INT, bjWins INT, bjLosses INT, bjTotal INT)');

  client.guilds.forEach(g => {
    if(!guilds[g.id])
      guilds[g.id] = {
        logging: {
          wgb: false,
          logEnabled: false,
          logChannel: null,
          wgbChannel: null
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