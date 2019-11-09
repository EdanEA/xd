exports.run = function (message, args) {
  var g = guilds[message.channel.guild.id];

  if(!args[0] || args[0] == "single") {
    if(guild.music.singleRepeat == true) {
      guild.music.singleRepeat = false;

      return message.channel.createMessage(`The guild's single item repeat is now disabled.`);
    } else {
      if(guild.music.queueRepeat == true)
        guild.music.queueRepeat = false;

      guild.music.singleRepeat = true;
      return message.channel.createMessage(`The guild's single item repeat is now enabled.`);
    }
  } else if(args[0] == "queue" || args[0] == "loop") {
    if(guild.music.queueRepeat == true) {
      guild.music.queueRepeat = false;

      return message.channel.createMessage(`The guild's queue loop is now disabled.`);
    } else {
      if(guild.music.singleRepeat == true)
        guild.music.singleRepeat = false;

      guild.queueRepeat = true;
      return message.channel.createMessage(`The guild's queue loop is now enabled.`);
    }
  } else
    return message.channel.createMessage(`<@${message.author.id}>, an invalid arugment was given.`);
};

exports.info = {
  usage: ":repeat [type]",
  args: "[type]: Either nothing, `single`, `guild` or `loop`.",
  examples: ":repeat single\n:repeat\n:repeat guild",
  description: "If no arguments or \"single\" are left, and single repeat is not currently enabled, single repeat will be enabled. If it is enabled, it will be disabled. If the argument given is \"queue\" or \"loop\", then the queue as it currently stands is stored and continually played. The same occurs if \"queue\" or \"loop\" is left, whereas if it's currently enabled it will be disabled when the command is run.",
  type: "music"
};
