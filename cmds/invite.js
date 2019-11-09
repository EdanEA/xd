exports.run = (message, args) => {
  return message.channel.createMessage({embed: {
    color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
    fields: [
      { name: "XD Invite", value: `[\`oauth2\` link](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=${k.bot.invitePermissions})` },
      { name: "Other Links", value: `[Discord Server link](https://discord.gg/WEpCRUV)\n[Cynthia](https://top.gg/bot/401201312420855819)\n[Oh no!](https://top.gg/bot/630522340870062081)` }
    ]
  }});
};

exports.info = {
  usage: ":invite",
  args: "None.",
  examples: ":invite",
  description: "Sends an embed containing invites for the bot, as well as others by the developer.",
  type: "misc."
};
