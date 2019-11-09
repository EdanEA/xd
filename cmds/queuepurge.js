var f = require('../util/misc.js');
exports.run = (message, args) => {
  if(!f.hasMod(message.channel.guild.id, message.author.id, client))
    return;

  queue[message.channel.guild.id] = [];

  if(client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).play)
    client.voiceConnections.get(message.channel.guild.id).stopPlaying();

  return message.channel.createMessage(`I successfully purged the queue.`);
};

exports.info = {
  usage: ":queuepurge",
  args: "None.",
  examples: ":queuepurge",
  description: "Removes every item from the queue.",
  type: "music"
};
