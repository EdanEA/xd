const l = require('../util/logging.js');

module.exports = async (guild, member) => {
  var s = guilds[guild.id];

  if(!s.logging.logEnabled || !s.logging.logChannel)
    return;

  if(s.logging.wgb == true)
    client.createMessage(s.logging.wgbChannel, `Bye-bye, \`${member.username}#${member.discriminator}\`.`);

  await l.getKick(member.id, guild.id).then(async k => {
    var e = {
      description: `**${member.username}#${member.discriminator}** (${member.id}) left the server.`,
      color: parseInt(`0x${s.color}`),
      footer: {icon_url: member.avatarURL, text: "Guild Member Left the Guild"},
      timestamp: new Date().toISOString()
    };

    await l.log(e, s);

    if(k) {
      var eKick = {
        description: `**${member.username}#${member.discriminator}** (${member.id}) was kicked.\nBy: <@${k.staff}>`,
        fields:[{name: "Reason:", value: `\`\`\`${k.reason}\`\`\``}],
        color: 0x8b0000,
        footer: {icon_url: member.avatarURL, text: "Guild Member Kick"},
        timestamp: new Date().toISOString()
      };

      await l.log(eKick, s);
    }
  });
};
