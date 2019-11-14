const l = require('../util/logging.js');
module.exports = async (guild, member, oldMember) => {
  var s = guilds[guild.id];
  var e = {
    timestamp: new Date().toISOString(),
    footer: {icon_url: member.avatarURL, text: "Guild Member Update"},
    color: parseInt(`0x${s.color}`)
  };

  if(!s.logging.logEnabled || !s.logging.logChannel)
    return;

  if(oldMember.nick !== member.nick) {
    var oldNick;
    var nick;

    if(oldMember.nick && !member.nick)
      e['description'] = `<@${member.id}> has removed their nickname.`;
    else if(oldMember.nick && member.nick)
      e['description'] = `\`${oldMember.nick}\`'s nickname is now \`${member.nick}\`.`;
    else if(!oldMember.nick && member.nick)
      e['description'] = `<@${member.id}>'s nickname is now \`${member.nick}\`.`;
  } else
    return;

  await l.log(e, s);
};
