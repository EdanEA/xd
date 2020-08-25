module.exports = (Eris) => {
  // process.on("uncaughtException", (err) => {
  //   console.error(c.gray(`Uncaught Exception: ${err}`));
  // });
  //
  // process.on("unhandledRejection", err => {
  //   console.error(c.gray(`Unhandled rejection: ${err}`));
  // });

  // Stolen from this guy, 'cause I'm retarded. https://github.com/TTtie xd
  Object.defineProperty(Eris.Guild.prototype, "defaultChannel", {
    get: function () {
      if (this.channels.filter((c) => c.type == 0).length == 0)
        return null;

      const defaultChannel = this.channels.filter((c) => c.type == 0 && c.permissionsOf(this.shard.client.user.id).has("readMessages")).sort((a, b) => a.position - b.position)[0];

      if (!defaultChannel)
        return null;

      return this.channels.get(defaultChannel.id);

    }, set: () => {}
  });
};
