const yt = require('../util/yt.js');

exports.run = async function(message, args) {
  async function finalize(id) {
    await message.channel.getMessage(id).then(async m => {
      var out = {yes: 0, no: 0, bool: null, tie: false};

      if(!m.reactions['✅'] || !m.reactions['❌']) out.bool = false;
      else {
        out.bool = m.reactions['✅'].count > m.reactions['❌'].count ? true : false;
        out.tie = m.reactions['✅'].count == m.reactions['❌'].count ? true : false;

        out.yes = m.reactions['✅'].count - 1;
        out.no = m.reactions['❌'].count - 1;
      }

      if(out.bool && !out.tie) {
        await m.removeReactions();
        await m.edit({embed: {title: "Vote passed.", description: `The vote passed with ${out.yes} votes over ${out.no}.`, color: 0x42C0FB}});

        if(client.voiceConnections.get(message.channel.guild.id) && client.voiceConnections.get(message.channel.guild.id).playing) {
          queue[message.channel.guild.id][0].skip = true;
          await client.voiceConnections.get(message.channel.guild.id).stopPlaying();
        }
        
        else if(!client.voiceConnections.get(message.channel.guild.id) || !client.voiceConnections.get(message.channel.guild.id).playing)
          queue[message.channel.guild.id].shift()
      } else if(!out.bool && !out.tie) {
        await m.removeReactions();
        await m.edit({embed: {title: "Vote failed.", description: `The vote failed with ${out.no} votes over ${out.yes}.`, color: 0x42C0FB}});
      } else if(out.tie) {
        await m.removeReactions();
        await m.edit({embed: {title: "Vote tied.", description: `The vote tied with ${out.yes} votes.`, color: 0x42C0FB}});
      }

      return;
    });

    return;
  }

  if(!queue[message.channel.guild.id] || !queue[message.channel.guild.id][0]) return message.channel.createMessage(`<@${message.author.id}>, I cannot skip, as there's nothing in the queue.`);

  var mid;
  await yt.info(queue[message.channel.guild.id][0].id).then(async i => {
    await client.createMessage(message.channel.id, {embed: {
      title: 'Proposed item to be skipped.',
      description: `${i.title} (${i.duration})\nRequested by <@${queue[message.channel.guild.id][0].requester}>`,
      thumbnail: { url: `https://img.youtube.com/vi/${i.id}/0.jpg` },
      color: 0x42C0FB
    }}).then(async m => {
      mid = m.id;

      await m.addReaction('✅');
      await m.addReaction('❌');
    });
  });

  setTimeout(() => {
    finalize(mid)
  }, 10000);
};

exports.info = {
  usage: ":voteskip",
  args: "None.",
  examples: ":voteskip",
  description: "Allows a vote to be called, to see if the current item playing should be skipped. This vote lasts 10 seconds.",
  type: "music"
};
