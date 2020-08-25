var l = require('../util/logging.js');

module.exports = async (user, oldUser) => {
  if(!user || !oldUser)
    return;

  var gList = [];
  var e = {
    footer: {icon_url: user.avatarURL, text: "User Update"}
  };

  if(user.username !== oldUser.username || user.discriminator !== oldUser.discriminator)
    e.description = `<@${user.id}> updated their account name from \`${oldUser.username}#${oldUser.discriminator}\`, to \`${user.username}#${user.discriminator}\`.`;
  else
    return;

  client.guilds.forEach(g => {
    if(g.members.has(user.id))
      gList.push(g.id);
  });

  await l.multiLog(gList, user.id, e, guilds);
};
