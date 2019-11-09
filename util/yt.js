const ytk = require('../storage/stuff.json').keys.ytk;
const ytdl = require('ytdl-core');
const snek = require('snekfetch');

module.exports = {
  async info(id, type=false) {
    if(!type) {
      var i = await snek.get("https://www.googleapis.com/youtube/v3/videos").query({ part: 'id,snippet,status,contentDetails', id: id, key: ytk }).end();

      if(!i.body.items[0])
        return null;
      else {
        let dur = moment.duration(i.body.items[0].contentDetails.duration, moment.ISO_8601).asSeconds();
        return { id: i.body.items[0].id, title: i.body.items[0].snippet.title, author: i.body.items[0].snippet.channelTitle, duration: dur, type: 0, img: `https://img.youtube.com/vi/${i.body.items[0].id}/0.jpg` };
      }
    } else {
      var i = await snek.get("https://www.googleapis.com/youtube/v3/playlists").query({ part: 'id,snippet,status,contentDetails', id: id, key: ytk }).end();

      if(!i.body.items[0])
        return null;
      else
        return { id: i.body.items[0].id, title: i.body.items[0].snippet.title, author: i.body.items[0].snippet.channelTitle, length: i.body.items[0].contentDetails.itemCount };
    }
  },

  async search(query,type=0,amount=3) {
    if(type == 0)
      var results = await snek.get("https://www.googleapis.com/youtube/v3/search").query({ part: 'id,snippet', maxResults: `${amount}`, type: 'video', q: query, key: ytk }).catch(() => { return []; });
    else if (type == 1)
      var results = await snek.get("https://www.googleapis.com/youtube/v3/search").query({ part: 'id,snippet', maxResults: `${amount}`, type: 'playlist', q: query, key: ytk }).catch(() => { return []; });

    if(!results.body.items[0])
      return [];
    else
      return results.body.items;
  },

  async playlist(id, user, channel=null, typing=false) {
    var type = typing;
    var videos = [];

    if(type) {
      setInterval(() => {
        if(type)
          channel.sendTyping();
        else
          clearInterval();
      }, 1000);
    }

    var i = await snek.get('https://www.googleapis.com/youtube/v3/playlistItems').query({ maxResults: '50', part: 'id,snippet,status', playlistId: id, key: ytk });

    if(!i.body.items[0])
      return videos;

    for(var video of i.body.items) {
      if(!video.status || !video.status.privacyStatus || video.status.privacyStatus == "private")
        continue;

      var dur = await snek.get('https://www.googleapis.com/youtube/v3/videos').query({ part: 'contentDetails', id: video.snippet.resourceId.videoId, key: ytk }).end();
      if(!dur.body.items[0])
        continue;

      let d = moment.duration(dur.body.items[0].contentDetails.duration, moment.ISO_8601).asSeconds();
      videos.push({ id: video.snippet.resourceId.videoId, title: video.snippet.title, author: video.snippet.channelTitle, duration: d, requester: user, type: 0, img: `https://img.youtube.com/vi/${video.snippet.resourceId.videoId}/0.jpg` });
    }

    type = false;
    return videos;
  }
};
