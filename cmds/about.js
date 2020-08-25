exports.run = (message, args) => {
  return message.channel.createMessage({embed: {
    fields: [
      {
        name: "What is this?",
        value: "This is XD bot--formerly Russian Roulette. It was made by some boy named Edan, as to combine [Russian Roulette](https://github.com/edanea/russian-roulette) and his other bot, [Cynthia](https://github.com/edanea/cynthia). It's pretty much like every other bot, but, y'know, XD."
      },
      {
        name: "What does it do?",
        value: "It has some commands for moderation and administration; music commands with support for YouTube and Soundcloud; and games--expect more soon."
      },
      {
        name: "Ways to help",
        value: "You can help with the bot's development by contributing to the [GitHub](https://github.com/edanea/xd). If there's any bugs you notice, you can report them on the [GitHub page](https://github.com/edanea/xd) or tell them to someone in the [server](https://discord.gg/WEpCRUV)."
      },
      {
        name: "Website, website, website?!",
        value: "[Website](https://edanea.github.io/xd)."
      }
    ],
    color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
    timestamp: new Date().toISOString()
  }});
};

exports.info = {
  usage: ":about",
  examples: ":about",
  args: "None.",
  type: "misc."
};
