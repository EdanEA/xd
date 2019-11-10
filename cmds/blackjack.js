const f = require('../util/misc.js');

exports.run = async (message, args) => {
  var deck = f.generateDeck();
  deck = f.shuffleDeck(deck);

  var bHand = [];
  var pHand = [];
  var bValue = 0;
  var pValue = 0;
  var playing = true;
  var won = false;

  for(var i = 0; i < 2; i++) {
    var position = Math.floor(Math.random() * deck.length);
    bHand[i] = deck[position];
    bValue += bHand[i].weight;
    deck.splice(position, 1);

    var position = Math.floor(Math.random() * deck.length);
    pHand[i] = deck[position];
    pValue += pHand[i].weight;
    deck.splice(position, 1);
  }

  if(pHand[0] + pHand[1] == 21) {
    await message.channel.createMessage(`Blackjack! You got a ${pHand[0].value} of ${pHand[0].suit} and a ${pHand[1].value} of ${pHand[1].suit}.`);

    sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
      if(!r)
        return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]);
      else
        return sql.run(`UPDATE users SET bjWins = ${r.bjWins + 1}, bjTotal = ${r.bjTotal + 1} WHERE id = '${message.author.id}'`);
    });

    return;
  }

  await message.channel.createMessage(`The bot shows a ${bHand[1].value} of ${bHand[1].suit}.\nYou have a ${pHand[0].value} of ${pHand[0].suit} and a ${pHand[1].value} of ${pHand[1].suit}. (${pValue})\n\nReply with \`hit\` or \`stand\`.`);

  var count = 1;
  var bust = false;

  while(playing) {
    var choice = await message.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.toLowerCase() == "stand" || m.content.toLowerCase() == "hit"), {maxMatches: 1, time: 60000});

    if(!choice[0]) {
      if(count < 3) {
        await message.channel.createMessage(`You failed to reply. Reply with \`hit\` or \`stand\`.`);
        count++;

        continue;
      } else {
        await message.channel.createMessage(`You failed to reply. Exitting.`);

        break;
      }
    }

    if(choice[0].content.toLowerCase() == "stand")
      playing = false;
    else {
      var position = Math.floor(Math.random() * deck.length);
      pHand.push(deck[position]);
      pValue += deck[position].weight;
      deck.splice(position, 1);

      var msg = `You now have`;
      var i = 0;

      for await (var card of pHand) {
        if(i == (pHand.length - 1))
          msg += ` and a ${card.value} of ${card.suit}.`;
        else
          msg += ` a ${card.value} of ${card.suit},`;

        i++;
      }

      msg += ` (${pValue})`;

      await message.channel.createMessage(msg);

      if(pValue > 21) {
        bust = true;
        await message.channel.createMessage(`Oh no, you've busted! The bot wins.`);

        playing = false;
      }
    }
  }

  if(bValue >= 17)
    await message.channel.createMessage(`The bot has a ${bHand[0].value} of ${bHand[0].suit} and a ${bHand[1].value} of ${bHand[1].suit}. (${bValue})\nThe bot is standing.`);
  else {
    await message.channel.createMessage(`The bot has a ${bHand[0].value} of ${bHand[0].suit} and a ${bHand[1].value} of ${bHand[1].suit}. (${bValue})`);

    while(bValue < 17 && !bust) {
      var position = Math.floor(Math.random() * deck.length);
      bHand.push(deck[position]);
      bValue += deck[position].weight;
      deck.splice(position, 1);

      var msg = `The bot now has`;
      var i = 0;

      for await (var card of pHand) {
        if(i == (pHand.length - 1))
          msg += ` and a ${card.value} of ${card.suit}.`;
        else
          msg += ` a ${card.value} of ${card.suit},`;

        i++;
      }

      msg += ` (${bValue})`;

      await message.channel.createMessage(msg);

      if(bValue > 21) {
        bust = true;
        await message.channel.createMessage(`Oh no, the bot busted! You win!`);

        won = true;
        playing = false;
      }
    }
  }

  if(pValue > bValue && !bust) {
    won = true;
    message.channel.createMessage(`You won with a value of ${pValue}; the bot had a value of ${bValue}.`);
  }
  else if(pValue == bValue && !bust)
    message.channel.createMessage(`You and the bot drew with a value of ${pValue}.`);
  else if(!bust)
    message.channel.createMessage(`The bot won with a value of ${bValue}; you had a value of ${pValue};`);

  if(won) {
    sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
      if(!r)
        return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]);
      else
        return sql.run(`UPDATE users SET bjWins = ${r.bjWins + 1}, bjTotal = ${r.bjTotal + 1} WHERE id = '${message.author.id}'`);
    });
  } else {
    sql.get(`SELECT * FROM users WHERE id = '${message.author.id}'`).then(r => {
      if(!r)
        return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [message.author.id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]);
      else
        return sql.run(`UPDATE users SET bjLosses = ${r.bjLosses + 1}, bjTotal = ${r.bjTotal + 1} WHERE id = '${message.author.id}'`);
    });
  }
};

exports.info = {
  usage: ":blackjack",
  args: "None.",
  examples: ":blackjack",
  description: "Allows you to play blackjack with the bot. The bot stands at 17.",
  type: "fun"
};
