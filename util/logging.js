module.exports = {
  async log(embed, s) {
    if(!s.logging.logEnabled || !s.logging.logChannel) return;

    await client.createMessage(s.logging.logChannel, {embed: embed});
  },

  async multiLog(guildList, id, embed, guilds) {
    if(guildList.length <= 0)
      return;

    for(var g of guildList) {
      var s = guilds[g];

      if(!s.logging.logEnabled || !s.logging.logChannel || (!s.logging.events.includes("memberupdate") && s.logging.events.length > 0))
        continue;

      embed.color = parseInt(`0x${s.color}`);
      await client.createMessage(s.logging.logChannel, {embed: embed});
    }

    return;
  },

  async getBan(uid, gid) {
    var r = {staff: "", reason: ""};
    await client.guilds.get(gid).getAuditLogs(1, null, 22).then(l => {
      var users = l.users;
      var entries = l.entries;

      var i = 0;
      users.forEach(u => {
        if(u.id !== uid) users.splice(i, 1);
        i += 1;
      });

      var j = 0;
      entries.forEach(e => {
        if(e.targetID !== uid) entries.splice(j, 1);
        j += 1;
      });

      r.staff = entries[0].user.id;
      r.reason = entries[0].reason == null ? "No reason was given." : entries[0].reason;
    });

    return r;
  },

  async getKick(uid, gid) {
    var r = {reason: "", staff: ""};

    await client.guilds.get(gid).getAuditLogs(1, null, 20).then(k => {
      var users = k.users;
      var entries = k.entries;

      var i = 0;
      users.forEach(u => {
        if(u.id !== uid) users.splice(i, 1);
        i += 1;
      });

      var j = 0;
      entries.forEach(e => {
        if(e.targetID !== uid) entries.splice(j, 1);
        j += 1;
      });

      r.staff = entries[0].user.id;
      r.reason = entries[0].reason == null ? "No reason was given." : entries[0].reason;
    });

    if(!r.reason || !r.staff) return false;
    else return r;
  },

  async getUnban(uid, gid) {
    var r = {staff: "", reason: null};

    await client.guilds.get(gid).getAuditLogs(5, null, 23).then(a => {
      var users = a.users;
      var entries = a.entries;

      var i = 0;
      users.forEach(u => {
        if(u.id !== uid) users.splice(i, 1);
        i += 1;
      });

      var j = 0;
      entries.forEach(e => {
        if(e.targetID !== uid) entries.splice(j, 1);
        j += 1;
      });

      r.staff = entries[0].user.id;
      r.reason = entries[0].reason == null ? null : entries[0].reason;
    });

    return r;
  }
};
