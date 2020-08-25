module.exports = (message) => {
  if(message.author.id === client.user.id)
    return;

  if(!guilds[message.channel.guild.id]) {
    guilds[message.channel.guild.id] = k.conf.defaultConfig;
    guilds[message.channel.guild.id].id = message.channel.guild.id;
    guilds[message.channel.guild.id].prefix = k.conf.basePrefix;
  }

  if(!queue[message.channel.guild.id])
    queue[message.channel.guild.id] = [];

  if(!message.channel.guild || message.author.bot)
    return;

  var prefix = k.conf.basePrefix;

  if(!message.content.startsWith(prefix) && !message.content.startsWith(`<@!${client.user.id}> `) && !message.content.startsWith(`<@${client.user.id}> `) && !message.content.startsWith(guilds[message.channel.guild.id].prefix))
    return;

  var args = message.content.split(' ').slice(1);
  var p;

  if(message.content.startsWith(prefix))
    p = prefix;
  else if(message.content.startsWith(guilds[message.channel.guild.id].prefix))
    p = guilds[message.channel.guild.id].prefix;
  else if(message.content.startsWith(`<@!${client.user.id}> `)){
    p = `<@!${client.user.id}> `;
    args = message.content.split(' ').slice(2);
  } else {
    p = `<@${client.user.id}> `;
    args = message.content.split(' ').slice(2);
  }

  let cmd = message.content.slice(p.length).toLowerCase().split(' ')[0];

  try {
    require(`../cmds/${cmd}`).run(message, args);
  } catch (e) {
    if(!(e.message.includes('Cannot find module') || e.message.includes('ENOENT') || e.length > 2000)) {
      console.log(c.red(e.stack));

      if(message.author.id == k.conf.ownerID)
        return message.channel.createMessage(`\`\`\`${e}\`\`\``);
      else
        return message.channel.createMessage(`An error occurred.`);
    }
  }
};
