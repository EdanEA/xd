var f = require('../util/misc.js');
exports.run = async function(message, args) {
  if(queue[message.channel.guild.id].length <= 0)
    return message.channel.createMessage(`<@${message.author.id}>, I can't skip, as there's nothing in the queue.`);

  if(!f.hasMod(message.channel.guild.id, message.author.id, client))
    return message.channel.createMessage(`<@${message.author.id}>, you do not have valid permission to skip.`);

  if(!args.length) {
    if(client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing)
      await client.voiceConnections.get(message.channel.guild.id).stopPlaying();
    else
      queue[message.channel.guild.id].shift();
  } else {
    var reg = /[0-9]+/g;
    var points = [...args.join(' ').match(reg)];

    console.log(points);

    if(!points)
      return;

    if(parseInt(points[0]) > parseInt(points[1])) {
      points.splice(2, 0, points[0]);
      points.shift();
    }

    if(points.length == 1) {
      if(parseInt(points[0]) > queue[message.channel.guild.id].length)
        return message.channel.createMessage(`<@${message.author.id}>, the presented range is larger than the queue`);

      if(parseInt(points[0]) == 1 && client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing)
        client.voiceConnections.get(message.channel.guild.id).stopPlaying();
      else
        queue[message.channel.guild.id].shift();

      if(client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing) {
        for(var i = 0; i < (parseInt(points[0]) - 2); i++) {
          queue[message.channel.guild.id][i].skip = true;
        }

        client.voiceConnections.get(message.channel.guild.id).stopPlaying();
      }

      else
        queue[message.channel.guild.id].splice(0, (parseInt(points[0]) - 2));

      return message.channel.createMessage(`Successfully skipped to position \`${points[0]}\`.`);
    } else {
      if((points.length > 2 && points[1] > queue[message.channel.guild.id].length))
        return message.channel.createMessage(`<@${message.author.id}>, the presented range is larger than the queue`);

      if(client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing) {
        for(var i = parseInt(points[0]) - 1; i < (parseInt(points[1]) - parseInt(points[0])); i++) {
          queue[message.channel.guild.id][i - 1].skip = true;
        }

        client.voiceConnections.get(message.channel.guild.id).stopPlaying();
      }

      else
        queue[message.channel.guild.id].splice(parseInt(points[0]) - 1, (parseInt(points[1]) - parseInt(points[0])) + 1);

      return message.channel.createMessage(`Successfully removed \`${(parseInt(points[1]) - parseInt(points[0]) + 1)}\` items in the queue.`);
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
