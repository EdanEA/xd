var f = require('../util/misc.js');
exports.run = async (message, args) => {
  if(!f.hasAdmin(message.channel.guild.id, message.author.id, client))
    return message.channel.createMessage(`<@${message.author.id}>, no >:(((((`);

  var idReg = /[0-9]{18}/g;
  var idRegex = new RegExp('[0-9]{18}', 'g');
  var mReg = /<@[0-9]{18}>/g;
  var clearReg = /\s+/g;
  var msg = args.join(' ');
  var r;
  var id;

  if(!idRegex.test(msg))
    return message.channel.createMessage(`<@${message.author.id}>, you need to provide the user's information.`);

  id = msg.match(idReg);
  r = msg.replace(mReg, "").replace(idReg, "").replace(clearReg, " ");

  var c = f.compare(message.member, message.channel.guild.members.get(u));
  var cb = perms.compare(message.channel.guild.members.get(client.user.id), message.channel.guild.members.get(u));

  if(c == false)
    return message.channel.createMessage(`<@${message.author.id}>, the user you're trying to ban has a higher role than you.`);

  if(cb == false)
    return message.channel.createMessage(`<@${message.author.id}>, I cannot ban that user.`);

  if(!r)
    r = `No reason was given.\n\n(Banned by ${client.users.get(message.author.id).username}#${client.users.get(message.author.id).discriminator})`;
  else
    r = `${r} \n\n(Banned by ${message.author.username}#${message.author.discriminator})`;

  await client.banGuildMember(message.channel.guild.id, u, r);
  await client.createMessage(message.channel.id, {embed: {
    description: `${message.author.username}#${message.author.discriminator} banned ${client.users.get(u).username}#${client.users.get(u).discriminator}`,
    color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
    fields: [{ name: "Reason", value: `\`\`\`${r}\`\`\`` }]
  }});

  return;
};

exports.info = {
  usage: ":ban <user> [reason]",
  args: "<user>: Either an @ mention or a user ID.\n[reason]: The reason for banning the member.",
  examples: ":ban <@338511024346890240>\n:ban 384660484328128523",
  description: "Allows an administrator to ban someone via commands.",
  type: "mod"
};
