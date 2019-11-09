module.exports = (err, id) => {
  console.log(c.gray(`Error on shard ${id}:\n${err.stack}`));
};
