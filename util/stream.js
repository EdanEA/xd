const moment = require('moment');
require('moment-duration-format');

exports.play = async (guild, client) => {
  var q = queue[guild.id];

  if(!client.voiceConnections.get(guild.id) && q.length >= 1 && !(guild.music.vc === null))
    await client.joinVoiceChannel(guild.music.vc);

  if(q.length == 0) {
    await client.leaveVoiceChannel(guild.music.vc);
    await client.createMessage(guild.music.channel, `The queue has ended.`);

    guild.music.vc = null;
    guild.music.channel = null;

    return;
  }

  if(q[0].skip !== undefined && q[0].skip == true) {
    if(guild.music.queueRepeat) {
      q[0].skip = false;
      q.push(q[0])
    }

    q.shift();

    return exports.play(guild, client);
  }

  if(!q[0].b64) {
    await client.createMessage(guild.music.channel, `There was an error playing \`${q[0].track}\`.\n\nSkipping…`);

    q.shift();
    return exports.play(guild, client);
  }

  if(!client.voiceConnections.get(guild.id))
    return;

  const player = client.voiceConnections.get(guild.id);
  await player.play(q[0].b64);

  var dur = moment.duration(q[0].duration, "seconds").format("h [hours,] m [minutes,] s [seconds]");

  var u = client.users.get(q[0].requester);
  if(guild.music.msgType == 1) {
    await client.createMessage(guild.music.channel, { embed: {
      title: `Now Playing`,
      description: `[${q[0].title}](${q[0].url})\n\tBy: \`${q[0].author}\`\n\tDuration: \`${dur}\`\n\n\tRequested By: <@${q[0].requester}>`,
      thumbnail: { url: `${q[0].img}` },
      color: parseInt(`0x${guild.color}`),
      timestamp: new Date().toISOString()
    }});
  } else if(guild.music.msgType == 2) {
    var name = client.guilds.get(guild.id).members.get(q[0].requester).nick == null ? client.users.get(q[0].requester).username : client.guilds.get(guild.id).members.get(q[0].requester).nick;

    await client.createMessage(guild.music.channel, `Now playing \`${q[0].title} - by ${q[0].author} (${dur})\`, as requested by \`${name}\`.`);
  }
};
