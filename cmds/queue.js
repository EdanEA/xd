const yt = require('../util/yt.js');
const sc = require('../util/sc.js');
const URL = require('url-parse');

exports.run = async (message, args) => {
  async function getEmbed(type, count, query, playlist, color) {
    var tracks = [];
    var ids = [];
    var embed = {
      title: `Search Results`,
      color: parseInt(`0x${color}`),
      footer: { text: `Reply with the number corresponding to the option you want queued.` }
    };

    if(type == "youtube") {
      await yt.search(query, playlist, count).then(async items => {
        for(var i = 0; i < count; i++) {
          var id = playlist ? items[i].id.playlistId : items[i].id.videoId;
          await yt.info(id, playlist).then(v => {
            if(playlist) {
              tracks.push({name: `Option \`[${Math.floor(i + 1)}]\``, value: `\`${v.title}\`\n\tBy: \`${v.author}\`\n\tPlaylist Length: \`${v.length}\`` });
              ids.push(v.id);
            } else {
              tracks.push({name: `Option \`[${Math.floor(i + 1)}]\``, value: `\`${v.title}\`\n\tBy: \`${v.author}\`\n\tDuration: \`${moment.duration(v.duration, "seconds").format("h [hours,] m [minutes,] s [seconds]")}\`` })
              ids.push(v.id);
            }
          });
        }
      });
    } else if(type == "soundcloud") {
      await sc.search(query, playlist).then(async items => {
        var i = 0;
        for(var track of items) {
          if(i == count)
            break;

          var length = "";
          if(playlist)
            length = `\n\tLength: ${track.length}`;

          tracks.push({name: `Option \`[${Math.floor(i + 1)}]\``, value: `\`${track.title}\`\n\tBy: \`${track.author}\`\n\tDuration: \`${moment.duration(track.duration, "seconds").format("h [hours,] m [minutes,] s [seconds]")}\`${length}`})
          ids.push(items[i].id);

          i++
        }
      });
    }

    if(!tracks[0])
      return null;

    return {
      embed: {
        title: `Search Results`,
        fields: tracks,
        color: parseInt(`0x${color}`),
        footer: { text: `Reply with the number corresponding to the option you want queued.` }
      },
      ids: ids
    };
  }

  if(!args[0]) return message.channel.createMessage(`<@${message.author.id}>, you need to provide me something to add to the queue.\nUse \`:help queue\` for more information.`) ;

  var g = guilds[message.channel.guild.id];
  var clearReg = /\s+/g;
  var cRegEx = new RegExp('-c \d+','gi');
  var cReg = /-c \d+/gi;
  var tReg = new RegExp('-t (youtube|soundcloud|yt|sc)','gi');
  var pRegEx = new RegExp('-p','gi');
  var pReg = /-p/gi;
  var t;
  var c;
  var p;
  var queueObject;
  var playlistInfo;

  // if(cRegEx.test(args.join(' ')))
  //   c = args.join(' ').match(cReg)[0];

  if(tReg.test(args.join(' ')))
    t = args.join(' ').match(tReg)[0];

  if(pRegEx.test(args.join(' ')))
    p = args.join(' ').match(pReg)[0];


  var q = args.join(' ').replace(cReg, "").replace(tReg, "").replace(pReg, "").replace(clearReg, " ");
  var u = new URL(q);

  if(u.pathname.split('/')[0] == "youtube.com" || u.host == "youtube.com" || u.pathname.split('/')[0] == "youtu.be" || u.host == "youtu.be") {
    var id = u.href.match(/^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?.*?(?:v|list)=(.*?)(?:&|$)|^(?:https?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?(?:(?!=).)*\/(.*)$/)[1];

    if(!u.href.includes("playlist")) {
      var info;

      await yt.info(id).then(v => {
        info = v;
      });

      queueObject = info;
      queueObject.requester = message.author.id;
      queueObject.url = u.href;
    } else {
      await yt.playlist(id, message.author.id, message.channel, true).then(v => {
        queueObject = v;
      });

      await yt.info(id, true).then(pl => {
        playlistInfo = pl;
      });
    }
  } else if(u.pathname.split('/')[0] == "soundcloud.com" || u.host == "soundcloud.com") {
    if(!u.href.includes('sets') && !u.href.includes("playlists")) {
      var info;

      await sc.info(u.href).then(v => {
        info = v;
      });

      queueObject = info;
      queueObject.requester = message.author.id;
      queueObject.url = u.href;
    } else {
      var id;

      await sc.info(u.href).then(v => {
        id = v.id;
        playlistInfo = v;
      });

      await sc.playlist(id, message.author.id, message.channel, true).then(v => {
        queueObject = v;
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

    if(!c)
      c = g.music.defaultSearchCount;
    else
      c = parseInt(c.split(' ')[1]);

    if(!p)
      p = false;
    else
      p = true;

    var e;

    await getEmbed(t, c, q, p, g.color).then(o => {
      e = o;
    });

    if(!e || !e.embed.fields)
      return await client.createMessage(message.channel.id, {embed: {
        color: 0xff0000,
        title: `Search Results`,
        description: `No videos were found with that particular query.`
      }});

    await client.createMessage(message.channel.id, {embed: e.embed});

    var choice = await message.channel.awaitMessages(m => m.author.id == message.author.id && parseInt(m.content) !== NaN, { maxMatches: 1, time: 15000 });

    if(!choice[0]) return message.channel.createMessage(`Exitting, as no (valid) option was given.`);
    else {
      if(!parseInt(choice[0].content)) return message.channel.createMessage(`Exitting, as an invalid option was given.`);
      choice = parseInt(choice[0].content) - 1;

      if(t == "youtube" && p == false)
        await yt.info(e.ids[choice]).then(v => {
          queueObject = {url: `https://youtube.com/watch?v=${v.id}`, id: v.id, title: v.title, author: v.author, duration: v.duration, type: 0};
        });

      else if(t == "youtube" && p == true) {
        await yt.playlist(e.ids[choice], message.author.id, message.channel, true).then(v => {
          queueObject = v;
        });

        await yt.info(e.ids[choice], true).then(v => {
          playlistInfo = v;
        });
      }

      else if(t == "soundcloud" && p == false)
        await sc.info(null, e.ids[choice]).then(v => {
          queueObject = { url: `https://api.soundcloud.com/tracks/${v.id}`, id: v.id, title: v.title, author: v.author, duration: v.duration, type: 1, requester: message.author.id, img: v.img };
        });

      else if(t == "soundcloud" && p == true) {
        await sc.playlist(e.ids[choice], message.author.id, message.channel, true).then(v => {
          queueObject = v;
        });

        await sc.info(null, null, e.ids[choice]).then(v => {
          playlistInfo = v;
        });
      }

      queueObject.requester = message.author.id;
    }
  }

  if(!queueObject[0]) {
    queue[message.channel.guild.id].push(queueObject);
    await message.channel.createMessage(`Successfully added \`${queueObject.title}\` to the queue.`);
  } else {
    queue[message.channel.guild.id] = queue[message.channel.guild.id].concat(Array.from(queueObject));
    await message.channel.createMessage(`Successfully added \`${queueObject.length}\` items to the queue, from \`${playlistInfo.title}\``);
  }

  if(!guilds[message.channel.guild.id].music.channel)
    guilds[message.channel.guild.id].music.channel = message.channel.id;

  return;
};

exports.info = {
  usage: ":queue <url | search term> [platform] [playlist]",
  args: "<url | search term>: Either a Soundcloud or YouTube URL or a search term.\n[-t platform]: The platform to search from, either `youtube` or `soundcloud`. By default it uses whatever is specified in the config.\n[-p playlist]: Included, as for the bot to search for playlists only.",
  description: "The `queue` command allows for a user to add an item to the guild's music queue. It does this by either being provided a url or by being given a search term.\n\nDo note: It is recommended to use Youtube, as Soundcloud's API is notoriously unstable and ill-defined.",
  examples: ":queue youtu.be/5msWb1l2j6g\n:queue one more love song\n:queue -t sc legal death\n:queue -t yt my fortnite house\n:queue -p arizona bay",
  type: "music"
};
