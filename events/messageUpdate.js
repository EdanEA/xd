var l = require('../util/logging.js');

module.exports = async (message, oldMessage) => {
  var s = guilds[message.channel.guild.id];

  if(!s.logging.logEnabled || !s.logging.logChannel)
    return;

  if(message.author.id == client.user.id)
    return;

  if(!message.content || !oldMessage.content || !message.author)
    return;
  else
    var e = {
      description: `A message from <@${message.author.id}> was edited in <#${message.channel.id}>.`,
      fields: [
        {name: "**Old Message:**", value: `\`\`\`${oldMessage.content}\`\`\``},
        {name: "**New Message:**", value: `\`\`\`${message.content}\`\`\``}
      ],
      color: parseInt(`0x${s.color}`),
      footer: {icon_url: message.author.avatarURL, text: "Message Update"},
      timestamp: new Date().toISOString()
    };

  await l.log(e, s);
};
