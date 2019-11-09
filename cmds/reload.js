exports.run = async function(message, args) {
  if(!k.conf.staff.includes(message.author.id) && k.conf.ownerID !== message.author.id)
    return;

  if(!args[0])
    return message.channel.createMessage(`<@${message.author.id}>, I cannot find that file.`);

  var cmd = args.join(' ');
  var del = await delete require.cache[require.resolve(`./${cmd}`)];

  try {
    let cmdFile = require(`./${cmd}`);
  } catch (e) {
    message.channel.createMessage(`<@${message.author.id}>, there was an error reloading that file.`);
    throw e;
  }

  return message.channel.createMessage(`<@${message.author.id}>, successfully reloaded \`${cmd}\`.`);
};

exports.info = {
  usage: ":reload <file path>",
  args: "<file path>: The path to a file.",
  examples: ":reload queue.js\n:reload ../events/ready.js",
  description: "Reloads a file's cache, letting you add changes to a file without restarting the server.",
  type: "staff"
};
