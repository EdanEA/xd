var f = require('../util/misc.js');

exports.run = async (message, args) => {
  var delays = [ 6E4, 3E4, 3E5, 12E4 ];
  var delay = delays[Math.floor(Math.random() * delays.length)];
  var sReg = new RegExp('-s', 'gi');

  var a = parseInt(args.join(' '));
  var c = f.compare(message.channel.guild.members.get(client.user.id), message.member);

  if(!a || a > 5 || a < 1)
    a = 1;

  console.log(a);

  var replies = [
    `Good job beating that ${(a / 6 * 100).toFixed(2)}% of getting banned.`,
    "Wow-wee, I suppose you get to survive.",
    "How'd you win? That's not fair! ))':<",
    "I guess you win. ¯\\_(ツ)_/¯",
    "Boo, go again!\nI wanna see your gray matter spray across the ceiling."
  ];

  var banReasons = [
    `Did you see <@${message.author.id}>'s brains spray across the wall, like a geizer of grey matter and blood? No? Should've been there, man--best thing I've seen in three years..`,
    `I can't believe how terrible <@${message.author.id}> is at Russian Roulette. Like, they lost to a ${(a / 6 * 100).toFixed(2)}% chance. Like, really--how?`,
    "D:",
    "D`:",
    ":(",
    "):",
    ")':",
    ":'("
  ];

  var reply = replies[Math.floor(Math.random() * replies.length)];
  var reason = banReasons[Math.floor(Math.random() * banReasons.length)];

  const p = Math.floor(Math.random() * 5);
  var b;

  switch(a) {
    case 1:
      b = [true, false, false, false, false, false];
      break;

    case 2:
      b = [true, true, false, false, false, false];
      break;

    case 3:
      b = [true, true, true, false, false, false];
      break;

    case 4:
      b = [true, true, true, true, false, false];
      break;

    case 5:
      b = [true, true, true, true, true, false];
      break;

    default:
      b = [true, false, false, false, false, false];
  }

  b = b[p];

  if(b) {
    if(sReg.test(args.join(' ')) || !c)
      message.channel.createMessage("You totally lost, but I can't ban you--just pretend it was blanks.");
    else {
      message.channel.createMessage("*bang*").then(m => {
        setTimeout(async () => {
          m.edit(`May God leave ${message.author.username}'s soul at peace.`);

          await client.banGuildMember(message.channel.guild.id, message.author.id, 0, reason);

          setTimeout(async () => {
            await client.unbanGuildMember(message.channel.guild.id, message.author.id);

            await message.channel.createInvite().then(async i => {
              await client.getDMChannel(message.author.id).then(async c => {
                await c.createMessage(`You were unbanned.\nhttps://discord.gg/${i.code}`);
              });
            });
          }, delay);
        }, 3500);
      });

      sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
        if(!r)
          return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        else
          return sql.run(`UPDATE users SET rrTotal = ${r.rrTotal + 1}, rrLosses = ${r.rrLosses + 1} WHERE id = '${message.author.id}'`);
      });
    }
  } else {
    await message.channel.createMessage("*click*").then(async m => {
      setTimeout(() => {
        m.edit(reply);
      }, 1500);

      sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
        if(!r)
          return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        else
          return sql.run(`UPDATE users SET rrTotal = ${r.rrTotal + 1}, rrWins = ${r.rrWins + 1} WHERE id = '${message.author.id}'`);
      });
    });
  }
};

exports.info = {
  usage: ":rr [bullets] [-s safe]",
  args: "[bullets]: The number of bullets to be used. Defaults to 1.\n[safe]: To be used, if you don't want to be banned whenever playing.",
  examples: ":rr 2\n :rr 5\n:rr -s\n:rr",
  description: "Feeling suicidal? Just want a bit of thrill? Then play some Russian roulette.",
  type: "fun"
};
