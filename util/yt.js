const k = require('../storage/stuff.json');
const ytk = k.keys.ytk;
const snek = require('snekfetch');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  async search(query, playlist=false, results=3) {
    var type = playlist ? 'playlist' : 'video';

    var res = await snek.get(`https://www.googleapis.com/youtube/v3/search`).query({
      part: 'id,snippet',
      maxResults: `${results}`,
      type: type,
      q: query,
      key: ytk
    }).catch(err => {
      if(err)
        throw err;
    });

    if(!res.body.items[0])
      return [];

    var o = [];

    for(var t of res.body.items) {
      let id = playlist ? t.id.playlistId : t.id.videoId;
      await this.getInfo(id, playlist).then(async r => {
        if(!r)
          return;

        o.push(r);
      });
    }

    return o;
  },

  async getInfo(id, playlist=false) {
    var t = playlist ? 'playlists' : 'videos';

    var res = await snek.get(`https://www.googleapis.com/youtube/v3/${t}`).query({
      part: 'id,snippet,status,contentDetails',
      id: id,
      key: ytk
    }).end();

    if(!res.body.items[0])
      return null;

    let i = res.body.items[0];
    var o = { id: i.id, title: i.snippet.title, author: i.snippet.channelTitle };

    if(playlist)
      o.length = i.contentDetails.itemCount;
    else {
      let dur = moment.duration(i.contentDetails.duration, moment.ISO_8601).asSeconds();
      o.duration = dur;
      o.type = 0;
      o.img = `https://img.youtube.com/vi/${i.id}/0.jpg`;
    }

    return o;
  },

  async getPlaylistItems(id, channel=null) {
    var res = await snek.get(`https://www.googleapis.com/youtube/v3/playlistItems`).query({
      part: 'id,snippet,status',
      playlistId: id,
      key: ytk,
      maxResults: 50
    }).end();

    if(!res.body.items[0])
      return null;

    var typing = true;
    if(channel !== null)
      setInterval(() => {
        if(typing)
          channel.sendTyping();
        else
          clearInterval();
      }, 1e3);

    var videos = [];

    for(var v of res.body.items) {
      if(!v.status || !v.status.privacyStatus || v.status.privacyStatus == "private")
        continue;

      await this.getInfo(v.snippet.resourceId.videoId).then(t => {
        videos.push(t);
      });
    }

    typing = false;

    return videos;
  }
};
