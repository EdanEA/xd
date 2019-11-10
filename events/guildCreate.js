module.exports = (guild) => {
  var botCount = function() { var bots = 0; guild.members.forEach(m => {if(m.bot) bots += 1;}); return bots;};

  client.createMessage(k.conf.logChannel, {embed:{
    color: 0x32CD32,
    title: `Joined a Guild`,
    description: `Name: \`${guild.name}\`\nID: \`${guild.id}\`\nMember Count: \`${guild.memberCount}\`\nBot Count: \`${botCount()}\``,
    timestamp: new Date().toISOString()
  }});

  console.log(`[${moment(new Date()).format("MMM Do, YY (h:mm:ss)")}] Joined a guild:\n\tName: ${guild.name}\n\tID: ${guild.id}`);
};
