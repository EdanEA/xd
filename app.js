global.k = require('./storage/stuff.json');
global.guilds = require('./storage/guilds.json');
global.commands = [];
global.queue = {};
global.rolesave = {};

const util = require('util');
const fs = require('fs');
const f = require('./util/misc.js');
const DBL = require('dblapi.js');
const dbl = new DBL(k.keys.shittyBotLists.top);
global.c = require('chalk');


global.Eris = require('eris');
require("eris-additions")(Eris, { disabled: ["Channel.sendMessage", "Channel.sendCode", "Eris.Embed"] });
global.client = new Eris.Client(k.bot.token, {
  maxShards: 3,
  connectionTimeout: 60000,
  defaultImageFormat: "png",
  defaultImageSize: 1024,
  disableEvents: {
    PRESENCE_UPDATE: true,
    TYPING_START: true
  }
});

require("./util/functions.js")(Eris);

global.moment = require('moment');
require('moment-duration-format');

global.sql = require('sqlite');
sql.open('./storage/db.sqlite');

async function init() {
  var readdir = util.promisify(fs.readdir);
  const events = await readdir('./events/');

  for(var e of events) {
    let name = e.split('.')[0];
    let event = require(`./events/${name}`);

    try {
      client.on(name, event);
      console.log(c.hex('FFFF00')(`Successfully loaded event: ${c.hex('#000').bgHex('#ffff00')(name)}`));
    } catch (e) {
      console.error(c.gray(`Error loading event: ${name}\n${e.stack}`));
    }
  }

  client.connect();
}

init();

setInterval(async () => {
  await f.checkMutes(guilds, client);
}, 6E4);

setInterval(async () => {
  await f.checkInactive();
  await f.updateStatus(k.conf.statuses);

  if(client.token == k.bot.token)
    await f.postStats(k.keys.shittyBotLists, dbl, client.user.id, client.guilds.size, client.shards.size, client.users.size, client.voiceConnections.size);
}, 18E6);
