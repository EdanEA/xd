exports.run = async (message, args) => {
  var bundleReg = new RegExp("(all)", "gi");
  var eventReg = new RegExp("(ban|unban|memberjoin|memberleave|memberupdate|guildupdate|messagedelete|messageupdate)", "gi");
  var idReg = new RegExp("[0-9]{18}", "g");
  var eReg = new RegExp("(enable|true|disable|false)");

  var a = args.join(" ");
  var s = guilds[message.channel.guild.id];

  if(!bundleReg.test(a) && !eventReg.test(a) && !idReg.test(a) && !eReg.test(a)) {
    return message.channel.createMessage({embed: {
      title: "Logging Info",
      color: parseInt(`0x${s.color}`),
      description: `The logging functionality of XD Bot allows the bot to send embed messages to a certain channel, which holds information about something that has occurred in the guild, such as an edited message, or banned member.\n\nLogging is currently \`${s.logging.logEnabled ? "enabled" : "disabled"}\`.\nLog Channel: ${s.logging.logChannel == null ? "null" : `<#${s.logging.logChannel}>`}`,
      fields: [
        {
          name: "Events",
          value: "`ban` `unban` `memberjoin` `memberleave` `memberupdate` `guildupdate` `messagedelete` `messageupdate`"
        }
      ]
    }});
  }

  var o = "";

  if(eReg.test(a)) {
    if(a.match(eReg)[0] == "enable" || a.match(eReg)[0] == "true")
      s.logging.logEnabled = true;
    else
      s.logging.logEnabled = false;

    o += `Logging is now ${s.logging.logEnabed ? "enabled" : "disabled"}.`;
  }

  if(idReg.test(a)) {
    var id = a.match(idReg)[0];
    if(message.channel.guild.channels.get(id))
      s.logging.logChannel = id;

    if(o.length > 0)
      o += "\n"

    o += `The logging channel is now <#${s.logging.logChannel}>.`;
  }

  if(typeof s.logging.events == "undefined")
    s.logging.events = [];

  if(eventReg.test(a)) {
    var events = a.match(eventReg);
    var eString = "";

    for(var e of events) {
      if(eString.includes(e) || s.logging.events.includes(e))
        continue;
      else {
        eString += `\`${e}\` `;
        s.logging.events.push(e);
      }
    }

    if(o.length > 0)
      o += "\n";

    o += `Events enabled: ${e.slice(1)}.`;
  } else if(bundleReg.test(a)) {
    s.logging.events = [];

    if(o.length > 0)
      o += "\n";

    o += `All events were enabled.`;
  }
};

exports.info = {
  usage: ":logging [active] [channel] [events]",
  args: "If nothing is left, a list of bundles and events is left; `enable` or `disable`, as to enable or disable logging; the ID of a new logging channel; the name of an event or `all` to enable all events.",
  description: "A command specifically for configuring logging in the given guild.",
  examples: ":logging\n:logging enable\n:logging enable 000000000000000000\n:logging all\n:logging mod\n:logging messageupdate\n:logging ban unban\n:logging enable 00000000000000 ban unban",
  type: "beta"
};
