const yt = require('./yt.js');
const sc = require('./sc.js');
const moment = require('moment');
require('moment-duration-format');

module.exports = {
  getFields(array, playlist) {
    var o = [];

    var i = 0;
    for(var v of array) {
      if(!playlist)
        o.push({
          name: `Option \`${i + 1}\``,
          value: `${v.title}\n\tBy: \`${v.author}\`\n\tDuration: \`${moment.duration(v.duration, "seconds").format("h [hours,] m [minutes,] s [seconds]")}\``,
          track: v
        });
      else
        o.push({
          name: `Option \`${i + 1}\``,
          value: `${v.title}\n\tBy: \`${v.author}\`\n\tPlaylist Length: \`${v.length}\``,
          track: v
        });

      i++;
    }

    return o;
  },

  async getSearchEmbed(query, type="youtube", playlist=false) {
    var tracks = [];
    var embed = {
      title: `Search Results`,
      footer: { text: "Reply with the number corresponding to the option you want queued." }
    };

    if(type == "youtube" || type == "yt") {
      await yt.search(query, playlist).then(async r => {
        var fields = this.getFields(r, playlist);
        tracks = tracks.concat(fields);
      });
    } else if(type == "soundcloud" || type == "yt") {
      await sc.search(query, playlist).then(async r => {
        var fields = this.getFields(r, playlist);
        tracks = tracks.concat(fields);
      });
    } else
      throw "Invalid type was given for getSearchEmbed";

    if(!tracks[0])
      return {};

    embed.fields = tracks;

    return embed;
  }
};
