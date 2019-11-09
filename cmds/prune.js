var f = require('../util/misc.js');
exports.run = async (message, args) => {
  if(!args[0])
    return message.channel.createMessage(`<@${message.author.id}>, `);

  var u = message.mentions;
  var a;

  message.delete().then(async () => {
    if(!u[0]) {
      a = parseInt(args.join(' '));

      var messages = await message.channel.getMessages(a);
      var ids = [];

      messages.forEach(m => { ids.push(m.id); });

      var del = await message.channel.deleteMessages(ids);
      await message.channel.createMessage(`Successfully deleted ${ids.length} messages in \`#${message.channel.name}\`.`).then(m => {
        setTimeout(() => {
          m.delete()
        }, 15000);
      });
    } else {
      var reg = /<@[0-9]{18}>/;
      var msg = args.join(' ').replace(reg, "");
      a = parseInt(msg);

      var messages = await message.channel.getMessages(100);
      messages = messages.filter(m => m.author.id == u[0].id);

      var ids = [];
      messages.forEach(m => {
        ids.push(m.id);
      });

      await message.channel.deleteMessages(ids);
      message.channel.createMessage(`Successfully deleted ${ids.length} messages from ${u[0].username}#${u[0].discriminator}, in \`#${message.channel.name}\``).then(m => { setTimeout(() => { m.delete() }, 10000) });
    }
  });
};

exports.info = {
  usage: ":prune <amount of messages> [mention]",
  args: "<amount of messages>: The number of messages to be deleted.\n[mention]: An @ mention of a member, as for only messages from them to be deleted.",
  examples: ":prune 20\n:prune 50 <@305602159741763585>\n:prune 100",
  description: "Used to delete messages from the current channel.",
  type: "mod"
};
