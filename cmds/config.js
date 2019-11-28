const f = require('../util/misc.js');
exports.run = async (message, args) => {
  var g = guilds[message.channel.guild.id];
  var wgbChannel = !g.logging.wgbChannel ? null : `<#${g.logging.wgbChannel}>`;

  if(!args[0]) {
    return message.channel.createMessage({embed: {
      color: parseInt(`0x${g.color}`),
      footer: { text: "To change a setting, do `:config ([option] [value])`." },
      fields: [
        { name: "`[1]` Logging", value: `Currently: \`${g.logging.logEnabled}\`\nValue: \`true\` or \`false\`.` },
        { name: "`[2]` Logging Channel", value: `Currently: \`${g.logging.logChannel}\`\nValue: A text-channel's ID.` },
        { name: "`[3]` Welcome/Goodbye Messages", value: `Currently: \`${g.logging.wgb}\`\nValue: \`true\` or \`false\`.` },
        { name: "`[4]` Welcome/Goodbye Channel", value: `Currently: \`${wgbChannel}\`\nValue: A text-channel's ID.` },
        { name: "`[5]` Default Search", value: `Currently: \`${g.music.defaultSearch}\`\nValue: Either \`youtube\` or \`soundcloud\`.` },
        { name: "`[6]` Song Start Message Type", value: `Currently: \`${g.music.msgType}\`\nValue: Either \`0\` for no messages, \`1\` for embed messages or \`2\` for text-based messages.` },
        { name: "`[7]` Message Embed Color", value: `Currently: \`${g.color}\`\nValue: An HTML color code. (e.g. #ff0000)` },
        { name: "`[8]` Guild Prefix", value: `Currently: \`${g.prefix}\`\nValue: A string of characters less than 4 characters in length.` }
      ]
    }});
  }

  if(args[0] == "-r")
    return message.channel.createMessage(`\`\`\`json\n${JSON.stringify(g, undefined, 2)}\`\`\``);

  if(!f.hasAdmin(message.channel.guild.id, message.author.id, client))
    return message.channel.createMessage(`You don't have permission to change the configuration.`);

  switch(parseInt(args[0])) {
    case 1:
      if(!args[1])
        g.logging.logEnabled = false;

      if(args[1] == "true" || Boolean(parseInt(args[1])))
        g.logging.logEnabled = true;
      else if(args[1] == "false" || !Boolean(parseInt(args[1])))
        g.logging.logEnabled = false;

      if(!g.logging.logChannel && g.logging.logEnabled) {
        var idReg = new RegExp('[0-9]{18}', 'g');
        var id;

        await message.channel.createMessage(`<@${message.author.id}>, what channel do you want logs to be sent in?\nEither the channel's ID or its mention.`);
        var check = await message.channel.awaitMessages(m => m.author.id == message.author.id, { maxMatches: 1, time: 15000 });

        if(!check[0] || !idReg.test(check[0].content))
          return message.channel.createMessage(`<@${message.author.id}>, you did not give a valid channel ID.`);

        id = check[0].content.match(idReg)[0];
        g.logging.logChannel = id;

        return message.channel.createMessage(`<@${message.author.id}>, logging is now set to \`true\`; logging channel is now set to \`${g.logging.logChannel}\`.`);
      }

      return message.channel.createMessage(`<@${message.author.id}>, logging is now set to \`${g.logging.logEnabled}\`.`);

    case 2:
      var idReg = new RegExp('[0-9]{18}', 'g');
      var msg = args.join(' ');
      var id;

      if(!idReg.test(msg))
        g.logging.logChannel = null;
      else
        g.logging.logChannel = msg.match(idReg)[0];

      return message.channel.createMessage(`<@${message.author.id}>, logging channel is now set to \`${g.logging.logChannel}\`.`);

    case 3:
      if(args[1] == "true" || Boolean(parseInt(args[1])))
        g.logging.wgb = true;
      else if(args[1] == "false" || !Boolean(parseInt(args[1])))
        g.logging.wgb = false;

      if(!g.logging.wgbChannel && g.logging.wgb) {
        var idReg = new RegExp('[0-9]{18}', 'g');
        var id;

        await message.channel.createMessage(`<@${message.author.id}>, what channel do you want welcome/goodbye messages to be sent to?\nEither the channel's ID or its mention.`);
        var check = await message.channel.awaitMessages(m => m.author.id == message.author.id, { maxMatches: 1, time: 15000 });

        if(!check[0] || !idReg.test(check[0].content))
          return message.channel.createMessage(`<@${message.author.id}>, you did not give a valid channel ID.`);

        id = check[0].content.match(idReg)[0];

        g.logging.wgbChannel = id;

        return message.channel.createMessage(`<@${message.author.id}>, welcome/goodbye messages are now set to \`true\`; welcome/goodbye channel is now set to \`${g.logging.wgbChannel}\`.`);
      }

      return message.channel.createMessage(`<@${message.author.id}>, welcome/goodbye messages are now set to \`${g.logging.wgb}\`.`);

    case 4:
      var idRegEx = new RegExp('[0-9]{18}', 'g');
      var msg = args.join(' ');
      var id;

      if(!idRegEx.test(msg))
        g.logging.wgbChannel = null;
      else
        g.logging.wgbChannel = msg.match(idReg)[0];

      return message.channel.createMessage(`<@${message.author.id}>, welcome/goodbye is now set to \`${g.logging.wgbChannel}\`.`);

    case 5:
      var p;

      if(!args[1])
        p = "youtube";

      if(args[1] == "youtube")
        p = "youtube";
      else if(args[1] == "soundcloud")
        p = "soundcloud";
      else
        p = "youtube";

      g.music.defaultSearch = p;

      return message.channel.createMessage(`<@${message.author.id}>, the default search platform is now \`${g.music.defaultSearch}\`.`);

    case 6:
      var o = parseInt(args[1]);

      if(!args[1])
        o = 1;

      if(o < 0 || o > 2) return message.channel.createMessage(`<@${message.author.id}>, that's not an available configuration for this setting.`);

      g.music.msgType = o;

      return message.channel.createMessage(`<@${message.author.id}>, song start message is now set to \`${g.msgType}\`.`);

    case 7:
      var hexReg = /^#?(?:[0-9a-f]{3}){1,2}$/i;
      var hexRegEx = new RegExp('^#?(?:[0-9a-f]{3}){1,2}$', 'gi');
      var msg = args.join(' ');
      var hex;

      if(!hexRegEx.test(msg))
        hex = "EE7600";
      else
        hex = msg.match(hexReg)[0];

      hex.startsWith("#") ? hex = hex.slice(1) : hex = hex;
      g.color = hex;

      return message.channel.createMessage(`<@${message.author.id}>, embed hex is now set to \`#${hex}\``);

    case 8:
      var msg = args.slice(1).join(' ');
      var prefix;

      if(!args[1])
        prefix = ":";

      if(msg.length > 4)
        return message.channel.createMessage(`<@${message.author.id}>, the prefix length is too long.`);
      else
        prefix = msg;

      g.prefix = prefix;

      return message.channel.createMessage(`<@${message.author.id}>, the prefix is now set to \`${g.prefix}\`.`);

    default:
      return message.channel.createMessage(`<@${message.author.id}>, the given index is not valid.`);
  }
};

exports.info = {
  usage: ":config [-r raw] ([config item] [value])",
  args: "[-r raw]: See the raw JSON data of the guild's config.\n[config item]: The number corresponding the presented item.\n[value]: The value to set the given configuration item to. If not given, sets the value to its default.\nIf nothing's given, an embed with available configurations is shown.",
  examples: ":config\n:config raw\n:config 6 0\n:config 8 xd:\n:config 5\n:config 1 true\n:config 5 youtube",
  description: "Allows you to configure some of the bot's features.",
  type: "mod"
};
