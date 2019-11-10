const yt = require('../util/yt.js');

exports.run = async function(message, args) {
  if(!message.member.voiceState && !client.voiceConnections.get(message.channel.guild.id))
    return message.channel.createMessage(`<@${message.author.id}>, join a voice channel first.`);
  else
    await client.joinVoiceChannel(message.member.voiceState.channelID);

  var g = guilds[message.channel.guild.id];

  var p;
  if(typeof client.voiceConnections.get(message.channel.guild.id).playing === 'undefined')
    var p = false;
  else {
    if(client.voiceConnections.get(message.channel.guild.id).playing)
      var p = true;
    else
      var p = false;
  }

  if(!g.music.channel)
    g.music.channel = message.channel.id;

  if(queue[message.channel.guild.id][0] && p == false) {
    g.music.vc = message.member.voiceState.channelID;
    require('../util/stream.js').play(g, client);
  } else {
    if(!queue[message.channel.guild.id][0])
      return message.channel.createMessage(`<@${message.author.id}>, there's nothing in the queue. To add something to the queue, use \`:queue\``);
    if(p == true)
      return message.channel.createMessage(`<@${message.author.id}>, I'm already playing something.`);
  }
};

exports.info = {
  usage: ":play",
  args: "None.",
  examples: ":play",
  description: "Plays the music; that is assuming there's something in the queue.",
  type: "music"
};
