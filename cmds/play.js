exports.run = async (message, args) => {
  if(!message.member.voiceState.channelID && !client.voiceConnections.get(message.channel.guild.id))
    return message.channel.createMessage(`You're not in a voice channel.`);

  if(client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing)
    return;

  var vcid = message.member.voiceState.channelID;
  var g = guilds[message.channel.guild.id];
  var q = queue[message.channel.guild.id];

  await client.joinVoiceChannel(vcid);

  g.music.vc = vcid;
  g.music.channel = message.channel.id;

  require('../util/stream.js').play(g, client);

  const player = client.voiceConnections.get(message.channel.guild.id);

  player.on("trackStart", async d => {
    client.voiceConnections.get(message.channel.guild.id).playing = true;
  });

  player.on("trackError", err => console.error(err));

  player.on("trackEnd", async d => {
    client.voiceConnections.get(player.guild).playing = false;

    if(!q[0])
      return;

    if(g.music.queueRepeat) {
      let i = q[0];

      if(i.skip !== undefined && i.skip == true)
        i.skip = false;

      q.push(i);
    }


    if(!g.music.singleRepeat)
      q.shift();

    return require('../util/stream.js').play(guilds[player.guild], client);
  });
};

exports.info = {
  usage: ":play",
  args: "None.",
  description: "Starts a voice channel stream, playing the items in the queue.",
  examples: ":play",
  type: "music"
};
