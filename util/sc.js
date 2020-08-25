const SC = require('soundcloud-v2-api');
const snek = require('snekfetch');
const scID = require('../storage/stuff.json').keys.scID;

SC.init({ clientId: scID });

module.exports = {
  async search(query, playlist=false, results=3) {
    var type = playlist ? 'playlists' : 'tracks';
    var tracks;

    await SC.get(`/search/${type}`, {
      q: query,
      limit: results
    }).then(async r => {
      tracks = r.collection;
    });

    if(tracks.length == 0)
      return null;

    var o = [];

    for(var track of tracks) {
      await this.getInfo(track.id, playlist).then(async t => {
        o.push(t);
      });
    }

    return o;
  },

  async getInfo(id, playlist=false) {
    var type = playlist ? 'playlists' : 'tracks';
    var o = {};

    await SC.get(`/${type}/${id}`).then(async t => {
      if(!t)
        t = null;

      var track = { id: t.id, title: t.title, author: t.user.username, url: t.permalink_url };

      if(playlist)
        track.length = t.track_count;
      else {
        track.duration = (t.duration / 1000);
        track.type = 1;
        track.img = t.artwork_url;
      }

      o = track;
    });

    return o;
  },

  async getByUrl(url) {
    if(!url)
      return null;

    var track;
    var res = await snek.get(`https://api-v2.soundcloud.com/resolve?url=${url}&client_id=${scID}`);

    var p = false;
    if(typeof res.body.track_count !== "undefined")
      p = true;

    await this.getInfo(res.body.id, p).then(i => {
      track = i;
    });

    return track;
  },

  async getPlaylistItems(id, channel=null) {
    if(!id)
      return [];

    var typing = true;
    if(channel !== null)
      setInterval(() => {
        if(typing)
          channel.sendTyping();
        else
          clearInterval();
      }, 1e3);

    var tracks = [];

    await SC.get(`/playlists/${id}`).then(async p => {
      for(var track of p.tracks) {
        await this.getInfo(track.id).then(t => {
          tracks.push(t);
        });
      }
    });

    typing = false;

    return tracks;
  }
};
