exports.run = (message, args) => {
  return message.channel.createMessage({embed: {
    fields: [
      {
        name: "What is this?",
        value: "This is XD bot--formerly Russian Roulette. It was made by some boy named Edan, as to combine Russian Roulette, and his other bot, [Cynthia](https://github.com/edanea/cynthia). It's pretty much like every other bot, but, y'know, XD."
      },
      {
        name: "What does it do?",
        value: "It has some commands for moderation and administration; music commands with support for YouTube and Soundcloud; and games--expect more soon."
      },
      {
        name: "Ways to help",
        value: "You can help with the bot's development by contributing to the [GitHub](https://github.com/edanea/xd). If there's any bugs you notice, you can report them with the `report` command."
      }
    ],
    color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
    timestamp: new Date().toISOString()
  }});
};

exports.info = {
  usage: ":usage",
  examples: ":usage",
  args: "None.",
  type: "misc."
};
