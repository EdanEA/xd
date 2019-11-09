module.exports = (guild) => {
  client.createMessage(k.conf.logChannel, {embed:{
    color: 0x000,
    title: `Left a Guild`,
    description: `Name: \`${guild.name}\`\nID: \`${guild.id}\``,
    timestamp: new Date().toISOString()
  }});

  console.log(`[${moment(new Date()).format("MMM Do, YY (h:mm:ss)")}] Left a guild:\n\tName: ${guild.name}\n\tID: ${guild.id}`);
};
