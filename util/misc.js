const snek = require("snekfetch");
module.exports = {
  hasMod(gid, id, client) {
    var g = client.guilds.get(gid);
    var m = g.members.get(id);
    var c = false;

    if(!g.id)
      return null;

    if(!m.id)
      return null;

    var r = m.highestRole.permissions;

    if(r.has("manageMessages") || r.has("kickMembers") || r.has("banMembers") || r.has("Administrator"))
      c = true;
    else if(g.ownerID == id)
      c = true;

    return c;
  },

  compare(m1, m2) {
    if(m1.id == m1.guild.ownerID)
      return true;
    else if(m2.id == m2.guild.ownerID)
      return false;

    if(m1.highestRole.id == m1.guild.id)
      return false;
    else if(!m2.highestRole.id == m2.guild.id)
      return true;

    if(m1.highestRole.position <= m2.highestRole.position)
      return false;
    else
      return true;
  },

  hasAdmin(gid, id, client) {
    var g = client.guilds.get(gid);
    var m = g.members.get(id);

    if(!g.id)
      return null;

    if(!m.id)
      return null;

    var r = m.highestRole.permissions;

    if(r.has("banMembers") || r.has("Administrator"))
      return true;
    else if(g.ownerID == id)
      return true;

    return false;
  },

  async muteMember(gid, id, minutes, client, conf) {
    var g = client.guilds.get(gid);
    var m = g.members.get(id);

    if(!g)
      return;

    if(!m)
      return;

    if(conf.mod.muteRoleId == null) {
      await g.createRole({name: "XD mute", permissions: 0, color: 0x686868}).then(async r => {
        conf.mod.muteRoleId = r.id;
      });

      setTimeout(async () => {
        await g.roles.get(conf.mod.muteRoleId).editPosition(g.members.get(client.user.id).highestRole.position - 1);

        await g.channels.forEach(c => {
          if(c.type == 0)
          c.editPermission(conf.mod.muteRoleId, 0, 68672, "role");
          else if(c.type == 2)
          c.editPermission(conf.mod.muteRoleId, 0, 3145728, "role");
        });
      }, 1000);
    }

    await m.addRole(conf.mod.muteRoleId);

    if(typeof m.voiceState.channelID == "string")
      await m.edit({mute: true});

    for(var i = 0; i < conf.mod.mutes.length; i++) {
      if(m.id == id)
        conf.mod.mutes.splice(i, 1);
    }

    conf.mod.mutes.push({id: id, length: minutes});
  },

  async unmuteMember(gid, id, client, conf) {
    var g = client.guilds.get(gid);
    var m = g.members.get(id);

    if(!g)
      return;

    if(!m)
      return;

    if(conf.mod.muteRoleId !== null)
      await m.removeRole(conf.mod.muteRoleId);

    if(typeof m.voiceState.channelID == "string")
      await m.edit({mute: false});

    for(var i = 0; i < conf.mod.mutes.length; i++) {
      if(m.id == id)
        conf.mod.mutes.splice(i, 1);
    }
  },

  async checkMutes(config, client) {
    await client.guilds.forEach(async g => {
      if(config[g.id].mod.mutes.length > 0) {
        for(var m of config[g.id].mod.mutes) {
          m.length--;

          if(m.length <= 0) {
            await this.unmuteMember(g.id, m.id, client, config[g.id]);
          }
        }
      }
    });
  },

  async checkInactive(client) {
    client.voiceConnections.forEach(async vc => {
      if(typeof vc.playing == "undefined" || !vc.playing) {
        await queue[vc.id].unshift(queue[vc.id][0]);
        await client.leaveVoiceChannel(vc.channelID);
      }

      var c = await client.guilds.get(vc.id).channels.get(vc.channelID);
      if(c.voiceMembers.size == 1) {
        await queue[vc.id].unshift(queue[vc.id][0]);
        await client.leaveVoiceChannel(c.id);
      } else {
        var u = {bots: 0, users: 0};
        await c.voiceMembers.forEach(m => {
          if(m.bot) u.bots += 1;
          else u.users += 1;
        });

        if(u.bots >= 1 && u.users == 0) {
          await queue[vc.id].unshift(queue[vc.id][0]);
          await client.leaveVoiceChannel(c.id);
        }
      }
    });
  },

  generateDeck() {
    var deck = [];
    var suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
    var values = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"];

    for(var suit of suits) {
      for(var value of values) {
        var weight;
        if(value == "Jack" || value == "Queen" || value == "King")
          weight = 10;
        else if(value == "Ace")
          weight = 11;
        else
          weight = parseInt(value);

        deck.push({ suit: suit, value: value, weight: weight });
      }
    }

    return deck;
  },

  shuffleDeck(deck) {
    var shuffled = deck.sort(() => Math.random() - 0.5);

    for(var i = 0; i < 250; i++) {
      shuffled = deck.sort(() => Math.random() - 0.5);
    }

    return shuffled;
  },

  async updateStatus(statuses) {
    var status = statuses[Math.floor(Math.random() * statuses.length)];

    await client.editStatus("dnd", status);
  },

  async postStats(keys, dbl, id, guildCount, shardCount, userCount, vcCount) {
    await dbl.postStats(serverCount, 0, shardCount);
    await snek.post(`https://discord.bots.gg/api/v1/bots/${id}/stats`, {headers: {
      Authorization: keys.dbgg,
      "Content-Type": "application/json"
    }}).send({guildCount: guildCount, shardCount: shardCount});
    await snek.post(`https://botsfordiscord.com/api/bot/${id}`, {headers: {
      Authorization: keys.bfd,
      "Content-Type": "application/json"
    }}).send({server_count: guildCount});
    await snek.post(`https://bots.ondiscord.xyz/bot-api/bots/${id}/guilds`, {headers: {
      Authorization: keys.bod,
      "Content-Type": "application/json"
    }}).send({guildCount: guildCount});
    await snek.post(`https://discordbot.world/api/bot/${id}/stats`, {headers: {
      Authorization: keys.bwd,
      "Content-Type": "application/json"
    }}).send({guild_count: guildCount, shard_count: shardCount});
    await snek.posh(`https://discordbotlist.com/api/bots/${id}/stats`, {headers: {
      Authorization: `Bot ${keys.dbl}`,
      "Content-Type": "application/json"
    }}).send({guilds: guildCount, users: userCount, voice_connections: vcCount});
  }
};
