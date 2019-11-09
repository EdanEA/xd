const ytdl = require('ytdl-core');

exports.play = async (guild, client) => {
  var q = queue[guild.id];

  if(!client.voiceConnections.get(guild.id) && q.length >= 1)
    await client.joinVoiceChannel(guild.vc);
  else if(!client.voiceConnections.get(guild.id) && !q.length)
    return;

  if(q[0] && q[0].skip == true) {
    for await(i of q) {
      if(i.skip)
        q.shift();
    }

    return exports.play(guild, client);
  }

  if(!q[0]) {
    await client.leaveVoiceChannel(guild.vc);

    setTimeout(async () => {
      await client.createMessage(guild.music.channel, `The queue has ended.`);
      guild.music.channel = null;
    });

    return;
  }

  if(q[0].type == 0) {
    var current = ytdl(q[0].id, {filter: 'audioonly', quality: 'highestaudio'});

    if(!current) {
      await message.channel.createMessage(`There was an error playing ${q[0].title}; skipping.`);
      q.shift();

      return exports.play(guild, client);
    }
  } else if(q[0].type == 1) {
    if(!q[0].id) {
      await message.channel.createMessage(`There was an error playing ${q[0].title}; skipping.`);
      q.shift();

      return exports.play(guild, client);
    }

    var current = `https://api.soundcloud.com/tracks/${q[0].id}/stream?client_id=${k.keys.scID}`;
  }

  if(!client.voiceConnections.get(guild.id))
    return;

  await client.voiceConnections.get(guild.id).play(current, { inlineVolume: true, sampleRate: 128000 });

  var dur = moment.duration(q[0].duration, "seconds").format("h [hours,] m [minutes,] s [seconds]");
  if(guild.music.msgType == 1) {
    if(!client.voiceConnections.get(guild.id))
      return;

    await client.createMessage(guild.music.channel, {embed: {
      title: `Now Playing.`,
      description: `${q[0].title}\nBy: ${q[0].author}\nDuration: ${dur}\nRequested By: <@${q[0].requester}>`,
      thumbnail: { url: `${q[0].img}` },
      color: parseInt(`0x${guild.color}`)
    }});
  } else if(guild.music.msgType == 2) {
    if(!client.voiceConnections.get(guild.id))
      return;

    var name = client.guilds.get(guild.id).members.get(q[0].requester).nick == null ? client.users.get(queue[guild.id][0].requester).username : client.guilds.get(guild.id).members.get(queue[guild.id][0].requester).nick;

    await client.createMessage(guild.music.channel, `Now playing \`${q[0].title} - by ${q[0].author} (${dur})\`, as requested by \`${name}\`.`);
  }

  client.voiceConnections.get(guild.id).once('end', async () => {
    if(guild.queueRepeat)
      q.push(q[0]);

    if(!guild.singleRepeat)
      q.shift();

    exports.play(guild, client);
  });
};
