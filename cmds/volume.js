exports.run = async (message, args) => {
  if(!args[0])
    return message.channel.createMessage(`<@${message.author.id}>, you must give a number to set the volume to.`);
  if(!parseInt(args[0]))
    return message.channel.createMessage(`<@${message.author.id}>, the argument given is invalid; it must be an integer`);
  if(!client.voiceConnections.get(message.channel.guild.id))
    return message.channel.createMessage(`<@${message.author.id}>, there is no active audio stream in this server.`);

  var volume = parseInt(args[0]) * 10 ** -2;
  await client.voiceConnections.get(message.channel.guild.id).setVolume(volume);

  return message.channel.createMessage(`Volume is now set to \`${volume * 10 ** 2}%\`.`);
};

exports.info = {
  usage: ":volume <value>",
  args: "<value>: The value to set the stream's volume to.",
  description: "The `volume` command allows you to adjust the volume of the current audio stream. When given a number, this command adjusts the volume value to this given number.",
  examples: ":volume 80\n:volume 200",
  type: "music"
};
