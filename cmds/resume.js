exports.run = (message, args) => {
  const p = client.voiceConnections.get(message.channel.guild.id);

  if(!p || !p.paused)
    return;

  p.togglePlayback();

  return message.channel.createMessage(`Resumed.`);
};

exports.info = {
  usage: "resume%",
  args: "None.",
  description: "For resuming a paused voice channel stream.",
  examples: "resume%",
  type: "music"
};
