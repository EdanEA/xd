exports.run = async (message, args) => {
  function makeEmbed(id=null, name=null) {
    var mod = false;
    var admin = false;
    var roles = "";

    var user;
    !id ? user = client.users.get(message.channel.guild.members.find(m => m.username.search(name.toLowerCase()) !== -1).id) : user = client.users.get(id);

    if(!user)
      return false;

    var creation = moment(user.createdAt).format("MMM Do YYYY, h:mm:ss a");
    var join = moment(message.channel.guild.members.get(user.id).joinedAt).format("MMM Do YYYY, h:mm:ss a");

    if(message.channel.permissionsOf(user.id).has("kickMembers") && !message.channel.permissionsOf(user.id).has("banMembers"))
      mod = true;
    else if(message.channel.permissionsOf(user.id).has("banMembers") && !message.channel.permissionsOf(user.id).has("kickMembers"))
      admin = true;
    else if(message.channel.permissionsOf(user.id).has("administrator" || message.channel.guild.ownerID == user.id) || message.channel.guild.ownerID == user.id)
      admin = true;

    if(!message.channel.guild.members.get(user.id).roles[0])
      roles += "`@everyone`"

    for(var i = 0; i < message.channel.guild.members.get(user.id).roles.length; i++) {
      var role = `\`${message.channel.guild.roles.get(message.channel.guild.members.get(user.id).roles[i]).name}\``;
      roles += role + "\n";
    }

    if(roles.length > 1024)
      roles = "There's too many roles, please get rid of some -- too many and you're just making an ass of yourself.";

    var embed = {
      author: { name: `${user.username}#${user.discriminator} (${user.id})`, icon_url: user.avatarURL },
      fields: [
        {
          name: "Account Creation Date",
          value: creation,
          inline: true
        },
        {
          name: "Join Date",
          value: join,
          inline: true
        },
        {
          name: "Staff Status",
          value: `• Moderator: ${mod}\n• Administrator: ${admin}`,
          inline: true
        },
        {
          name: "Roles",
          value: roles,
          inline: true
        }
      ],
      thumbnail: { url: client.users.get(user.id).avatarURL },
      color: parseInt(`0x${guilds[message.channel.guild.id].color}`)
    };

    return embed;
  }

  var idReg = new RegExp("[0-9]{18}", "g");
  var id;

  if(idReg.test(args.join(' ')))
    id = args.join(' ').match(idReg)[0];

  if(id) {
    var e = makeEmbed(id);

    if(e == false)
      return message.channel.createMessage(`Whoopsies! I can't find that boi-o, boi-o.`);

    return message.channel.createMessage({embed: e});
  }

  else if(!args[0]) {
    var e = makeEmbed(message.author.id);

    if(e == false)
      return message.channel.createMessage(`Whoopsies! I can't find that boi-o, boi-o.`);

    return message.channel.createMessage({embed: e});
  }

  else if(!id && args[0]) {
    var name = args.join(' ');
    var e = makeEmbed(null, name);

    if(e == false)
      return message.channel.createMessage(`Whoopsies! I can't find that boi-o, boi-o.`);

    return message.channel.createMessage({embed: e});
  }

  else
    return message.channel.createMessage(`Your provided arguments caused an error.`);
};

exports.info = {
  usage: ":user [user]",
  args: "[user]: Either an ID, username, or mention. If a username, it will search in the guild, but an ID will get any user if able. If nothing is provided, it will show the message author's information.",
  description: "Gets info on a user.",
  examples: ":user\n:user Edan\n:user 349012376978194434",
  type: "misc."
};
