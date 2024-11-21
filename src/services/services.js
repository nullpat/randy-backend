import FastLink from "@performanc/fastlink";
import { client } from "../musicbot.js";

const joinChannel = async (guildId, channelId) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated()) player.createPlayer();
  player.connect(channelId, { mute: false, deaf: true }, (guildId, payload) => {
    client.guilds.cache.get(guildId).shard.send(payload);
  });
  return "Joined voice channel.";
};

const getPlayer = async (guildId) => {
  const player = new FastLink.player.Player(guildId);
  if (!player.playerCreated())
    throw new Error("Player does not exist in server.");
  return player;
};

const disconnectPlayer = async (guildId) => {
  const player = await getPlayer(guildId);
  player.connect(null, null, (guildId, payload) => {
    client.guilds.cache.get(guildId).shard.send(payload);
  });
  player.destroy();
  return "Disconnected.";
};

const changeVolume = async (guildId, volume) => {
  const player = await getPlayer(guildId);
  player.update({
    volume: parseInt(volume),
  });
  return `Volume set to ${parseInt(volume)}`;
};

const getQueue = async (guildId) => {
  const player = await getPlayer(guildId);
  const queueRaw = await player.getQueue();
  if (queueRaw.length == 0) {
    throw new Error("Queue is empty");
  }
  const queue = await player.decodeTracks(queueRaw);
  return queue;
};

const pauseQueue = async (guildId) => {
  const player = await getPlayer(guildId);
  player.update({ paused: true });
  return "Paused the queue.";
};

const resumeQueue = async (guildId) => {
  const player = await getPlayer(guildId);
  player.update({ paused: false });
  return "Resumed the queue.";
};

const clearQueue = async (guildId) => {
  const player = await getPlayer(guildId);
  player.update({ track: { encoded: null } });
  return;
};

const skipSong = async (guildId, next) => {
  const player = await getPlayer(guildId);
  const skip = player.skipTrack();
  return skip;
};

const addSong = async (guildId, track) => {
  const player = await getPlayer(guildId);
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
      throw new Error(`Failed to add to queue. LoadType: ${loadType}`);
  }
};

const services = {
  joinChannel,
  getPlayer,
  disconnectPlayer,
  changeVolume,
  getQueue,
  pauseQueue,
  resumeQueue,
  clearQueue,
  skipSong,
  addSong,
};

export default services;
