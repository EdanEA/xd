var l = require('../util/logging.js');

module.exports = async (guild, user) => {
  var s = guilds[guild.id];
  var e;

  if(!s.logging.logEnabled || !s.logging.logChannel)
    return;

  await l.getBan(user.id, guild.id).then(b => {
    e = {
      description: `**${user.username}#${user.discriminator}** (${user.id}) was banned.\nBy: <@${b.staff}>`,
      fields: [{name: `**Reason:**`, value: `\`\`\`${b.reason}\`\`\``, inline: true}],
      color: 0xff0000,
      timestamp: new Date().toISOString(),
      footer: {icon_url: user.avatarURL, text: "Guild Member Banned"}
    };
  });

  await l.log(e, s);
};
