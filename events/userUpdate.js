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
    e['description'] = `\`${oldUser.username}#${oldUser.discriminator}\` is now known as \`${user.username}#${user.discriminator}\`.`;
  else
    return;

  client.guilds.forEach(g => {
    if(g.members.has(user.id))
      guilds.push(g);
  });

  await l.multiLog(guilds, user.id, e);
};
