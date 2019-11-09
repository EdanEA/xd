exports.run = async (message, args) => {
  if(message.author.id !== k.conf.ownerID)
    return;

  async function writeAsync(path, object) {
    await fs.writeFileSync(path, JSON.stringify(object, null, 2), 'utf8');
    console.log(`Successfully logged ${Object.keys(object).length} items in ${path}.`);
  }

  var idReg = new RegExp("[0-9]{18}", "g");
  var lReg = new RegExp("-l", "gi");
  var removed = false;
  var id;

  if(lReg.test(args.join(' ')) || args.length == 0) {
    var list = "";
    for(var i in k.conf.staff) {
      var user = client.users.get(i);
      var u = user ? `${user.username}#${user.discriminator}` : i;

      list += user + "\n";
    }

    return message.channel.createMessage(`\`\`\`${list}\`\`\``);
  }

  if(!idReg.test(args.join(' ')))
    return message.channel.createMesage(`No user was given.`);

  id = args.join(' ').match(idReg)[0];

  for(var i = 0; i < k.conf.staff.length; i++) {
    if(k.conf.staff[i] == id) {
      k.conf.staff.splice(i, 1);
      removed = true;
    }
  }

  var user = client.users.get(id) ? client.users.get(id) : id;

  if(!removed) {
    k.conf.staff.push(id);
    message.channel.createMessage(`Successfully added \`${user.username}#${user.disciminator}\` to the staff list.`);
  } else
    message.channel.createMessage(`Removed ${user} from the staff list.`);

  await writeAsync('../storage/stuff.json', k);

  return;
};

exports.info = {
  usage: ":staff [user] [list]",
  args: "[user]: A user's ID or mention.\n[-l list]: A list of staff.",
  examples: "None.",
  description: "Allows to owner to add or remove someone from the staff list. Also, allows the owner to list staff members.",
  type: "owner"
};
