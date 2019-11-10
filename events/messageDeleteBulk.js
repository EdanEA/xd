var l = require('../util/logging.js');

module.exports = async (messages) => {
  if(messages.length <= 0) return;

  try {
    var s = guilds[messages[0].channel.guild.id];
  } catch (e) {
    return;
  }

  var e = {
    description: `\`${messages.length}\` messages were deleted in <#${messages[0].channel.id}>.`,
    color: parseInt(`0x${s.color}`),
    footer: {icon_url: messages[0].channel.guild.avatarURL, text: `Message Bulk Delete`},
    timestamp: new Date().toISOString()
  };

  if(!s.logging.logEnabled || !s.logging.logChannel)
    return;

  await l.log(e, s);
};
