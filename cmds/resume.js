exports.run = async (message, args) => {
  var vc = client.voiceConnections.get(message.channel.guild.id);

  if(!vc)
    return message.channel.createMessage(`<@${message.author.id}>, there is no audio stream to resume.`);

  if(!vc.paused)
    return message.channel.createMessage(`<@${message.author.id}>, the audio stream is currently playing.`);

  await vc.resume();

  return message.channel.createMessage(`Resumed the audio stream.`);
};

exports.info = {
  usage: ":resume",
  args: "None.",
  description: "Continues a paused audio stream.",
  examples: ":resume",
  type: "music"
};
