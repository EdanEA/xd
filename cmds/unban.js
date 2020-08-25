var f = require('../util/misc.js');
exports.run = async (message, args) => {
  if(!f.hasAdmin(message.member, message.channel.guild))
    return message.channel.createMessage(`<@${message.author.id}>, you don't have appropriate permissions to use this command.`);

  var idReg = new RegExp('[0-9]{18}', 'g');
  var clearReg = /\s+/g;
  var msg = args.join(' ');
  var r;
  var id;

  if(!idReg.test(msg))
    return message.channel.createMessage(`<@${message.author.id}>, you need to provide the user's information.`);

  id = msg.match(idReg)[0];
  r = msg.replace(idReg, "").replace(clearReg, " ").slice(1);

  if(!r)
    r = `No reason was given.\n\n(Unbanned by ${message.author.username}#${message.author.discriminator})`;
  else
    r = `${r}\n\n(Unbanned by ${message.author.username}#${message.author.discriminator})`;

  var user = client.users.get(id) ? `${client.users.get(id).username}#${client.users.get(id).discriminator}` : id;

  await client.unbanGuildMember(message.channel.guild.id, id);
  await client.createMessage(message.channel.id, {embed: {
    description: `${message.author.username}#${message.author.discriminator} unbanned ${user}`,
    color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
    fields: [{ name: "Reason", value: `\`\`\`${r}\`\`\`` }]
  }});
};

exports.info = {
  usage: ":unban <user> [reason]",
  args: "<user>: A user's ID.\n[reason]: The reason for unbanning.",
  examples: ":unban 522767467198808074\n:unban 338511024346890240 Sang for me! :DDD",
  description: "Allows an administrator to unban a user from the guild.",
  type: "mod"
};
