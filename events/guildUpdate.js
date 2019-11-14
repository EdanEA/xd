const l = require('../util/logging.js');

module.exports = async (guild, oldGuild) => {
  var s = guilds[guild.id];
  var desc = "";

  if(!s.logging.logEnabled || !s.logging.logChannel)
    return;

  if(guild.name !== oldGuild.name)
    desc += `The guild's name was changed to \`${guild.name}\`. It previously was \`${oldGuild.name}\`.`;

  if(guild.icon !== oldGuild.icon) {
    desc.length > 0 ? desc += "\n\n" : null;

    var pre = oldGuild.icon == null ? "" : ` [Previous icon](https://cdn.discordapp.com/icons/${guild.id}/${oldGuild.icon}.png?size=1024).`;
    desc += `The [guild icon](${guild.iconURL}) was changed.${pre}`;
  }

  if(guild.region !== oldGuild.region) {
    desc.length > 0 ? desc += "\n\n" : null;
    desc += `The guild's region was changed from \`${oldGuild.region}\` to \`${guild.region}\`.`;
  }

  if(guild.verificationLevel !== oldGuild.verificationLevel) {
    desc.length > 0 ? desc += "\n\n" : null;
    desc += `The guild's verification level was changed from \`${oldGuild.verificationLevel} to \`${guild.verificationLevel}\`.`;
  }

  if(guild.afkChannelID !== oldGuild.afkChannelID) {
    desc.length > 0 ? desc += "\n\n" : null;
    if(oldGuild.afkChannelID == null) {
      desc += `The guild's AFK was set to <#${guild.afkChannelID}>.`;
    } else if(guild.afkChannelID == null) {
      desc += `The guild's AFK channel was removed.`;
    } else {
      desc += `The guild's AFK channel was changed from <#${oldGuild.afkChannelID}>, to <#${guild.afkChannelID}>.`;
    }
  }

  if(guild.afkTimeout !== oldGuild.afkTimeout) {
    desc.length > 0 ? desc += "\n\n" : null;
    desc += `The guild's AFK timeout was set to \`${guild.afkTimeout / 60} minutes\`. Was \`${oldGuild.afkTimeout / 60} minutes\`.`;
  }

  if(guild.ownerID !== oldGuild.ownerID) {
    desc.length > 0 ? desc += "\n\n" : null;
    desc += `The owner of the guild is now <@${guild.ownerID}>.\n\nPrevious owner: <@${oldGuild.ownerID}>.`;
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
