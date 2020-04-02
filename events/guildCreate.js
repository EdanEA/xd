module.exports = async (guild) => {
  var botCount = function() { var bots = 0; guild.members.forEach(m => {if(m.bot) bots += 1;}); return bots;};

  await client.createMessage(k.conf.logChannel, {embed:{
    color: 0x32CD32,
    title: `Joined a Guild`,
    description: `Name: \`${guild.name}\`\nID: \`${guild.id}\`\nMember Count: \`${guild.memberCount}\`\nBot Count: \`${botCount()}\``,
    timestamp: new Date().toISOString(),
    footer: {text: `${client.guilds.size} Servers`}
  }});

  guild.defaultChannel.createMessage(`\`\`\`Markdown\n#Hello\nI am XD Bot.\n\n# What I do\nI am a bot for basic features, such as music streaming and playing games.\n\n# How to use meYou can see my commands by using :help or @XD Bot help.\nTo use any other commands, say for an example, blackjack, you would use it like so: :blackjack\nYou can also use it like this: @XD Bot blackjack\n\nIf for some reason you don't remember the prefix for the bot, you can just mention me, followed by the command instead of using a set prefix.\n\`\`\``);
};
