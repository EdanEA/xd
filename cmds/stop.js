exports.run = async function(message, args) {
  if(!client.voiceConnections.get(message.channel.guild.id))
    return;

  guilds[message.channel.guild.id].channel = null;
  await client.leaveVoiceChannel(client.voiceConnections.get(message.channel.guild.id).channelID);
  
  return;
};

exports.info = {
  usage: ":stop",
  args: "None.",
  examples: ":stop",
  description: "Forces the bot to disconnect from the voice channel.",
  type: "music"
};
