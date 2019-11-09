exports.run = function(message, args) {
  var l = new RegExp(",\ ?", "g");
  var list = args.join(' ').split(l);

  return message.channel.createMessage(`I pick this one: \`${list[Math.floor(Math.random() * list.length)]}\`.`);
};

exports.info = {
  usage: ":pick <list>",
  args: "[pick]: A list of thinks to pick from. Seperated by commas.",
  examples: ":pick xd, dx\n:pick csgo, minecraft, gta 5",
  description: "Are you too much of an indecisive bitch to pick for yourself? Well, there's a command for that now, I guess.",
  type: "misc."
};
