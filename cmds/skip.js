var f = require('../util/misc.js');

exports.run = async function(message, args) {
  var g = guilds[message.channel.guild.id];
  var q = queue[message.channel.guild.id];

  if(q.length <= 0)
    return message.channel.createMessage(`I cannot skip, as there's nothing in the queue.`);

  if(!f.hasMod(message.member, message.channel.guild) && !g.music.anySkip && q[0].requester !== message.author.id)
    return message.channel.createMessage(`<@${message.author.id}>, you do not have valid permission to skip.`);

  if(!args.length) {
    if(client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing) {
      q[0].skip = true;
      await client.voiceConnections.get(message.channel.guild.id).stop();
    } else
      q.shift();
  } else {
    var reg = /[0-9]+/g;
    var points = [...args.join(' ').match(reg)];

    if(!points)
      return;

    if(parseInt(points[0]) > parseInt(points[1])) {
      points.splice(2, 0, points[0]);
      points.shift();
    }

    if(points.length == 1) {
      points[0] = parseInt(points[0]);
      if(points[0] > q.length)
        return message.channel.createMessage(`<@${message.author.id}>, the given range is larger than the queue.`);

      if(points[0] == 1 && client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing)
        client.voiceConnections.get(message.channel.guild.id).stop();
      else
        q.shift();

      if(client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing) {
        for(var i = 0; i < (points[0] - 2); i++) {
          q[i].skip = true;
        }

        client.voiceConnections.get(message.channel.guild.id).stop();
      } else
        q.splice(0, (points[0] - 2));

      return message.channel.createMessage(`Successfully skipped to position \`${points[0]}\`.`);
    } else {
      points[1] = parseInt(points[1]);

      if((points[1] > q.length))
        return message.channel.createMessage(`<@${message.author.id}>, the given range is larger than the queue.`);

      q.splice(points[0] - 1, points[1] - points[0] + 1);

      if(points[0] == 1 && client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing) {
        await client.voiceConnections.get(message.channel.guild.id).stop();
      }

      return message.channel.createMessage(`Successfully removed \`${(parseInt(points[1]) - parseInt(points[0]) + 1)}\` items from the queue.`);
    }
  }
};

exports.info = {
  usage: ":skip [point] [range]",
  args: "[point]: A certain point in the queue to skip to.\n[range]: A range of queue points that will be removed. (e.g. 3-7)\nLeave nothing if you simply want to skip the current song.",
  examples: ":skip\n:skip 4\n:skip 1-6",
  description: "Lets you skip a song in the queue if you have the permissions to do so, or if any skip is enabled.",
  type: "music"
};
