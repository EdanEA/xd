var l = require('../util/logging.js');

module.exports = async (user, oldUser) => {
  if(!user || !oldUser)
    return;

  var guilds = [];
  var url = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=1024`;
  var e = {
    footer: {icon_url: url, text: "User Update"}
  };

  if(user.username !== oldUser.username || user.discriminator !== oldUser.discriminator)
    e['description'] = `\`${oldMember.username}#${oldMember.discriminator}\` is now known as \`${member.username}#${member.discriminator}\`.`;
  else
    return;

  for(var g of client.guilds) {
    if(g[1].members.has(user.id))
      guilds.push(g[0]);
  }

  await l.multiLog(guilds, user.id, e);
};
