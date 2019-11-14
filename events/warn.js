module.exports = (message, id) => {
  console.log(`Warning from shard ${id}:\n${message}`);
};
