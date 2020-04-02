const f = require('../util/misc.js');

class Hand {
  constructor(hand=[]) {
	this.hand = hand;
  }

  getValue() {
	var value = 0;

    for(var c of this.hand) {
	  value += c.weight;
	}

	if(value > 21) {
	  value = 0;

	  for(var c of this.hand) {
	    if(c.weight == 11)
		  value += 1;
	    else
		  value += c.weight;
	  }
	}

	return value;
  }

  addCard(card) {
    this.hand.push(card);
  }
}

function cardList(hand) {
  var s = "";
  for(var i = 0; i < hand.length; i++) {
    if(i == hand.length - 1)
	  s += `and a ${hand[i].value} of ${hand[i].suit}.`;
    else if(hand.length == 2 && i !== hand.length - 1)
      s += `a ${hand[i].value} of ${hand[i].suit} `;
    else
      s += `a ${hand[i].value} of ${hand[i].suit}, `
  }

  return s;
}

function updateSQL(id, won) {
  if(won)
    sql.get(`SELECT * FROM users WHERE id = '${id}'`).then(r => {
      if(!r)
        return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]);
      else
        return sql.run(`UPDATE users SET bjWins = ${r.bjWins + 1}, bjTotal = ${r.bjTotal + 1} WHERE id = '${id}'`);
    });
  else
    sql.get(`SELECT * FROM users WHERE id = '${id}'`).then(r => {
      if(!r)
        return sql.run(`INSERT INTO users (id, rrWins, rrLosses, rrTotal, coinWins, coinLosses, coinTotal, rpsWins, rpsLosses, rpsTotal, rollsTotal, bjWins, bjLosses, bjTotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1]);
      else
        return sql.run(`UPDATE users SET bjLosses = ${r.bjWins + 1}, bjTotal = ${r.bjTotal + 1} WHERE id = '${id}'`);
    });
}

exports.run = async (message, args) => {
  if(!users[message.author.id])
    users[message.author.id] = {bj: true};
  else if(users[message.author.id].bj == true)
	  return message.channel.createMessage(`You are currently playing a blackjack game.`);
  else
    users[message.author.id].bj = true;

  var deck = f.shuffleDeck(f.generateDeck());
  var playerHand = new Hand();
  var botHand = new Hand();
  var playing = true;
  var won = false;

  for(var i = 0; i < 2; i++) {
    var position = Math.floor(Math.random() * deck.length);
	  botHand.addCard(deck[position]);
	  deck.splice(position, 1);

	  position = Math.floor(Math.random() * deck.length);
    playerHand.addCard(deck[position]);
    deck.splice(position, 1);
  }

  if(playerHand.getValue() == 21) {
    await message.channel.createMessage(`Blackjack! You got ${cardList(playerHand.hand)}`);
    updateSQL(message.author.id, true);
    users[message.author.id].bj = false;

    return;
  }

  await message.channel.createMessage(`The bot shows a ${botHand.hand[0].value} of ${botHand.hand[0].suit}.\nYou have ${cardList(playerHand.hand)} (${playerHand.getValue()})\n\nReply with \`hit\` or \`stand\`.`);

  var playerBust = false;
  var botBust = false;

  while(playing) {
    var choice = await message.channel.awaitMessages(m => m.author.id == message.author.id && (m.content.toLowerCase() == "stand" || m.content.toLowerCase() == "hit"), {maxMatches: 1, time: 60000});
    var count = 0;

	  if(!choice[0]) {
	    if(count < 2) {
        await message.channel.createMessage(`You failed to reply. Reply with \`hit\` or \`stand\`.`);
		    count++;

        continue;
      } else {
        await message.channel.createMessage(`You failed to reply. Exitting.`);
        return;
	    }
    }

    if(choice[0].content.toLowerCase() == "stand")
	    playing = false;
    else {
      var position = Math.floor(Math.random() * deck.length);
	    playerHand.addCard(deck[position]);
	    deck.splice(position, 1);

	    var msg = `You now have ${cardList(playerHand.hand)} (${playerHand.getValue()})`;

	    if(playerHand.getValue() > 21) {
	      await message.channel.createMessage(`${msg}\n\nOh no, you've busted! The bot wins.`);
		    playerBust = true;
		    playing = false;
	    } else if(playerHand.getValue == 21) {
		    await message.channel.createMessage(`${msg}\n\nYou have a value of 21. Standing.`);
		    playing = false;
	    } else
	      await message.channel.createMessage(msg);
	  }
  }

  if(botHand.getValue() >= 17 && playerHand.getValue() < 21)
    await message.channel.createMessage(`The bot has ${cardList(botHand.hand)} (${botHand.getValue()})\n\nThe bot is standing.`);
  else if(botHand.getValue() < 17 && botHand.getValue() <= 21)
    await message.channel.createMessage(`The bot has ${cardList(botHand.hand)} (${botHand.getValue()})`);

  while(botHand.getValue() < 17 && !playerBust) {
    var position = Math.floor(Math.random() * deck.length);
    botHand.addCard(deck[position]);
    deck.splice(position, 1);

    var msg = `The bot now has ${cardList(botHand.hand)} (${botHand.getValue()})`;

    if(botHand.getValue() > 21) {
      botBust = true;
      won = true;
      await message.channel.createMessage(`${msg}\n\nOh no, the bot busted! You win!`);
    } else if(botHand.getValue() == 21) {
      await message.channel.createMessage(`${msg}\n\nThe bot has a value of 21. Standing.`);
    } else
	    await message.channel.createMessage(msg);
  }

  var pVal = playerHand.getValue();
  var bVal = botHand.getValue();

  if(pVal > bVal && !playerBust) {
    won = true;
	  await message.channel.createMessage(`You won with a value of ${pVal}; the bot had a value of ${bVal}.`);
  } else if(pVal == bVal && !playerBust)
    await message.channel.createMessage(`You and the bot drew with the value of ${pVal}.`);
  else if(!playerBust && !botBust)
    await message.channel.createMessage(`The bot won with a value of ${bVal}; you had a value of ${pVal}.`);

  updateSQL(message.author.id, won);
  users[message.author.id].bj = false;
};

exports.info = {
  usage: ":blackjack",
  args: "None.",
  examples: ":blackjack",
  description: "A simple blackjack game.",
  type: "fun"
};
