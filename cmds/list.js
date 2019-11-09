const yt = require('../util/yt.js');
exports.run = async (message, args) => {
  function chunkArray(array, size) {
    var a = [];

    for (var i = 0; i < array.length; i += size) {
      chunk = array.slice(i, i+size);
      a.push(chunk);
    }

    return a;
  }

  async function queueList(queue, channel) {
    if(!queue[0]) return null;

    var type = true;
    var fields = [];
    var count = 1;
    var length = 0;

    setInterval(() => {
      if(type) {
        message.channel.sendTyping();
      } else clearInterval();
    }, 1000);

    for(var v of queue) {
      let dur = moment.duration(v.duration, "seconds").format('h [hours,] m [minutes,] s [seconds]');
      length += v.duration;

      fields.push({name: `\`[${count}]\` ${v.title}`, value: `Requested by: <@${v.requester}>\nLength: \`${moment.duration(v.duration, "seconds").format('h [hours,] m [minutes,] s [seconds]')}\``});
      count++;
    }

    var description = `Number of Items: \`${queue.length}\`\nLength: \`${moment.duration(length, "seconds").format('h [hours,] m [minutes,] s [seconds]')}\``
    var pages = chunkArray(fields, 5);

    type = false;

    return {pages: pages, description: description};
  }

  async function checkReactions(mid) {
    var r;

    await message.channel.getMessage(mid).then(async m => {
      if(m.reactions['⬅'].count > 1) {
        await m.getReaction('⬅').then(mr => {
          for(var u of mr) {
            if(u.id == message.author.id) {
              r = -1;
              m.removeReaction('⬅', message.author.id);
            }
          }
        });
      } else if(m.reactions['➡'].count > 1) {
        await m.getReaction('➡').then(mr => {
          for(var u of mr) {
            if(u.id == message.author.id) {
              r = 1;
              m.removeReaction('➡', message.author.id);
            }
          }
        });
      } else r = null;
    });

    return r;
  }

  if(!queue[message.channel.guild.id] || !queue[message.channel.guild.id][0]) {
    return message.channel.createMessage({embed: {
      title: `${message.channel.guild.name}'s Queue`,
      description: "There's nothing in the queue.",
      color: 0xff0000
    }});
  } else {
    await queueList(queue[message.channel.guild.id], message.channel).then(async (o) => {
      if(queue[message.channel.guild.id].length > 5) {
        var i = 0;
        let embed_base = {title: `${message.channel.guild.name}'s Queue`, description: o.description, fields: o.pages[i], color: parseInt(`0x${guilds[message.channel.guild.id].color}`), footer: {text: "React to see the rest of the queue."} };

        await message.channel.createMessage({embed: embed_base}).then(async m => {
          await m.addReaction('⬅');
          await m.addReaction('➡');

          var cr = setInterval(async () => {
            await checkReactions(m.id).then(r => {
              if(r == 1) {
                if(i + 1 > o.pages.length - 1) i = 0;
                else i += 1;
              } else if (r == -1) {
                if(i - 1 < 0) i = o.pages.length - 1;
                else i -= 1;
              } else i = i;
            });

            m.edit({embed: {title: `${message.channel.guild.name}'s Queue`, description: o.description, fields: o.pages[i], color: parseInt(`0x${guilds[message.channel.guild.id].color}`), footer: {text: "React to see the rest of the queue."} }});
          }, 5000);

          setTimeout(async () => {
            clearInterval(cr);
            await m.removeReactions();
          }, 90000);
        });
      } else {
        return message.channel.createMessage({embed: {
          title: `${message.channel.guild.name}'s Queue`,
          description: o.description,
          fields: o.pages[0],
          color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
          footer: {text: "And That's All"}
        }});
      }
    });
  }
};

exports.info = {
  usage: ":list",
  args: "None.",
  description: "Shows the queue list for the server.",
  examples: ":list",
  type: "music"
};
