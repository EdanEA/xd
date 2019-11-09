var f = require('../util/misc.js');
exports.run = (message, args) => {
  if(!f.hasMod(message.channel.guild.id, message.author.id, client))
    return message.channel.createMessage(`<@${message.author.id}>, you do not have sufficient permissions to use this command.`);

  var msg = args.join(' ');
  var deaf = false;
  var id;
  
  var idReg = /[0-9]{18}/g;
  var idRegex = new RegExp('[0-9]{18}', 'g');

  if(!idRegex.test(msg))
    return message.channel.createMessage(`<@${message.author.id}>, you failed to provide a user for the command.`);

  id = msg.match(idReg)[0];

  var member = message.channel.guild.members.get(id);
  if(!member)
    return message.channel.createMessage(`<@${message.author.id}>, you provided an invalid member.`);

  if(member.voiceState.deaf)
    deaf = true;

  member.edit({deaf: !deaf});

  deaf = deaf ? "undeafened" : "deafened";

  return message.channel.createMessage(`<@${message.author.id}>, I ${deaf} <@${id}>.`);
};

exports.info = {
  usage: ":deafen <user>",
  args: "<user>: A user's ID or mention.",
  examples: ":deafen <@472622841615876097>\n:deafen 573445218691579914",
  description: "Allows a moderator to deafen and mute a member in a voice channel.\nDo note that to undeafen a deafened member, you simply use this command again on them.",
  type: "mod"
};
