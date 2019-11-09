exports.run = function(message, args) {
  if(!k.conf.staff.includes(message.author.id) && k.conf.ownerID !== message.author.id)
    return;

  if(!args[0]) return message.channel.createMessage(`<@${message.author.id}>, I need the guild ID.`);

  var g = client.guilds.get(args[0]);

  if(!g) return message.channel.createMessage(`<@${message.author.id}>, I cannot find that guild.`);

  if(!g.defaultChannel.permissionsOf(client.user.id).has("createInstantInvite"))
    return message.channel.createMessage(`<@${message.author.id}>, I cannot make invites for that guild.`);

  g.defaultChannel.createInvite({maxAge : 0}).then(i => {
    return message.channel.createMessage(`https://discord.gg/${i.code}`);
  });

  return;
};

exports.info = {
  usage: ":cinv <id>",
  args: "<id>: A guild's ID.",
  examples: ":cinv 380310916341956610",
  description: "Allows the bot's staff to create an invite to a guild remotely.",
  type: "staff"
};
