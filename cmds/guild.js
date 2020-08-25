exports.run = async (message, args) => {
  function makeEmbed(id, type=null) {
    var e, roles = "", staffCount = 0, onlineMembers = 0, botCount = 0, memberCount = 0, i = 0;

    client.guilds.get(id).roles.forEach(r => {
      if((i + 2) == client.guilds.get(id).roles.size)roles += `\`${r.name}\` `;
      else if((i + 1) !== client.guilds.get(id).roles.size) roles += `\`${r.name}\`, `;
      else roles += `and \`${r.name}\``;
      i++;
    });

    client.guilds.get(id).members.forEach(m => {
      if(!m.bot) {
        if(m.guild.defaultChannel.permissionsOf(m.id).has('administrator') || m.guild.defaultChannel.permissionsOf(m.id).has('manageMessages') || m.id == m.guild.ownerID)
          staffCount++;

        if(m.status !== 'offline')
          onlineMembers++;
      }

      else
        botCount++;
    });

    var owner = client.guilds.get(id).ownerID;
    var create = moment(client.guilds.get(id).createdAt).format("MMM Do YYYY hh:mm:ss a");

    memberCount = client.guilds.get(id).memberCount - botCount;

    if(roles.length > 1024 && type !== "staff")
      roles = "There's too many roles in the server to list.";
    else if(roles.length > 1024 && type == "staff")
      roles = "There's too many roles in that server to list.";

    e = {
      author: { name: `${client.guilds.get(id).name} (${id})`, icon_url: client.guilds.get(id).iconURL },
      fields: [
        { name: "Creation Date", value: `\`${create}\``, inline: true },
        { name: "Guild Region", value: `\`${client.guilds.get(id).region}\``, inline: true },
        { name: "Owner Info", value: `Tag: \`${client.users.get(owner).username}#${client.users.get(owner).discriminator}\`\nID: \`${owner}\``, inline: true },
        { name: "Member Info", value: `Members: \`${memberCount.toString()} (${onlineMembers} online)\`\nBot Count: \`${botCount}\`\nStaff Count: \`${staffCount}\``, inline: true },
        { name: "Roles", value: roles }
      ],
      color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
      thumbnail: { url: client.guilds.get(id).iconURL }
    };

    return e;
  }

  var idReg = new RegExp("[0-9]{18}", "g");

  if(!idReg.test(args.join(' '))) {
    var e = makeEmbed(message.channel.guild.id);

    if(!e)
      return message.channel.createMessage(`<@${message.author.id}>, you broke it. ):`);

    return message.channel.createMessage({embed: e});
  } else {
    if(!k.conf.staff.includes(message.author.id) && message.author.id !== k.conf.ownerID)
      return;

    var e = makeEmbed(args.join(' ').match(idReg)[0], "staff");

    if(!e)
      return message.channel.createMessage(`<@${message.author.id}>, you broke it. ):`);

    return message.channel.createMessage({embed: e});
  }
};

exports.info = {
  usage: ":guild [id]",
  args: "[id]: The ID of a guild--only works if you have staff on the bot",
  description: "Gives information on a guild.",
  examples: ":guild",
  type: "misc."
};
