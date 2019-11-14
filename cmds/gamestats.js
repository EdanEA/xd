exports.run = async (message, args) => {
  async function generateEmbed(id=null, name=null) {
    var user;
    if(id == null)
      user = client.users.get(message.channel.guild.members.find(m => m.username.search(name.toLowerCase()) !== -1).id);
    else
      user = client.users.get(id);

    if(user.bot)
      return message.channel.createMessage(`Boo, no!`);

    if(!user)
      return false;

    sql.get(`SELECT * FROM users WHERE id='${user.id}'`).then(r => {
      var e;

      if(typeof r == "undefined" || !r) {
        sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

        e = {
          footer: { icon_url: user.avatarURL, text: `${user.username}#${user.discriminator}'s Stats` },
          color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
          fields: [
            { name: "Russian Roulette Wins", value: "0", inline: true },
            { name: "Russian Roulette Losses", value: "0", inline: true },
            { name: "Russian Roulette Plays", value: "0", inline: false },
            { name: "Blackjack Wins", value: "0", inline: true },
            { name: "Blackjack Losses", value: "0", inline: true },
            { name: "Blackjack Plays", value: "0", inline: false },
            { name: "Coin Flip Wins", value: "0", inline: true },
            { name: "Coin Flip Losses", value: "0", inline: true },
            { name: "Coin Flip Total", value: "0", inline: false },
            { name: "Rock-Paper-Scissors Wins", value: "0", inline: true },
            { name: "Rock-Paper-Scissors Losses", value: "0", inline: true },
            { name: "Rock-Paper-Scissors Total", value: "0", inline: false },
            { name: "Total Dice Rolls", value: "0", inline: false }
          ],
          thumbnail: { url: user.avatarURL }
        };
      }

      e = {
        footer: { icon_url: user.avatarURL, text: `${user.username}#${user.discriminator}'s Stats` },
        color: parseInt(`0x${guilds[message.channel.guild.id].color}`),
        fields: [
          { name: "Russian Roulette Wins", value: r.rrWins, inline: true },
          { name: "Russian Roulette Losses", value: r.rrLosses, inline: true },
          { name: "Russian Roulette Plays", value: r.rrTotal, inline: false },
          { name: "Blackjack Wins", value: r.bjWins, inline: true },
          { name: "Blackjack Losses", value: r.bjLosses, inline: true },
          { name: "Blackjack Plays", value: r.bjTotal, inline: false },
          { name: "Coin Flip Wins", value: r.coinWins, inline: true },
          { name: "Coin Flip Losses", value: r.coinLosses, inline: true },
          { name: "Coin Flip Total", value: r.coinTotal, inline: false },
          { name: "Rock-Paper-Scissors Wins", value: r.rpsWins, inline: true },
          { name: "Rock-Paper-Scissors Losses", value: r.rpsLosses, inline: true },
          { name: "Rock-Paper-Scissors Total", value: r.rpsTotal, inline: false },
          { name: "Total Dice Rolls", value: r.rollsTotal, inline: false }
        ],
        thumbnail: { url: user.avatarURL }
      };

      return message.channel.createMessage({embed: e});
    });

    return;
  }

  var idReg = new RegExp("[0-9]{18}", "g");
  var tReg = new RegExp("-t (rr|rps|flip|rolls|bj|blackjack)", "gi");

  if(args.length == 0) {
    await generateEmbed(message.author.id);
  } else if(idReg.test(args.join(' '))) {
    await generateEmbed(args.join(' ').match(idReg)[0]);
  } else if(tReg.test(args.join(' '))) {
    var a = args.join(' ');

    if(a.includes("rr")) {
      sql.all("SELECT id, rrWins, rrLosses, rrTotal FROM users ORDER BY rrTotal DESC LIMIT 10").then(rows => {
        var content = "";
        var user = "";

        for(var i = 0; i < rows.length; i++) {
          var r = rows[i];

          if(!client.users.get(r.id))
            user = "Unknown User:";
          else
            user = `${client.users.get(r.id).username}#${client.users.get(r.id).discriminator}:`;

          content += `[${i + 1}] ${user}\n\tTotal Plays: ${r.rrTotal}\n\tWins: ${r.rrWins}\n\tLosses: ${r.rrLosses}\n\n`;
        }

        return message.channel.createMessage(`\`\`\`css\nTop Russian Roulette Stats\n============================\n\n${content}\`\`\``);
      });
    } else if(a.includes("blackjack") || a.includes("bj")) {
      sql.all("SELECT id, bjWins, bjLosses, bjTotal FROM users ORDER BY bjTotal DESC LIMIT 10").then(rows => {
        var content = "";
        var user = "";

        for(var i = 0; i < rows.length; i++) {
          var r = rows[i];

          if(!client.users.get(r.id))
            user = "Unknown User:";
          else
            user = `${client.users.get(r.id).username}#${client.users.get(r.id).discriminator}:`;

          content += `[${i + 1}] ${user}\n\tTotal Plays: ${r.bjTotal}\n\tWins: ${r.bjWins}\n\tLosses: ${r.bjLosses}\n\n`;
        }

        return message.channel.createMessage(`\`\`\`css\nTop Blackjack Stats\n=====================\n\n${content}\`\`\``);
      });
    } else if(a.includes("rps")) {
      sql.all("SELECT id, rpsWins, rpsLosses, rpsTotal FROM users ORDER BY rpsTotal DESC LIMIT 10").then(rows => {
        var content = "";
        var user = "";

        for(var i = 0; i < rows.length; i++) {
          var r = rows[i];

          if(!client.users.get(r.id))
            user = "Unknown User:";
          else
            user = `${client.users.get(r.id).username}#${client.users.get(r.id).discriminator}:`;

          content += `[${i + 1}] ${user}\n\tTotal Plays: ${r.rpsTotal}\n\tWins: ${r.rpsWins}\n\tLosses: ${r.rpsLosses}\n\n`;
        }

        return message.channel.createMessage(`\`\`\`css\nTop Rock-Paper-Scissors Stats\n===============================\n\n${content}\`\`\``);
      });
    } else if(a.includes("flip")) {
      sql.all("SELECT id, coinWins, coinLosses, coinTotal FROM users ORDER BY coinTotal DESC LIMIT 10").then(rows => {
        var content = "";
        var user = "";

        for(var i = 0; i < rows.length; i++) {
          var r = rows[i];

          if(!client.users.get(r.id))
            user = "Unknown User:";
          else
            user = `${client.users.get(r.id).username}#${client.users.get(r.id).discriminator}:`;

          content += `[${i + 1}] ${user}\n\tTotal Plays: ${r.coinTotal}\n\tWins: ${r.coinWins}\n\tLosses: ${r.coinLosses}\n\n`;
        }

        return message.channel.createMessage(`\`\`\`css\nTop Coin Flip Stats\n======================\n\n${content}\`\`\``);
      });
    } else if(a.includes("rolls")) {
      sql.all("SELECT id, rollsTotal FROM users ORDER BY rollsTotal DESC LIMIT 10").then(rows => {
        var content = "";
        var user = "";

        for(var i = 0; i < rows.length; i++) {
          var r = rows[i];

          if(!client.users.get(r.id))
            user = "Unknown User:";
          else
            user = `${client.users.get(r.id).username}#${client.users.get(r.id).discriminator}:`;

          content += `[${i + 1}] ${user}\n\tTotal Rolls: ${r.coinTotal}\n\n`;
        }

        return message.channel.createMessage(`\`\`\`css\nTop Dice Roll Stats\n======================\n\n${content}\`\`\``);
      });
    } else {
      return message.channel.createMessage(`You broke it. D\`:`);
    }
  } else if(!idReg.test(args.join(' ')) && args.length > 0 && !tReg.test(args.join(' '))) {
    await generateEmbed(null, args.join(' '));
  } else
    return message.channel.createMessage(`You broke it. DD:`);
};

exports.info = {
  usage: ":gameStats [user] ([-t top] & <category>)",
  args: "[user]: A user's ID, mention, or name. If nothing is provided, shows your own stats.\n[-t top]: To be used if you want to see the top stats for a certain category.\n<category>: Only meant to be used if `-t` is present; the category of the stats--either `rr`, `flip`, `rps`, or `rolls`",
  examples: ":gameStats <@265656920432443396>\n:gameStats Dawn\n:gameStates\n:gameStats -t rps\n:gameStats -t rr",
  description: "Shows information about the used commands in the fun category.",
  type: "fun"
};
