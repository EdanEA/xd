exports.run = async (message, args) => {
  if(!k.conf.staff.includes(message.author.id) && k.conf.ownerID !== message.author.id)
    return;

  var idReg = new RegExp("[0-9]{18}", "g");
  var removed = false;
  var id;

  if(!idReg.test(args.join(' ')))
    return message.channel.createMessage(`<@${message.author.id}>, you need to provide an ID or mention.`);
  else
    id = args.join(' ').match(idReg)[0];

  for(var i = 0; i < k.conf.beta.length; i++) {
    if(k.conf.beta[i] == id) {
      k.conf.beta.splice(i, 1);
      removed = true;
    }
  }

  k.conf.push(id);

  if(removed)
    return message.channel.createMessage(`<@${message.author.id}>, I removed <@${id}> from the beta user list.`);
  else
    return message.channel.createMessage(`<@${message.author.id}>, I added <@${id}> to the beta user list.`);
};

exports.info = {
  usage: ":beta <user>",
  args: "<user>: A user's mention or ID.",
  examples: ":beta 34901237697819443\n:beta <@179079355018772480>",
  description: "Allows a staff member to add or remove a user to the beta user list.",
  type: "staff"
};
