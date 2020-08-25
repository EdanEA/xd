exports.run = (message, args) => {
  const p = client.voiceConnections.get(message.channel.guild.id);

  if(args.length == 0 || !p)
    return;

  var v = parseInt(args.join(' '));

  if(isNaN(v))
    return;

  if(v < 1)
    return message.channel.createMessage(`You can't set the volume below 1.`);

  p.setVolume(v);

  var msg = `Set the volume to \`${v}%\`.`;

  if(v > 100 && v < 250)
    msg += " I hope you like noise.";
  else if(v > 250 && v < 500)
    msg += " I hope you like harsh noise.";
  else if(v > 500)
    msg += " I hope you enjoy early-onset hearing loss.";

  return message.channel.createMessage(`Set the volume to \`${v}%\`.`);
};

exports.info = {
  usage: "volume% [volume]",
  args: "[volume]: The volume to set the stream to.",
  description: "For increasing or decreasing the volume of a voice channel stream.",
  examples: "volume% 75\nvolume% 120",
  type: "music"
};
