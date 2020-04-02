exports.run = (message, args) => {
  var roll = Math.floor(Math.random() * 6) + 1;

  if(!args.length)
    return message.channel.createMessage(`The dice lands, showing \`${roll}\`.`);

  var r = new RegExp("[0-9]+", "g");
  var sides = parseInt(args.join(' ').match(r)[0]);
  roll = Math.floor(Math.random() * sides) + 1;

  sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
    if(!r)
      return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]);
    else
      return sql.run(`UPDATE users SET rollsTotal = ${r.rollsTotal + 1} WHERE id = '${message.author.id}'`);
  });

  return message.channel.createMessage(`The dice lands, showing \`${roll.toLocaleString('fullwide', {useGrouping: false})}\`.`);
};

exports.info = {
  usage: ":roll [sides]",
  args: "[sides]: The number of sides for the dice. `6` by default.",
  examples: ":roll\n:roll 100\n:roll 8",
  description: "Lets you \"roll\" a dice, with however many sides you want.",
  type: "fun"
};
