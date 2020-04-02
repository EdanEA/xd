var l = require('../util/logging.js');

module.exports = async (m) => {
  if(!m.channel.guild)
    return;

  var s = guilds[m.channel.guild.id];
  var e = {
    color: parseInt(`0x${s.color}`),
    footer: {text: "Message Delete"},
    timestamp: new Date().toISOString()
  };

  if(!s.logging.logEnabled || !s.logging.logChannel || (!s.logging.events.includes("messagedelete") && s.logging.events.length > 0))
    return;

  if(m.content)
    e['fields'] = [{name: "Content", value: `\`\`\`${m.content.split("```").join(" ").trim()}\`\`\``}];

  e['footer']['icon_url'] = !m.author ? 'https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png' : (!m.author.avatarURL ? m.author.defaultAvatar : m.author.avatarURL);

  var info = "";

  if(typeof m.channel !== "undefined") {
    e['description'] = `A message was deleted in <#${m.channel.id}>.`;

    if(typeof m.author !== "undefined") {
      info = `By: <@${m.author.id}>`;
      e['description'] += `\n\nCreated By: ${m.author.username}#${m.author.discriminator}`;
    }
  }

  await l.log(e, s);
};
