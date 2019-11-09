module.exports = (message) => {
  if(message.author.id === client.user.id)
    return;

  if(!message.channel.guild)
    return;

  if(message.author.bot)
    return;

  var prefix = k.conf.prefix;

  if(!message.content.startsWith(prefix) && !message.content.startsWith(`<@${client.user.id}> `) && !message.content.startsWith(guilds[message.channel.guild.id].prefix))
    return;

  var args = message.content.split(' ').slice(1);
  var p;

  if(message.content.startsWith(prefix))
    p = prefix;
  else if(message.content.startsWith(guilds[message.channel.guild.id].prefix))
    p = guilds[message.channel.guild.id].prefix;
  else {
    p = `<@${client.user.id}> `;
    args = message.content.split(' ').slice(2);
  }

  let cmd = message.content.slice(p.length).toLowerCase().split(' ')[0];

  try {
    require(`../cmds/${cmd}`).run(message, args);
  } catch (e) {
    if(e.message.includes('Cannot find module') || e.message.includes('ENOENT') || e.length > 2000)
      return;

    console.log(c.red(e.stack));
    message.channel.createMessage(`\`\`\`${e}\`\`\``);
  }
};
