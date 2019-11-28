var l = require('../util/logging.js');

module.exports = async (guild, member) => {
  var s = guilds[guild.id];
  var url = member.avatar == null ? member.defaultAvatar : `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.jpg?size=2048`;
  var e;

  if(s.mod.roleSaveActive)
    rolesave[guild.id].forEach(m => {
      if(member.id == m.id)
        for(var i = 0; i < m.roles.length; i++) member.addRole(m.roles[i]);
    });

  if(!s.logging.logEnabled || !s.logging.logChannel)
    return;

  if(s.logging.wgb)
    await client.createMessage(s.logging.wgbChannel, `Welcome, <@${member.id}>!`);

  e = {
    description: `\`${member.username}#${member.discriminator} (${member.id})\` joined the guild.\n\nAccount creation date: \`${moment(member.createdAt).format("MMMM Do YY, h:mm:s a")}\``,
    color: parseInt(`0x${s.color}`),
    footer: {icon_url: member.avatarURL, text: "User Joined the Guild"},
    timestamp: new Date().toISOString()
  };

  await l.log(e, s);
};
