const yt = require('../util/yt.js');
const moment = require('moment');
require('moment-duration-format');

exports.run = async function(message, args) {
  async function finalize(id, c) {
    await message.channel.getMessage(id).then(async m => {
      var out = {yes: 0, no: 0, bool: null, tie: false};

      if(!m.reactions['✅'] || !m.reactions['❌'])
        out.bool = false;
      else {
        out.bool = (m.reactions['✅'].count > m.reactions['❌'].count) && m.reactions['✅'].count > c ? true : false;
        out.tie = m.reactions['✅'].count == m.reactions['❌'].count ? true : false;

        out.yes = m.reactions['✅'].count - 1;
        out.no = m.reactions['❌'].count - 1;
      }

      if(out.bool && !out.tie) {
        await m.removeReactions();
        await m.edit({embed: {
          title: "Vote passed.",
          description: `The vote passed with ${out.yes} votes over ${out.no}.`,
          color: 0x42C0FB
        }});

        var p = client.voiceConnections.get(message.channel.guild.id);

        if(p && p.playing) {
          await client.voiceConnections.get(message.channel.guild.id).stop();
        } else
          queue[message.channel.guild.id].shift();
      } else if(!out.bool && !out.tie) {
        await m.removeReactions();
        await m.edit({embed: {
          title: "Vote failed.",
          description: `The vote failed with ${out.no} votes over ${out.yes}.\n\nThe minimum number of votes needed was ${c}.`,
          color: 0xB22222
        }});
      } else if(out.tie) {
        await m.removeReactions();
        await m.edit({embed: {
          title: "Vote tied.",
          description: `The vote tied with ${out.yes} votes.`,
          color: 0x4DDDDD
        }});
      }

      return;
    });

    return;
  }

  var g = guilds[message.channel.guild.id];

  if(queue[message.channel.guild.id].length == 0)
    return message.channel.createMessage(`I cannot skip, as there's nothing in the queue.`);

  var c = 1;

  if(g.music.vc !== null && client.voiceConnections.get(message.channel.guild.id)) {
    var count = 0;

    message.channel.guild.channels.get(g.music.vc).voiceMembers.forEach(m => {
      if(!m.bot)
        count++;
    });

    if(count !== 0)
      c = Math.floor(count * (2 / 3));
  }

  var mid;
  var i = queue[message.channel.guild.id][0];

  await client.createMessage(message.channel.id, {embed: {
    title: 'Proposed item to be skipped.',
    description: `${i.title} (${moment.duration(i.duration, "seconds").format("h [hours,] m [minutes,] s [seconds]")})\nRequested by <@${i.requester}>`,
    thumbnail: { url: `${i.img}` },
    color: 0x4DDDDD
  }}).then(async m => {
    mid = m.id;

    await m.addReaction('✅');
    await m.addReaction('❌');
  });

  setTimeout(() => {
    finalize(mid, c);
  }, 15e3);
};

exports.info = {
  usage: "voteskip%",
  args: "None.",
  examples: "voteskip%",
  description: "Allows a vote to be called, to see if the current item playing should be skipped. This vote lasts 15 seconds.",
  type: "music"
};
