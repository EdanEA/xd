exports.run = (message, args) => {
  const p = client.voiceConnections.get(message.channel.guild.id);

  if(!p || p.paused)
    return;

  p.togglePlayback();

  return message.channel.createMessage(`Paused.`);
};

exports.info = {
  usage: ":pause",
  args: "None.",
  description: "Allows for pausing of a voice channel stream.",
  examples: ":pause",
  type: "music"
};
