var f = require('../util/misc.js');
exports.run = async function(message, args) {
  async function getUserRoles(guild) {
    if(!guild) return null;

    var users = [];
    guild.members.forEach(m => {
      if(!m.roles[0])
        null;
      else {
        var roles = [];

        for(var r of m.roles) {
          roles.push(r);
        }

        users.push({id: m.id, roles: roles});
      }
    });

    rolesave[guild.id] = users;
    guilds[guild.id].mod.roleSaveActive = true;

    return true;
  }

  if(!args[0])
    return message.channel.createMessage(`I need arguments!`);

  if(!f.hasAdmin(message.member, message.channel.guild))
    return message.channel.createMessage(`<@${message.author.id}>, oh no, the baby boi can't use the big boi command! Get outta here, y'loser. smh`);

  switch(args[0].toLowerCase()) {
    case "help":
      return message.channel.createMessage({embed: {
        color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
        fields: [
          { name: "`start` argument", value: "```:rolesave start```Doing this command will ask you to confirm you want to enable this, and if you confirm will store the data of all user's roles in the guild. Do mind this is static, meaning it will not change unless done manually." },
          { name: "`stop` argument", value: "```:rolesave stop```This, as well, will prompt for input to confirm you want to stop. If you do confirm, it will stop storing the data and no longer save the roles." },
          { name: "`update` argument", value: "```:rolesave update```If you have rolesave active, and you want to update the storage, you can just use this and it will do so." }
        ],
        title: "RoleSave Info",
        description: "The `rolesave` command is used to save the roles which users have in this guild--by default this is not enabled. Below is help on using it. By the way, I need to be higher than the roles I'll be storing if you want them to be added back when a member joins back.\nDisclaimer: By enabling the `rolesave` command, you hereby grant the bot to store data for your guild; if disabled it will no longer hold this data.",
      }});

    case "start":
      if(guilds[message.channel.guild.id].mod.roleSaveActive == true)
        return message.channel.createMessage(`<@${message.author.id}>, rolesave is already enabled.`);

      await message.channel.createMessage(`<@${message.author.id}>, are you sure you want to enable this? Type \`yes\` to confirm, \`no\` to decline.`);

      var check = await message.channel.awaitMessages(m => m.author.id == message.author.id && m.content.toLowerCase() == "yes" || m.content.toLowerCase() == 'no', { maxMatches: 1, time: 10000 });
      if(!check)
        return message.channel.createMessage(`<@${message.author.id}>, nothing or an invalid input was given.`);

      await getUserRoles(message.channel.guild);
      return message.channel.createMessage(`<@${message.author.id}>, successfully saved the current roles of the server; they will now add them back to a user if they leave and join back.`);

    case "stop":
      if(guilds[message.channel.guild.id].mod.roleSaveActive !== true)
        return message.channel.createMessage(`<@${message.author.id}>, you can't use this unless rolesave is already enabled.`);

      await message.channel.createMessage(`<@${message.author.id}>, are you sure you want to disable this? Type \`yes\` to confirm, \`no\` to decline.`);
      var check = await message.channel.awaitMessages(m => m.author.id == message.author.id && m.content.toLowerCase() == "yes" || m.content.toLowerCase() == 'no', { maxMatches: 1, time: 10000 });

      if(!check)
        return message.channel.createMessage(`<@${message.author.id}>, nothing or an invalid input was given.`);

      guilds[message.channel.guild.id].mod.roleSaveActive = false;
      rolesave[message.channel.guild.id] = [];

      return message.channel.createMessage(`<@${message.author.id}>, I've now stopped storing the roles of this server.`);

    case "update":
      if(guilds[message.channel.guild.id].mod.roleSaveActive !== true)
        return message.channel.createMessage(`<@${message.author.id}>, you can't use this unless rolesave is already enabled.`);

      await getUserRoles(message.channel.guild);

      return message.channel.createMessage(`<@${message.author.id}>, I've updated the roles.`);

    default:
      return message.channel.createMessage({embed: {
        color: 0xff0000,
        fields: [
          { name: "`start` argument", value: "```)rolesave start```Doing this command will ask you to confirm you want to enable this, and if you confirm will store the data of all user's roles in the guild. Do mind this is static, meaning it will not change unless done manually." },
          { name: "`stop` argument", value: "```)rolesave stop```This, as well, will prompt for input to confirm you want to stop. If you do confirm, it will stop storing the data and no longer save the roles." },
          { name: "`update` argument", value: "```)rolesave update```If you have rolesave active, and you want to update the storage, you can just use this and it will do so." }
        ],
        title: "RoleSave Info",
        description: "The `rolesave` command is used to save the roles which users have in this guild--by default this is not enabled. Below is help on using it. By the way, I need to be higher than the roles I'll be storing if you want them to be added back when a member joins back.\nDisclaimer: By enabling the `rolesave` command, you hereby grant the bot to store data for your guild; if disabled it will no longer hold this data.",
      }});
  }
};

exports.info = {
  usage: ":rolesave [option]",
  args: "[option]: `start` to start saving roles; `stop` to disable saving roles; `update` to update the saved roles.\nLeave nothing to get very specific information on the command.",
  examples: ":rolesave start\n:rolesave\n:rolesave update",
  description: "Hey, have you ever seen one of those bots that have a command that saves all the roles users have in the guild? If so, you know that they're often very confusing, and badly designed--we're trying to do that, but make it not shit. Most likely will not occur.",
  type: "mod"
};
