var f = require('../util/misc.js');

exports.run = async (message, args) => {
  var g = guilds[message.channel.guild.id];

  if(!f.hasMod(message.member, message.channel.guild) &&!g.music.anySkip)
    return;

  queue[message.channel.guild.id] = [];

  if(client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing)
    await client.voiceConnections.get(message.channel.guild.id).stop();

  return message.channel.createMessage(`I successfully purged the queue.`);
};

exports.info = {
  usage: ":queuepurge",
  args: "None.",
  examples: ":queuepurge",
  description: "Removes every item from the queue.",
  type: "music"
};
