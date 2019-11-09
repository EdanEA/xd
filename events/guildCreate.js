module.exports = (guild) => {
  client.createMessage(k.conf.logChannel, {embed:{
    color: 0x32CD32,
    title: `Joined a Guild`,
    description: `Name: \`${guild.name}\`\nID: \`${guild.id}\`\nMember Count: \`${guild.memberCount}\`\nBot Count: \`${guild.botCount()}\``,
    timestamp: new Date().toISOString()
  }});

  console.log(`[${moment(new Date()).format("MMM Do, YY (h:mm:ss)")}] Joined a guild:\n\tName: ${guild.name}\n\tID: ${guild.id}`);
};
