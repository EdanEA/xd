var f = require('../util/misc.js');
exports.run = async (message, args) => {
  if(!f.hasMod(message.channel.guild.id, message.author.id, client))
    return;

  var hexReg = /^#?(?:[0-9a-f]{3}){1,2}$/gi;
  var hexRegEx = new RegExp('^#?(?:[0-9a-f]{3}){1,2}$', 'gi');
  var msg = args.join(' ');
  var oldHex = guilds[message.channel.guild.id].color;
  var hex;

  if(!hexRegEx.test(msg))
    hex = k.conf.baseColor;
  else
    hex = msg.match(hexReg)[0];

  hex.startsWith("#") ? hex = hex.slice(1) : hex = hex;
  guilds[message.channel.guild.id].color = hex;

  return message.channel.createMessage({embed: {
    title: `Updated \`${message.channel.guild.name}\`'s Color`,
    fields: [
      {name: "Old Color Hex", value: `\`\`\`#${oldHex}\`\`\``},
      {name: "New Color Hex", value: `\`\`\`#${hex}\`\`\``}
    ],
    color: parseInt(`0x${hex}`)
  }});
};

exports.info = {
  usage: ":color [hex]",
  args: "[hex]: The HTML hex color code for the guild's color. If nothing is given, the hex is reset to the base hex.",
  description: "Allows a guild moderator to update the guild hex color--used for embeds and such.",
  examples: ":color ff0000\n:color #000\n:color 0000ff",
  type: "mod"
};
