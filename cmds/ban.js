var f = require('../util/misc.js');
exports.run = async (message, args) => {
  if(!f.hasAdmin(message.member, message.channel.guild))
    return message.channel.createMessage(`<@${message.author.id}>, no >:(((((`);

  var idReg = new RegExp('[0-9]{18}', 'g');
  var mReg = /<@!?[0-9]{18}>/g;
  var clearReg = /\s+/g;
  var msg = args.join(' ');
  var r;
  var id;

  if(!idReg.test(msg))
    return message.channel.createMessage(`<@${message.author.id}>, you need to provide the user's information.`);

  id = msg.match(idReg)[0];
  r = msg.replace(mReg, "").replace(idReg, "").replace(clearReg, " ").slice(1);

  var c = f.compare(message.member, message.channel.guild.members.get(id));
  var cb = f.compare(message.channel.guild.members.get(client.user.id), message.channel.guild.members.get(id));

  if(c == false)
    return message.channel.createMessage(`<@${message.author.id}>, the user you're trying to ban has a higher role than you.`);

  if(cb == false)
    return message.channel.createMessage(`<@${message.author.id}>, I cannot ban that user.`);

  if(!r)
    r = `No reason was given.\n\n(Banned by ${client.users.get(message.author.id).username}#${client.users.get(message.author.id).discriminator})`;
  else
    r = `${r} \n\n(Banned by ${message.author.username}#${message.author.discriminator})`;

  await client.banGuildMember(message.channel.guild.id, id, 1, r);
  await client.createMessage(message.channel.id, {embed: {
    description: `${message.author.username}#${message.author.discriminator} banned ${client.users.get(id).username}#${client.users.get(id).discriminator}`,
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
