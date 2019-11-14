exports.run = (message, args) => {
  if(!args.length)
    return message.channel.createMessage(`Arguments need to be given.`);

  var botChoice = Math.floor(Math.random() * 3);
  var cReg = new RegExp('(rock|r|paper|p|scissors|s)', 'gi');

  if(!cReg.test(args.join(' ')))
    return message.channel.createMessage(`An invalid argument was given.`);

  var choice = args.join(' ').match(cReg)[0];
  var win = false;

  switch(choice) {
    case "rock":
    case "r":
      choice = 0;
      if(botChoice == 2)
        win = true;
      break;

    case "paper":
    case "p":
    choice = 1;
    if(botChoice == 0)
      win = true;
    break;

    case "scissors":
    case "s":
      choice = 2;
      if(botChoice == 1)
        win = true;
      break;

    default:
      return;
  }

  var msg;
  var msgs = {
    win: [
      [
        "That was brutal; you just smashed the heckin' heck out of those scissors. It was truly hard to watch.",
        "I always wonder to myself: \"What makes a true man,\" \"What is the empitome of strength?\" And I think I figured out-it's winning with a fake rock in an online Rock-Paper-Scissors game, on a terrible bot.",
        "Oofers, fam-cycle. I know it had to be done, but was there a more humane way to obliterate something with a stone, other than smashing it with your bare hands? I'm fairly certain there is--perhaps you're just a brute.",
        "I'm bawling. That pair of scissors is--was--my son.",
        "Big rock break little scissors; rock big and strong. (:",
        ":D"
      ],
      [
        "Oh, my God--holy fucking shit! You covered it! How was it done?",
        `How dare you cover my one child, Rock? She was an esteemed member of our coalition, \`CAtFISH\`, but by covering her you've brought deep shame upon our family.\nShame on you, ${message.author.username}... Shame on you.`,
        `*${message.author.username} covers the rock*\n\n*the crowd murmurs*:\n"Jesus, what balls."`,
        "Oofies, famalam. I think that was the literal definition of devastating devastation; I've never seen something so ferocious.",
        "(:"
      ],
      [
        "Wow, oh wow, you won because my internal logic dictated that your provided argument caused the `win` variable to evaluate to true.\nOh yeah, and, uh, good job cutting that paper--or something.",
        "So let me get this right? This absolute beast just cut a piece of quote-unquote paper, with a pair of quote-unquote scissors? Now that's honorable.",
        "I'll have you know, that piece of paper was a transgender male. Good on you, I say; sadly, I think that's a hate-crime, so I'm gonna have to do my duty as a citizen and slaughter you now.",
        "\"Aghhh! Fuck, oh fuck! Is this it?! Is this where I die?\" the paper said, before losing all sentience--leaving it but a lifeless amalgamation of wood pulp. You stare down, losing grip of the scissors, suddenly dropping from your hands--you begin questioning the purpose of your actions.",
        "Wow, you just sliced through that paper, as if you were an ordinary tool, commonly used to cut paper and other such items.",
        ":)"
      ]
    ],

    lose: [
      [
        "Hahaha, yes! You lost to a piece of paper? How is that even possible--was the residual bleach too much to handle?",
        "Paper wins; rock loses. So sad; so improbable.",
        "D:",
        "D`:"
      ],
      [
        "I've always wondered what epitomal sadness is, but seeing your paper just get cut by my big-boi scissors is definitely in the running.",
        "Wowowowowowowowow. That wispy paper of yours was effectively lacerated by my powerful, sharp scissors.",
        "):",
        ")':"
      ],
      [
        "Oh no! Your scissors are broke now, lil' boi.",
        "*wheeze*\nI- I, uh *sudden laughter*\nThose scissors are broke, man. Ah-ha!",
        "Scissors broke by a rock? Impossible--yet it is so.",
        ":(",
        ":'("
      ]
    ]
  };

  if(win) {
    var msg = msgs.win[choice][Math.floor(Math.random() * msgs.win[choice].length)];

    sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
      if(!r)
        return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0]);
      else
        return sql.run(`UPDATE users SET rpsWins = ${r.rpsWins + 1}, rpsTotal = ${r.rpsTotal + 1} WHERE id = '${message.author.id}'`);
    });
  } else {
    var msg = msgs.lose[choice][Math.floor(Math.random() * msgs.lose[choice].length)];

    sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
      if(!r)
        return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]);
      else
        return sql.run(`UPDATE users SET rpsLosses = ${r.rpsLosses + 1}, rpsTotal = ${r.rpsTotal + 1} WHERE id = '${message.author.id}'`);
    });
  }

  return message.channel.createMessage(msg);
};

exports.info = {
  usage: ":rps <choice>",
  args: "<choice>: Your choice, e.g. \`rock\`.",
  examples: ":rps paper\n:rps scissors\n:rps p\n:rps r",
  description: "Allows you to play Rock-Paper-Scissors with the bot.",
  type: "fun"
};
