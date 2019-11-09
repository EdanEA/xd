var f = require('../util/misc.js');
exports.run = async (message, args) => {
  if(!f.hasMod(message.channel.guild.id, message.author.id, client))
    return;

  var prefix;
  var oldPrefix = guilds[message.channel.guild.id].prefix;

  if(args.join(' ').length > 5)
    return message.channel.createMessage("The length of the prefix is too long. The limit is `5` characters.");

  if(args.length <= 0)
    prefix = k.conf.basePrefix;
  else
    prefix = args.join(' ');

  guilds[message.channel.guild.id].prefix = prefix;

  return message.channel.createMessage({embed: {
    title: `Updated \`${message.channel.guild.name}\`'s Prefix`,
    fields: [
      {name: "**Old Prefix**", value: `\`\`\`${oldPrefix}\`\`\``},
      {name: "**New Prefix**", value: `\`\`\`${prefix}\`\`\``}
    ],
    color: parseInt(`0x${guilds[message.channel.guild.id].color}`)
  }});
};

exports.info = {
  usage: ":prefix [prefix]",
  args: "[prefix]: The new prefix; if nothing, resets the prefix.",
  examples: ":prefix !\n:prefix xd:\n:prefix",
  description: "Allows a server moderator to update the prefix for the server.",
  type: "mod"
};
