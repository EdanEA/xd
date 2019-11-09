var sc = require('../storage/stuff.json').keys.scID;
var snek = require('snekfetch');

module.exports = {
  async info(url=null, id=null, pid=null) {
    if(id !== null) {
      var g = await snek.get(`https://api.soundcloud.com/tracks/${id}?client_id=${sc}`);
      var dur = Math.round(g.body.duration / 1000);

      var body = g.body;

      if(!body || !body.id)
        return {};

      return { title: body.title, id: body.id, author: body.user.username, duration: dur, type: 1, img: body.artwork_url }
    } else if(url !== null) {
      var g = await snek.get(`https://api.soundcloud.com/resolve.json?url=${url}&client_id=${sc}`);
      var dur = Math.round(g.body.duration / 1000);

      var body = g.body;

      if(!body || !body.id)
        return {};

      return { title: body.title, id: body.id, author: body.user.username, duration: dur, type: 1, img: body.artwork_url }
    } else if(pid !== null) {
      var g = await snek.get(`https://api.soundcloud.com/playlists/${pid}?client_id=${sc}`);
      var dur = Math.round(g.body.duration / 1000);

      var body = g.body;

      if(!body || !body.id)
        return {};

      return { title: body.title, id: body.id, author: body.user.username, duration: dur, type: 1, img: body.artwork_url }

    }
  },

  async search(query, type=0) {
    var list = [];

    if(type == 0) {
      var g = await snek.get(`https://api.soundcloud.com/tracks?q=${query}&client_id=${sc}`);

      if(!g.body[0])
        return [];

      for(var t of g.body) {
        if(!t.id)
          continue;

        var dur = Math.round(t.duration / 1000);

        list.push({ title: t.title, id: t.id, author: t.user.username, duration: dur, type: 1, img: t.artwork_url });
      }
    } else if (type == 1) {
      var g = await snek.get(`https://api.soundcloud.com/playlists?q=${query}&client_id=${sc}`);

      if(!g.body[0])
        return [];

      for(var p of g.body) {
        if(!p.id)
          continue;

        list.push({ title: p.title, id: p.id, author: p.user.username, length: p.track_count, duration: Math.round(p.duration / 1000), img: p.artwork_url });
      }
    }

    return list;
  },

  async playlist(id, user) {
    var g = await snek.get(`https://api.soundcloud.com/playlists/${id}?client_id=${sc}`);
    var tracks = [];

    if(!g.body.tracks)
      return [];

    for(var t of g.body.tracks) {
      tracks.push({ title: t.title, id: t.id, author: t.user.username, duration: Math.round(t.duration / 1000), requester: user, type: 1, requester: user, img: t.artwork_url });
    }

    return tracks;
  }
};
