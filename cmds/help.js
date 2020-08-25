exports.run = async (message, args) => {
  async function getHelp(id, type=0, commandName=null) {
    var prefix = guilds[message.channel.guild.id].prefix == ":" ? ":" : guilds[message.channel.guild.id].prefix;
    var fields = [];
    var e = {
      color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
      footer: { text: `Use "${prefix}help [command name]" for in-depth information of a command.` }
    };

    if(!type) {
      for(var [key, values] of Object.entries(commands)) {
        var field = {name: `**${key.charAt(0).toUpperCase() + key.slice(1, key.length)}**`, value: ""};

        if(key == "misc") {
          field.name = "**Misc.**";
        }

        if(values.length == 0)
          continue;

        for await (var v of values) {
          field.value += `\`${v}\` `;
        }

        fields.push(field);
      }

      e.fields = fields;
    } else {
      var info;

      try {
        info = require(`../cmds/${commandName}`).info;
      } catch(e) {
        return {};
      }

      var p = k.conf.basePrefix;
      var gp = guilds[message.channel.guild.id].prefix;

      if(p !== gp) {
        info.usage = info.usage.replace(p, gp);

        var c;

        try {
          c = info.examples.match(/[^\n]*\n[^\n]*/gi).length + 1
        } catch(e) {
          c = 0;
        }

        for(var i = 0; i <= c; i++)
          info.examples = info.examples.replace(p, gp);
      }

      e = {
        title: `\`${info.usage}\` info`,
        description: info.description,
        fields: [{name: "Arguments", value: info.args}, {name: "Examples", value: info.examples}],
        color: parseInt(`0x${guilds[message.channel.guild.id].color}`)
      };
    }

    if(!k.conf.staff.includes(id) && k.conf.ownerID !== id)
      for(var i = 0; i < fields.length; i++) {
        if(fields[i].name.includes("Staff"))
          fields.splice(i, 1);
      }

    if(k.conf.ownerID !== id)
      for(var i = 0; i < fields.length; i++) {
        if(fields[i].name.includes("Owner"))
          fields.splice(i, 1);
      }

    if(!k.conf.beta.includes(id) && k.conf.ownerID !== id && !k.conf.staff.includes(id))
      for(var i = 0; i < fields.length; i++) {
        if(fields[i].name.includes("Beta"))
          fields.splice(i, 1);
      }

    return e;
  }

  if(!args[0])
    await getHelp(message.author.id).then(e => {
      message.channel.createMessage({embed: e});
    });
  else
    await getHelp(message.author.id, 1, args[0]).then(e => {
      message.channel.createMessage({embed: e});
    });
};

exports.info = {
  usage: ":help [command]",
  args: "[command]: A command's name.",
  description: "The `help` command gives a list of the available commands on the bot. If given the name of a certain command, it will instead give you detailed information on that specific command.\n\nArguments in square brackets `[]` are optional; arguments in angled brackets `<>` are required; multiple arguments in parentheses mean that both are required if one is used.",
  examples: ":help\n:help queue\n:help help",
  type: "help"
};
