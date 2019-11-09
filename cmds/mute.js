var f = require('../util/misc.js');
exports.run = async (message, args) => {
  if(!f.hasMod(message.channel.guild.id, message.author.id, client))
    return message.channel.createMessage(`<@${message.author.id}>, you do not have sufficient permissions to use this command.`);

  var msg = args.join(' ');
  var mute = false;
  var id;
  var l = 0;
  var length;

  var idReg = /[0-9]{18}/g;
  var idRegex = new RegExp('[0-9]{18}', 'g');
  var mReg = /<@[0-9]{18}>/g;
  var clearReg = /\s+/g;

  if(!idRegex.test(msg))
    return message.channel.createMessage(`<@${message.author.id}>, an invalid user was provided.`);

  id = msg.match(idReg)[0];
  length = msg.replace(mReg, "").replace(idReg, "").replace(clearReg, " ");

  // To do: Length logic
  var dayReg = new RegExp('{0-2}d', 'gi');
  var hourReg = new RegExp('{0-48}h', 'gi');
  var minuteReg = new RegExp('{0-2880}m', 'gi');

  if(dayReg.test(length))
    l += parseInt(length.match(dayReg)[0].split('d')[0]) * 1440;

  if(hourReg.test(length))
    l += parseInt(length.match(hourReg)[0].split('d')[0]) * 60;

  if(minuteReg.test(length))
    l += parseInt(length.match(minuteReg)[0].split('d')[0]);

  if(l > 2880)
    l = 2880;

  if(message.member.roles.includes(guilds[message.channel.guild.id].mod.muteRoleId) || message.member.voiceState.mute)
    mute = true;

  if(mute)
    await f.unmuteMember(message.channel.guild.id, id, client, guilds[message.channel.guild.id]);
  else
    await f.muteMember(message.channel.guild.id, id, l, client, guilds[message.channel.guild.id]);

  mute = !mute ? "muted" : "unmuted";

  return message.channel.createMessage(`<@${message.author.id}>, I ${mute} <@${id}>.`);
};

exports.info = {
  usage: ":mute <user> [length]",
  args: "<user>: A user's ID or mention.\n[length]: The length of time for a person to be muted, e.g. `1h 30m` or `1d` or `90m`.\nAccepts days (`d`), hours (`h`), minutes (`m`).\nMaximum length: `2880m`, `48h`, or `2d`.",
  examples: ":mute <@240091377046781953>\n:mute 579010970689601536 1h\n:mute 200075344336650240 90m",
  description: "Allows a moderator to mute a user, with a timer. Do note, if a user is already muted, using this command on them will unmute them.",
  type: "mod"
};
