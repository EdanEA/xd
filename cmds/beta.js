var fs = require('fs');

exports.run = async (message, args) => {
  if(!k.conf.staff.includes(message.author.id) && k.conf.ownerID !== message.author.id)
    return;

  async function writeAsync(path, object) {
    await fs.writeFileSync(path, JSON.stringify(object, null, 2), 'utf8');
    console.log(`Successfully logged ${Object.keys(object).length} items in ${path}.`);
  }

  var idReg = new RegExp("[0-9]{18}", "g");
  var removed = false;
  var id;

  if(!idReg.test(args.join(' ')))
    return message.channel.createMessage(`<@${message.author.id}>, you need to provide an ID or mention.`);
  else
    id = args.join(' ').match(idReg)[0];

  if(k.conf.beta.includes(id)) {
    k.conf.beta.splice(k.conf.beta.indexOf(id), 1);
    removed = true;
  } else
    k.conf.beta.push(id);


  var tag = client.users.get(id) ? `\`${client.users.get(id).username}#${client.users.get(id).discriminator}\`` : id;

  await writeAsync('./storage/stuff.json', k);

  if(removed)
    return message.channel.createMessage(`<@${message.author.id}>, I removed ${tag} from the beta user list.`);
  else
    return message.channel.createMessage(`<@${message.author.id}>, I added ${tag} to the beta user list.`);
};

exports.info = {
  usage: ":beta <user>",
  args: "<user>: A user's mention or ID.",
  examples: ":beta 34901237697819443\n:beta <@179079355018772480>",
  description: "Allows a staff member to add or remove a user to the beta user list.",
  type: "staff"
};
