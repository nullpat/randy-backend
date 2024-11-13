import FastLink from "@performanc/fastlink";

const getQueue = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  const queueRaw = await player.getQueue();
  const queue = await player.decodeTracks(queueRaw);
  return queue;
};

const pauseQueue = async (guildId, message = null) => {
  const player = new FastLink.player.Player(guildId);
  console.log(message)
  if (!player.playerCreated() || message != null) {
    message.channel.send("No player found.");
    return;
  }
  player.update({ paused: true });
  if (message) {
    message.channel.send("Paused.");
    return;
  }
  return;
};

const resumeQueue = () => {
  return;
};

const stopQueue = () => {
  return;
};

const addSongToQueue = () => {
  return;
};

const sendMessage = () => {
  return;
};

const services = {
  getQueue,
  addSongToQueue,
  sendMessage,
  pauseQueue,
  resumeQueue,
  stopQueue,
};

export default services;
