var f = require('../util/misc.js');
exports.run = async (message, args) => {
  if(!f.hasMod(message.channel.guild.id, message.author.id, client))
    return message.channel.createMessage(`<@${message.author.id}>, you don't have appropriate permissions to use this command.`);

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
    return message.channel.createMessage(`<@${message.author.id}>, the user you're trying to kick has a higher role than you.`);

  if(cb == false)
    return message.channel.createMessage(`<@${message.author.id}>, I cannot kick that user.`);

  if(!r)
    r = `No reason was given. (Kicked by ${client.users.get(message.author.id).username}#${client.users.get(message.author.id).discriminator})`;
  else
    r = `${r} \n\n(Kicked by ${message.author.username}#${message.author.discriminator})`;

  await client.kickGuildMember(message.channel.guild.id, u, r);
  await client.createMessage(message.channel.id, {embed: {
    description: `${message.author.username}#${message.author.discriminator} kicked ${client.users.get(u).username}#${client.users.get(u).discriminator}`,
    color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
    fields: [{ name: "Reason", value: `\`\`\`${r}\`\`\`` }]
  }});

  return;
};

exports.info = {
  usage: ":kick <user> [reason]",
  args: "{user}: Either an @ mention or a user ID.\n[reason]: The reason for kicking the member.",
  examples: ":kick <@115340880117891072>\n:kick 117728104935456770 He was being a lil' bitch, just like m' boi Johnathan Andrew Wicker Jr.",
  description: "Allows a mod to kick someone via commands.",
  type: "mod"
};
