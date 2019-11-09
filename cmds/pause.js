exports.run = async (message, args) => {
  var vc = client.voiceConnections.get(message.channel.guild.id);

  if(!vc)
    return message.channel.createMessage(`<@${message.author.id}>, there is no audio stream to pause.`);

  if(vc.paused)
    return message.channel.createMessage(`<@${message.author.id}>, the audio stream is already paused.`);

  await vc.pause();

  return message.channel.createMessage(`Paused the audio stream.`);
};

exports.info = {
  usage: ":pause",
  args: "None.",
  description: "Allows someone to pause an audio stream.",
  examples: ":pause",
  type: "music"
};
