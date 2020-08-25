const yt = require('../util/yt.js');
const sc = require('../util/sc.js');
const qf = require('../util/queueing.js');
const URL = require('url-parse');
const fetch = require('node-fetch');

async function getTrack(id) {
  return fetch(`http://${k.lavalink.host}:${k.lavalink.port}/loadtracks?identifier=${id}`, { headers: { Authorization: k.lavalink.pass } })
    .then(res => res.json())
    .then(data => data.tracks)
    .catch(err => {
      console.error(err);
      return null;
    });
}

exports.run = async (message, args) => {
  if(!args[0])
    return message.channel.createMessage(`<@${message.author.id}>, you need to provide me something to add to the queue.\nUse \`help queue\` for more information.`) ;

  var g = guilds[message.channel.guild.id];
  var clearReg = /\s+/g;
  var tReg = new RegExp('-t (youtube|soundcloud|yt|sc)','gi');
  var pReg = new RegExp('-p','gi');
  var idReg = /^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:v|list)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/;

  var t, c, p, queueObject, playlistInfo;

  if(tReg.test(args.join(' ')))
    t = args.join(' ').match(tReg)[0];

  if(pReg.test(args.join(' ')))
    p = args.join(' ').match(pReg)[0];

  var q = args.join(' ').replace(tReg, "").replace(pReg, "").replace(clearReg, " ");
  var u = new URL(q);

  if(u.pathname.split('/')[0] == "youtube.com" || u.host == "youtube.com" || u.pathname.split('/')[0] == "youtu.be" || u.host == "youtu.be" || u.host == "www.youtube.com" || u.host == "www.youtu.be") {
    var id;

    if(u.pathname.split('/')[0] == "youtube.com" || u.host == "youtube.com" || u.host == "www.youtube.com")
      id = u.href.match(idReg)[1];
    else {
      id = u.href.match(idReg)[2];
      u.href = `https://youtube.com/watch?v=${id}`;
    }

    if(!u.href.includes("playlist")) {
      var info;

      await yt.getInfo(id).then(v => {
        info = v;
      });

      queueObject = info;
      queueObject.url = u.href;

      await getTrack(u.href).then(r => {
        if(!r[0])
          return message.channel.createMessage(`There was an error getting that track.`);

        queueObject.b64 = r[0].track;
        queueObject.requester = message.author.id;
      });

      if(!queueObject.b64)
        return;
    } else {
      await yt.getPlaylistItems(id, message.channel).then(v => {
        queueObject = v;
      });

      await getTrack(id).then(r => {
        for(var i = 0; i < queueObject.length; i++) {
          if(!r[i])
            continue;

          queueObject[i].b64 = r[i].track;
          queueObject[i].requester = message.author.id;
        }
      });

      await yt.getInfo(id, true).then(pl => {
        playlistInfo = pl;
      });
    }
  } else if(u.pathname.split('/')[0] == "soundcloud.com" || u.host == "soundcloud.com") {
    if(!u.href.includes('sets') && !u.href.includes("playlists")) {
      var info;

      await sc.getByUrl(u.href).then(v => {
        if(!v)
          return;

        info = v;
      });

      if(!info)
        return message.channel.createMessage(`I couldn't get that track.`);

      queueObject = info;

      await getTrack(queueObject.url).then(r => {
        if(!r[0])
          return message.channel.createMessage(`There was an error getting that track.`);

        queueObject.b64 = r[0].track;
        queueObject.requester = message.author.id;
      });

      if(!queueObject.b64)
        return;
    } else {
      var id;

      await sc.getByUrl(u.href).then(v => {
        id = v.id;
        playlistInfo = v;
      });

      await sc.getPlaylistItems(id, message.channel).then(v => {
        queueObject = v;
      });

      await getTrack(playlistInfo.url).then(r => {
        for(var i = 0; i < queueObject.length; i++) {
          if(!r[i])
            continue;

          queueObject[i].b64 = r[i].track;
          queueObject[i].requester = message.author.id;
        }
      });
    }
  } else {
    var tracks = [];
    var ids = [];

    if(!t)
      t = g.music.defaultSearch;
    else if(t.split(' ')[1] == "sc" || t.split(' ')[1] == "soundcloud")
      t = "soundcloud";
    else if(t.split(' ')[1] == "yt" || t.split(' ')[1] == "youtube")
      t = "youtube";
    else
      t = g.music.defaultSearch;

    if(!p)
      p = false;
    else
      p = true;

    var e;

    await qf.getSearchEmbed(q, t, p).then(o => {
      e = o;
    });

    if(!e || !e.fields)
      return await client.createMessage(message.channel.id, {embed: {
        color: 0xff0000,
        title: `Search Results`,
        description: `No videos were found with that particular query.`
      }});

    e.color = parseInt(`0x${g.color}`);

    await client.createMessage(message.channel.id, {embed: e});

    var choice = await message.channel.awaitMessages(m => m.author.id == message.author.id && !isNaN(parseInt(m.content)), { maxMatches: 1, time: 15000 });

    if(!choice[0])
      return message.channel.createMessage(`Exitting, as no (valid) option was given.`);
    else {
      if(!parseInt(choice[0].content))
        return message.channel.createMessage(`Exitting, as an invalid option was given.`);

      choice = parseInt(choice[0].content) - 1;

      var track = e.fields[choice].track;

      if(t == "youtube" && p == false) {
        await yt.getInfo(track.id).then(v => {
          queueObject = v;
        });

        await getTrack(track.id).then(r => {
          if(!r[0])
            return message.channel.createMessage(`There was an error getting that track.`);

          queueObject.b64 = r[0].track;
        });

        if(!queueObject.b64)
          return;
      }

      else if(t == "youtube" && p == true) {
        await yt.getPlaylistItems(track.id, message.channel).then(v => {
          queueObject = v;
        });

        await yt.getInfo(track.id, true).then(v => {
          playlistInfo = v;
        });

        await getTrack(playlistInfo.id).then(r => {
          for(var i = 0; i < queueObject.length; i++) {
            if(!r[i])
              continue;

            queueObject[i].b64 = r[i].track;
            queueObject[i].requester = message.author.id;
          }
        });
      }

      else if(t == "soundcloud" && p == false) {
        await sc.getInfo(track.id).then(v => {
          queueObject = v;
        });

        await getTrack(track.url).then(r => {
          queueObject.b64 = r[0].track;
        });
      }

      else if(t == "soundcloud" && p == true) {
        await sc.getPlaylistItems(track.id, message.channel).then(v => {
          queueObject = v;
        });

        await sc.getInfo(track.id, true).then(v => {
          playlistInfo = v;
        });

        await getTrack(track.url).then(r => {
          for(var i = 0; i < queueObject.length; i++) {
            if(!r[i])
              continue;

            queueObject[i].b64 = r[i].track;
            queueObject[i].requester = message.author.id;
          }
        });
      }
    }
  }

  if(!Array.isArray(queueObject)) {
    queueObject.requester = message.author.id;

    queue[g.id].push(queueObject);
    await message.channel.createMessage(`Successfully added \`${queueObject.title}\` to the queue.`);
  } else {
    queue[g.id] = queue[g.id].concat(queueObject);
    await message.channel.createMessage(`Successfully added \`${queueObject.length}\` items to the queue, from \`${playlistInfo.title}\``);
  }

  if(!guilds[message.channel.guild.id].music.channel)
    guilds[message.channel.guild.id].music.channel = message.channel.id;

  return;
};

exports.info = {
  usage: "queue% <url | search term> [platform] [playlist]",
  args: "<url | search term>: A Soundcloud or YouTube URL, or a search term.\n[-t platform]: The platform to search from, either `youtube`--`yt`--or `soundcloud`--`sc`. By default it uses whatever is specified in the config--usually YouTube.\n[-p playlist]: To be included, as for the bot to search for playlists only.",
  description: "The `queue` command allows for a user to add an item to the guild's music queue. It does this by either being provided a url or by being given a search term.\n\nDo note: It is recommended to use Youtube, as Soundcloud's API is notoriously unstable.",
  examples: ":queue youtu.be/hF9uV4bgUqI\n%queue one more love song\n%queue -t sc -p legal death\n%queue -t yt my fortnite house\n%queue -t yt -p rant in e-minor",
  type: "music"
};
