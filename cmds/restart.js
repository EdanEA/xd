const fs = require('fs');

exports.run = async function(message, args) {
  if(message.author.id !== k.conf.ownerID)
    return message.channel.createMessage(`<@${message.author.id}>, no.`);

  async function writeAsync(path, object) {
    await fs.writeFileSync(path, JSON.stringify(object, null, 2), 'utf8');
    console.log(`Successfully logged ${Object.keys(object).length} items in ${path}.`);
  }

  async function finalize() {
    var temp = {};
    await client.voiceConnections.forEach(async vc => {
      temp[vc.id] = queue[vc.id];
      temp[vc.id].unshift(queue[vc.id][0]);

      await client.leaveVoiceChannel(vc.channelID).then(async () => {
        await client.createMessage(guilds[vc.id].music.channel, "I have to restart.");
      });
    });

    console.log(JSON.stringify(temp, undefined, 2));

    if(Object.keys(temp).length > 0)
      await fs.writeFile('./storage/temp.json', JSON.stringify(temp, undefined, 2), 'utf8', (err => {
        if(err)
          throw err;
      }));

    await Object.keys(guilds).forEach(g => {
      guilds[g].music.vc = "";
      guilds[g].music.channel = "";
    });
  }

  await finalize().then(async () => {
    await writeAsync('./storage/guilds.json', guilds);
    await writeAsync('./storage/roles.json', rolesave);

    await message.channel.createMessage("*distant screams*");

    process.exit();
  });
};

exports.info = {
  usage: ":restart",
  args: "None.",
  examples: ":restart",
  description: "Restarts the pm2 server.",
  type: "owner"
};
