var l = require('../util/logging.js');

module.exports = async (guild, user) => {
  var s = guilds[guild.id];
  var e;

  if(!s.logging.logEnabled || !s.logging.logChannel)
    return;

  await l.getUnban(user.id, guild.id).then(r => {
    e = {
      color: parseInt(`0x${s.color}`),
      description: `${user.username}#${user.discriminator} (${user.id}) was unbanned from the guild.\nBy: <@${r.staff}>.`,
      footer: {icon_url: user.avatarURL, text: "Guild Member Unbanned"},
      timestamp: new Date().toISOString()
    };

    if(r.reason !== null)
      e["fields"] = [{name: "Reason", value: `\`\`\`${r.reason}\`\`\``}];
  });

  await l.log(e, s);
};
