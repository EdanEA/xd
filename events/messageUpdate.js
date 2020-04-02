var l = require('../util/logging.js');

module.exports = async (message, oldMessage) => {
  var s = guilds[message.channel.guild.id];

  if(!s.logging.logEnabled || !s.logging.logChannel || (!s.logging.events.includes("messageupdate") && s.logging.events.length > 0))
    return;

  if(message.author.id == client.user.id)
    return;

  if(!message.content || !oldMessage.content || !message.author)
    return;
  else
    if(message.content == oldMessage.content)
      return;

    var e = {
      description: `A message from <@${message.author.id}> was edited in <#${message.channel.id}>.`,
      fields: [
        {name: "Pre-Edit", value: `\`\`\`${oldMessage.content.split("```").join(' ').trim()}\`\`\``},
        {name: "Edited", value: `\`\`\`${message.content.split("```").join(' ').trim()}\`\`\``}
      ],
      color: parseInt(`0x${s.color}`),
      footer: {icon_url: message.author.avatarURL, text: "Message Update"},
      timestamp: new Date().toISOString()
    };

  await l.log(e, s);
};
