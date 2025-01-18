import FastLink from "@performanc/fastlink";
import errsole from "errsole";
import { client } from "../musicbot.js";
import { isFirstStartEvent, toggleFirstStartTrue } from "../../index.js";
import { logger } from "../utils/logger.js";
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

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
  if (!player.playerCreated()) throw new Error("Player does not exist in server.");
  return player;
};

const leaveChannel = async (guildId) => {
  const player = await getPlayer(guildId);
  player.connect(null, null, (guildId, payload) => {
    client.guilds.cache.get(guildId).shard.send(payload);
  });
  player.destroy();
  toggleFirstStartTrue();
  client.user.setPresence({ activities: [{ name: "you sleep", type: 3 }] });
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
      id: server.id,
      name: server.name,
      queue: decodedQueue,
      icon: server.icon,
    }));

  const singleServerInfo = serverInfo[0];
  const iconURL = singleServerInfo.icon
    ? `https://cdn.discordapp.com/icons/${singleServerInfo.id}/${singleServerInfo.icon}.png`
    : null;

  const shortName = singleServerInfo.name
    .match(/\b\w|\W+/g)
    .map((name) => {
      if (/\w/.test(name)) {
        return name.charAt(0).toUpperCase();
      }
      if (name.trim() === "") {
        return "";
      }
      return name;
    })
    .join("")
    .replace("'S", "");

  const finalServerInfo = serverInfo.map((server) => ({
    name: server.name,
    queue: decodedQueue,
    icon: iconURL,
    shortName: shortName,
  }));

  return finalServerInfo;
};

const getVoice = async (guildId) => {
  const guild = client.guilds.cache.get(guildId);
  const member = guild.members.cache.get(process.env.DISCORD_CLIENT_ID);
  return member.voice;
};

const getQueue = async (guildId) => {
  const player = await getPlayer(guildId);
  const rawQueue = await player.getQueue();
  if (rawQueue.length === 0) {
    return rawQueue;
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

      if (queue.length === 0) {
        if (!timeoutId) {
          timeoutId = setTimeout(async () => {
            clearTimers();
            toggleFirstStartTrue();
            await leaveChannel(guildId);
          }, timeoutValue);
        }
      } else {
        clearTimers();
      }
    } catch (error) {
      errsole.warn(error.stack);
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
  toggleFirstStartTrue();
  return "Cleared the queue.";
};

const checkLast = async (guildId) => {
  const player = await getPlayer(guildId);
  const removedTrack = player.info.queue.slice(-1);
  if (removedTrack.length === 0) {
    return
  }
  const decodedTrack = await player.decodeTracks(removedTrack);

  return `Are you sure you want to remove ${decodedTrack[0].info.title} by ${decodedTrack[0].info.author} from the queue?`;
};

const removeLast = async (guildId) => {
  const player = await getPlayer(guildId);
  const removedTrack = player.info.queue.slice(-1);
  const decodedTrack = await player.decodeTracks(removedTrack);
  if (player.info.queue.length === 1) {
    clearQueue(guildId);
  } else {
    player.info.queue = player.info.queue.slice(0, -1);
  }
  return `Removed ${decodedTrack[0].info.title} by ${decodedTrack[0].info.author} from the queue.`;
};

const skipSong = async (guildId) => {
  const player = await getPlayer(guildId);
  const skip = player.skipTrack();
  return skip;
};

const addSong = async (guildId, track, youtube) => {
  const player = await getPlayer(guildId);
  const loadPrefix = track.startsWith("https://") ? "" : youtube ? "ytsearch:" : "dzsearch:";
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
      const formattedPlaylistSource = formatSource(data.tracks[0].info.sourceName);
      return `Added ${data.tracks.length} songs from ${formattedPlaylistSource}.`;

    case "track":
    case "short":
      player.update({
        track: { encoded: data.encoded },
      });
      const formattedTrackSource = formatSource(data.info.sourceName);
      return `Added ${data.info.title} from ${formattedTrackSource}.`;

    case "search":
      player.update({
        track: { encoded: data[0].encoded },
      });
      const formattedSearchSource = formatSource(data[0].info.sourceName);
      return `Added ${data[0].info.title} from ${formattedSearchSource} search.`;

    default:
      throw new Error(`Failed to add to queue. LoadType: ${loadType}`);
  }
};

const formatSource = (sourceName) => {
  switch (sourceName) {
    case "youtube":
      return "YouTube";
    case "soundcloud":
      return "SoundCloud";
    case "deezer":
      return "Deezer";
    case "spotify":
      return "Spotify";
    default:
      return sourceName;
  }
};

async function nowPlaying(guildId) {
  const overrideChannels = [
    {
      guildId: "889971568732684298",
      channelId: "1139615420400291851",
    },
    {
      guildId: "166740556947390465",
      channelId: "708165175341088828",
    },
  ];
  try {
    const voiceData = await getVoice(guildId);
    const queue = await getQueue(guildId);
    const matchedOverride = overrideChannels.find((override) => override.guildId === guildId);
    const selectedChannelId = matchedOverride ? matchedOverride.channelId : voiceData.channelId;
    const channel = client.channels.cache.get(selectedChannelId);
    const queueButton = new ButtonBuilder().setCustomId("queue").setLabel("Show Queue").setStyle(ButtonStyle.Primary);
    const hjelpButton = new ButtonBuilder().setCustomId("hjelp").setLabel("Hjelp").setStyle(ButtonStyle.Primary);
    const undoButton = isFirstStartEvent
      ? null
      : new ButtonBuilder().setCustomId("undo").setLabel("Undo").setStyle(ButtonStyle.Secondary);
    const row = new ActionRowBuilder().addComponents(undoButton, queueButton, hjelpButton);

    if (queue.length === 0) {
      client.user.setPresence({ activities: [{ name: "you sleep", type: 3 }] });
      autoLeave(guildId);
      return;
    }

    if (!channel || !channel.isTextBased()) {
      logger.error(`Channel Id must exist and allow text: ${voiceData.channelId}`);
      return;
    }

    const { title, author, uri, artworkUrl } = queue[0].info;
    const albumName = queue[0].pluginInfo.albumName || "";

    const nowPlaying = new EmbedBuilder()
      .setTitle(title)
      .setURL(uri)
      .setAuthor({
        name: "Now Playing",
      })
      .setDescription(
        `${author}
        ${albumName}`,
      )
      .setThumbnail(artworkUrl)
      .setImage("https://raw.githubusercontent.com/nullpat/randy-backend/refs/heads/main/line.png");

    channel.send({ embeds: [nowPlaying], components: [row] });
    client.user.setPresence({
      activities: [{ name: `${title} - ${author}`, type: 2 }],
    });
  } catch (error) {
    logger.error(error.stack);
  }
}

const getCommands = () => {
  const commands = client.commands;
  const prettyCommands = commands.map((command) => ({
    command: command.data.name,
    description: command.data.description,
  }));
  return prettyCommands;
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
  formatSource,
  nowPlaying,
  getCommands,
  checkLast,
  removeLast,
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
  formatSource,
  nowPlaying,
  getCommands,
  checkLast,
  removeLast,
};

export default services;
