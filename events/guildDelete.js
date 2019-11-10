module.exports = async (guild) => {
  await client.createMessage(k.conf.logChannel, {embed:{
    color: 0x000000,
    title: `Left a Guild`,
    description: `Name: \`${guild.name}\`\nID: \`${guild.id}\``,
    timestamp: new Date().toISOString(),
    footer: {text: `${client.guilds.size} Servers`}
  }});
};
