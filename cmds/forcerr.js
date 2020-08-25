var f = require('../util/misc.js');

exports.run = async (message, args) => {
  var ban = false;
  var uReg = new RegExp("-u", "gi");
  var idReg = new RegExp("[0-9]{18}");
  var mReg = /<@!?[0-9]{18}>/g;
  var clearReg = /\s+/g;
  var id;
  var m;
  var b;

  if(!idReg.test(message.content))
    return message.channel.createMessage(`A user's ID or mention must be left when calling the command.`);

  id = message.content.match(idReg)[0];

  if(!message.channel.guild.members.get(id))
    return message.channel.createMessage(`I cannot find that member.`);

  if(id == message.author.id)
    return message.channel.createMessage(`If you want to kill yourself, use \`rr\`.`);

  m = message.channel.guild.members.get(id);

  if(f.hasAdmin(message.member, message.channel.guild) && !uReg.test(message.content))
    ban = true;

  if(!f.hasAdmin(message.channel.guild.members.get(client.user.id), message.channel.guild))
    ban = false;

  if(!f.compare(message.member, m) || !f.compare(message.channel.guild.members.get(client.user.id), m))
    ban = false;

  b = message.content.replace(mReg, "").replace(idReg, "").replace(uReg, "").replace(clearReg, " ").split(" ");

  if(b.length == 1)
    b = 1;
  else
    b = parseInt(b[1]);

  switch(b) {
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

  var p = Math.floor(Math.random() * 5);

  var responses = {
    click: [
      "Boo! Go again!",
      "I Guess they get to live. Maybe try it again.",
      "They deserve it! Do it again!",
      "):<"
    ],
    bang: [
      "I suppose they've recieved their comeuppance.",
      ":D",
      "(^:",
      ":)"
    ],
    noban: [
      "I guess they're dead--or not, but, y'know.",
      "Wow, what are you? A milquetoast? Wow, I bet you're not even a person--the word doesn't apply now. Wow.",
      "How dare you tease me with the banning of some imbecile and then inhibit my climax? Please just ban them for me, so I can get off.",
      "Haha. Why no dead? Hehe, haha, hoho, hihi."
    ]
  };

  if(b[p]) {
    message.channel.createMessage("*bang*").then(msg => {
      if(ban) {
        var res = responses.bang[Math.floor(Math.random() * responses.bang.length)];
        setTimeout(async () => {
          await msg.edit(res);
          await client.banGuildMember(message.channel.guild.id, m.id, 0, "They were killed. xd");
        }, 3e3);
      } else {
        console.log(responses.noban)
        var res = responses.noban[Math.floor(Math.random() * responses.noban.length)];
        setTimeout(async () => {
          await msg.edit(res);
        }, 3e3);
      }
    });
  } else {
    var res = responses.click[Math.floor(Math.random() * responses.click.length)];
    message.channel.createMessage("*click*").then(msg => {
      setTimeout(async () => {
        await msg.edit(res);
      }, 3e3);
    });
  }
};

exports.info = {
  usage: ":forcerr <user> [bullets] [-u noban]",
  args: "<user>: A user's mention\n[bullets]: The number of bullets to be used. Cannot be less than 1 or greater than 5. Default: 1.\n[-u noban]: Used to signify that the user should not be banned, if they lose.",
  examples: ":forcerr <@115340880117891072>\n:forcerr <@346526660432232458> 5\n:forcerr <@346526660432232458> 5 -u",
  description: "A Russian Roulette game--essentually the same as the `rr` command--for use against other people. If the person using the command can ban, as well as the bot, and the user the command is being used upon is not greater in hierarchy to the command's user, nor the bot, they will be banned, unless the `-u` flag is used.",
  type: "fun"
};
