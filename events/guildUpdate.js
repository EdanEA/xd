const l = require('../util/logging.js');

module.exports = async (guild, oldGuild) => {
  var s = guilds[guild.id];
  var desc = "";

  if(!s.logging.logEnabled || !s.logging.logChannel || (!s.logging.events.includes("guildupdate") && s.logging.events.length > 0))
    return;

  if(guild.name !== oldGuild.name)
    desc += `The guild's name was changed from \`${oldGuild.name}\`, to \`${guild.name}\`.`;

  if(guild.icon !== oldGuild.icon) {
    desc.length > 0 ? desc += "\n\n" : null;

    var pre = oldGuild.icon == null ? "" : ` [Previous icon](https://cdn.discordapp.com/icons/${guild.id}/${oldGuild.icon}.png?size=1024).`;
    desc += `The [guild icon](${guild.iconURL}) was changed.${pre}`;
  }

  if(guild.region !== oldGuild.region) {
    desc.length > 0 ? desc += "\n\n" : null;
    desc += `The guild's region was changed from \`${oldGuild.region}\`, to \`${guild.region}\`.`;
  }

  if(guild.verificationLevel !== oldGuild.verificationLevel) {
    desc.length > 0 ? desc += "\n\n" : null;

    if(oldGuild.verificationLevel < guild.verificationLevel)
      desc += `The guild's verification level from raised from \`${oldGuild.verificationLevel}\`, to \`${guild.verificationLevel}\`.`;
    else
      desc += `The guild's verification level was lowered from \`${oldGuild.verificationLevel}\`, to \`${guild.verificationLevel}\`.`;
  }

  if(guild.afkChannelID !== oldGuild.afkChannelID) {
    desc.length > 0 ? desc += "\n\n" : null;
    if(oldGuild.afkChannelID == null) {
      desc += `The guild's AFK channel was set to <#${guild.afkChannelID}>.`;
    } else if(guild.afkChannelID == null) {
      desc += `The guild's AFK channel was removed.`;
    } else {
      desc += `The guild's AFK channel was changed from <#${oldGuild.afkChannelID}>, to <#${guild.afkChannelID}>.`;
    }
  }

  if(guild.afkTimeout !== oldGuild.afkTimeout) {
    desc.length > 0 ? desc += "\n\n" : null;
    desc += `The guild's AFK timeout was set from \`${oldGuild.afkTimeout / 60} minutes\`, to \`${guild.afkTimeout / 60} minutes\`.`;
  }

  if(guild.ownerID !== oldGuild.ownerID) {
    desc.length > 0 ? desc += "\n\n" : null;
    desc += `Former Owner: <@${guild.ownerID}>.\nPrevious Owner: <@${oldGuild.ownerID}>.`;
  }

  if(desc.length <= 0)
    return;

  await l.log({
    description: desc,
    color: parseInt(`0x${s.color}`),
    footer: {icon_url: guild.iconURL, text: "Guild Update"},
    timestamp: new Date().toISOString()
  }, s);
};
