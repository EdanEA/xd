exports.run = async (message, args) => {
  const p = client.voiceConnections.get(message.channel.guild.id);
  var g = guilds[message.channel.guild.id];

  if(!p)
    return;

  await client.leaveVoiceChannel(g.music.vc);
  await p.stop();
  await p.destroy();

  g.music.vc = null;
  g.music.channel = null;

  return message.channel.createMessage(`Bye. )^:`);
};

exports.info = {  
  usage: "stop%",
  args: "None.",
  description: "For stopping a voice channel stream. Also useful if the bot's just sitting in a voice channel.",
  examples: "stop%",
  type: "music"
};
