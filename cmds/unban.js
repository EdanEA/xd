var f = require('../util/misc.js');
exports.run = async (messages, args) => {
  if(!f.hasAdmin(message.channel.guild.id, message.author.id, client))
    return message.channel.createMessage(`<@${message.author.id}>, you don't have appropriate permissions to use this command.`);

  var idRegex = new RegExp('[0-9]{18}', 'g');
  var clearReg = /\s+/g;
  var msg = args.join(' ');
  var r;
  var id;

  if(!idRegex.test(msg))
    return message.channel.createMessage(`<@${message.author.id}>, you need to provide the user's information.`);

  id = msg.match(idReg);

  r = msg.replace(idReg, "").replace(clearReg, " ");

  var c = f.compare(message.member, message.channel.guild.members.get(u));
  var cb = perms.compare(message.channel.guild.members.get(client.user.id), message.channel.guild.members.get(u));

  if(!r)
    r = `No reason was given.\n\n(Unbanned by ${client.users.get(message.author.id).username}#${client.users.get(message.author.id).discriminator})`;
  else
    r = `${r} \n\n(Unbanned by ${message.author.username}#${message.author.discriminator})`;

  await client.unbanGuildMember(message.channel.guild.id, u, r);
  await client.createMessage(message.channel.id, {embed: {
    description: `${message.author.username}#${message.author.discriminator} unbanned ${client.users.get(u).username}#${client.users.get(u).discriminator}`,
    color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
    fields: [{ name: "Reason", value: `\`\`\`${r}\`\`\`` }]
  }});

  return;

};

exports.info = {
  usage: ":unban <user> [reason]",
  args: "[users]: A user's ID.\nThe reason for unbanning.",
  examples: ":unban 522767467198808074\n:unban 338511024346890240 Sang for me! :DDD",
  description: "Allows an administrator to unban a user from the guild.",
  type: "mod"
};
