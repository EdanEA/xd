exports.run = (message, args) => {
  var flip = Math.floor(Math.random() * 2);
  var side = Boolean(flip) ? "heads" : "tails";

  if(!args[0])
    return message.channel.createMessage(`The coin lands, revealing \`${side}\`.`);

  var c = args.join(' ').match(/(heads|tails|h|t)/gi)[0].toLowerCase();
  var cflip;

  if(c == "heads" || c == "h")
    cflip = 1;
  else if(c == "tails" || c == "t")
    cflip = 0;
  else
    return message.channel.createMessage(`<@${message.author.id}>, that's an invalid side.`);

  var msgs = {
    win: [
      "Real good job there.",
      "Truly, just astounding--winning a 50% chance.",
      ":D",
      "(:",
      ""
    ],
    lose: [
      "Losing a 50% chance, how truly pitiful.",
      "):",
      "D:",
      "D`:",
      ""
    ]
  };

  var msg;

  if(cflip == flip) {
    msg = msgs.win[Math.floor(Math.random() * msgs.win.length)];

    sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
      if(!r)
        return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLoses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0]);
      else
        return sql.run(`UPDATE users SET coinWins = ${r.coinWins + 1}, coinTotal = ${r.coinTotal + 1} WHERE id = '${message.author.id}'`);
    });
  } else {
    msg = msgs.lose[Math.floor(Math.random() * msgs.lose.length)];

    sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
      if(!r)
        return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLoses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]);
      else
        return sql.run(`UPDATE users SET coinLosses = ${r.coinLosses + 1}, coinTotal = ${r.coinTotal + 1} WHERE id = '${message.author.id}'`);
    });
  }

  return message.channel.createMessage(`You guessed \`${c}\` and the coin landed on \`${side}\`. ${msg}`);
};

exports.info = {
  usage: ":flip [side]",
  args: "[side]: The side you think the coin will land on.\nLeaving none, simply returns the quote-unquote flip resolves to.",
  examples: ":flip heads\n:flip tails\n:flip t\n:flip",
  description: "Allows you to flip a coin--very fun, I know.",
  type: "fun"
};
