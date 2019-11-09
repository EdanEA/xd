const URL = require('url-parse');
const axios = require('axios');
const https = require('https');

exports.run = async (message, args) => {
  if(message.author.id !== k.conf.ownerID)
    return;

  var pReg = new RegExp("-p");
  var clearReg = /\s+/g;
  var i = args.join(" ");

  if(pReg.test(i)) {
    var q = i.replace(pReg, "").replace(clearReg, " ");
    var u = new URL(q);
    var url;
    var uri;
    var imgType;

    if(!u)
      return;

    if(u.pathname.includes(".png") || u.pathname.includes(".jpg") || u.pathname.includes(".jpeg")) {
      url = u.href;

      if(u.pathname.includes(".png"))
        imgType = "png";
      else if(u.pathname.includes(".jpg"))
        imgType = "jpg";
      else if(u.pathname.includes(".jpeg"))
        imgType = "jpeg";
      else
        imgType = "png";
    }

    else if(message.attachments.length > 0)
      url = message.attachments[0].url;

    console.log(url);

    await https.get(url, async (res) => {
      res.setEncoding('base64');
      var body = "data:" + "image/" + imgType + ";base64,";

      res.on('data', d => {
        body += d;
      });

      res.on('end', async () => {
        await client.editSelf({avatar: body});
      });
    });

    return;
  }

  var o = eval(i);

  if(typeof o !== "string")
    o = require('util').inspect(o);

  if(o.includes(k.bot.token) || o.includes(k.bot.alt))
    o = "Hahaha, no.";

  if(o.toString().length > 1024 && o.toString().length <= 2000) {
    return message.channel.createMessage(`Input:\n\`\`\`js\n${i}\`\`\`\n\nOutput:\n\`\`\`js\n${o}\`\`\``);
  } else if(o.length.toString() > 2000) {
    console.log(o);
    return message.channel.createMessage(`Output was too large for a message; logged to the console.`);
  }

  return client.createMessage(message.channel.id, {embed: {
    color: 0x008000,
    fields: [{ name: "`Input:`", value: `\`\`\`js\n${i}\`\`\`` }, { name: "`Output:`", value: `\`\`\`js\n${o}\`\`\`` }],
    footer: {icon_url: message.author.avatarURL},
    timestamp: new Date().toISOString()
  }});
};

exports.info = {
  usage: ")eval <code>",
  args: "<code>: The code to be evaluated.",
  description: "Lets the owner execute code.",
  examples: "hahaha, xd",
  type: "owner"
};
