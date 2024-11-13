import FastLink from "@performanc/fastlink";
const getQueue = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated()) throw new Error("Something went wrong! CODE: 1");

  const queueRaw = await player.getQueue();
  const queue = await player.decodeTracks(queueRaw);
  return queue;
};

const pauseQueue = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated()) throw new Error("Something went wrong! CODE: 1");

  player.update({ paused: true });
  return;
};

const resumeQueue = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated()) throw new Error("Something went wrong! CODE: 1");

  player.update({ paused: false });
  return;
};

const clearQueue = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated()) throw new Error("Something went wrong! CODE: 1");

  player.update({ track: { encoded: null } });
  return;
};

const joinChannel = async (guildId, channelId) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated()) player.createPlayer();
  return;
};

const skipSong = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated()) throw new Error("Something went wrong! CODE: 1");

  player.skipTrack();
  return;
};

const addSong = async (guildId, track) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated()) throw new Error("Something went wrong! CODE: 1");

  const loadPrefix = track.startsWith("https://") ? "" : "ytsearch:";
  const load = await player.loadTrack(loadPrefix + track);
  const { loadType, data } = load;

  switch (loadType) {
    case "playlist":
    case "album":
    case "station":
    case "show":
    case "podcast":
    case "artist":
      player.update({
        tracks: { encodeds: data.tracks.map(({ encoded }) => encoded) },
      });
      return `Added ${data.tracks.length} songs from ${data.tracks[0].info.sourceName}.`;

    case "track":
    case "short":
      player.update({
        track: { encoded: data.encoded },
      });
      return `Added ${data.info.title} from ${data.info.sourceName}.`;

    case "search":
      player.update({
        track: { encoded: data[0].encoded },
      });
      return `Added ${data[0].info.title} from ${data[0].info.sourceName} search.`;

    default:
      throw new Error("Something went wrong! CODE: 2");
  }
};

const services = {
  getQueue,
  pauseQueue,
  resumeQueue,
  clearQueue,
  joinChannel,
  skipSong,
  addSong,
};

export default services;
