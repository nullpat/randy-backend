import FastLink from "@performanc/fastlink";
import { client } from "../musicbot.js";
import errsole from "errsole";

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

const leaveChannel = async (guildId) => {
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

const getServers = async () => {
  const servers = client.guilds.cache;
  return servers;
};

const getServer = async (guildId) => {
  const servers = client.guilds.cache;
  const player = new FastLink.player.Player(guildId);

  let decodedQueue = [];
  if (player.playerCreated()) {
    const rawQueue = await player.getQueue();
    if (rawQueue.length > 0) {
      decodedQueue = await player.decodeTracks(rawQueue);
    }
  }

  const serverInfo = servers
    .filter((server) => server.id === guildId)
    .map((server) => ({
      name: server.name,
      queue: decodedQueue,
    }));
  const singleServerInfo = serverInfo[0];
  return singleServerInfo;
};

const getVoice = async (guildId) => {
  const guild = client.guilds.cache.get(guildId);
  const member = guild.members.cache.get(process.env.DISCORD_CLIENT_ID);
  return member.voice;
};

const getQueue = async (guildId) => {
  const player = await getPlayer(guildId);
  const rawQueue = await player.getQueue();
  if (rawQueue.length == 0) {
    return "Queue is empty";
  }
  const queue = await player.decodeTracks(rawQueue);
  return queue;
};

const autoLeave = async (guildId) => {
  let timeoutId = null;
  let intervalId = null;
  const timeoutValue = 60000;
  const intervalValue = 5000;

  const clearTimers = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  async function checkQueue(guildId) {
    try {
      const queue = await getQueue(guildId);

      if (typeof queue !== "object") {
        if (!timeoutId) {
          timeoutId = setTimeout(async () => {
            clearTimers();
            await leaveChannel(guildId);
          }, timeoutValue);
        }
      } else {
        clearTimers();
      }
    } catch (error) {
      errsole.warn(error.stack)
      clearTimers();
    }
  }

  intervalId = setInterval(async () => {
    await checkQueue(guildId);
  }, intervalValue);
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
  return "Cleared the queue.";
};

const skipSong = async (guildId) => {
  const player = await getPlayer(guildId);
  const skip = player.skipTrack();
  return skip;
};

const addSong = async (guildId, track, youtube) => {
  const player = await getPlayer(guildId);
  const loadPrefix = track.startsWith("https://")
    ? ""
    : youtube
    ? "ytsearch:"
    : "dzsearch:";
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
      return `Added ${data.tracks.length} songs from ${data.tracks[0].info.sourceName[0].toUpperCase()}${data.tracks[0].info.sourceName.slice(1)}.`;

    case "track":
    case "short":
      player.update({
        track: { encoded: data.encoded },
      });
      return `Added ${data.info.title} from ${data.info.sourceName[0].toUpperCase()}${data.info.sourceName.slice(1)}.`;

    case "search":
      player.update({
        track: { encoded: data[0].encoded },
      });
      return `Added ${data[0].info.title} from ${data[0].info.sourceName[0].toUpperCase()}${data[0].info.sourceName.slice(1)} search.`;

    default:
      throw new Error(`Failed to add to queue. LoadType: ${loadType}`);
  }
};

const services = {
  joinChannel,
  getPlayer,
  leaveChannel,
  changeVolume,
  getServers,
  getServer,
  getVoice,
  getQueue,
  autoLeave,
  pauseQueue,
  resumeQueue,
  clearQueue,
  skipSong,
  addSong,
};

export {
  joinChannel,
  getPlayer,
  leaveChannel,
  changeVolume,
  getServers,
  getServer,
  getVoice,
  getQueue,
  autoLeave,
  pauseQueue,
  resumeQueue,
  clearQueue,
  skipSong,
  addSong,
};

export default services;
