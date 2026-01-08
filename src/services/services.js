import errsole from "errsole";
import client from "../musicbot.js";
import { logger } from "../utils/logger.js";
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";

const moveChannel = (guildId, voiceId) => {
  const player = client.aqua.get(guildId);
  player.setVoiceChannel(voiceId);
  return "Joined voice channel.";
};

const joinChannel = (guildId, voiceId, textId) => {
  const existing = client.aqua.players.get(guildId);
  if (existing) {
    return;
  }

  client.aqua.createConnection({
    guildId: guildId,
    voiceChannel: voiceId,
    textChannel: textId,
    deaf: true,
  });
  return "Joined your voice channel";
};

const leaveChannel = async (guildId) => {
  await client.aqua.destroyPlayer(guildId);
  client.user.setPresence({ activities: [{ name: "Listening to you sleep", type: 3 }] });
  return "Disconnected";
};

const changeVolume = async (guildId, volume) => {
  const volumeInt = parseInt(volume);
  const player = await client.aqua.get(guildId);
  player.setVolume(volumeInt);
  return `Volume set to ${volumeInt}`;
};

const getServers = async () => {
  const servers = client.guilds.cache;
  return servers;
};

const getServer = async (guildId) => {
  const servers = client.guilds.cache;
  const player = await client.aqua.get(guildId);

  queue = player.getQueue();

  const serverInfo = servers
    .filter((server) => server.id === guildId)
    .map((server) => ({
      id: server.id,
      name: server.name,
      queue: decodedQueue,
      icon: server.icon,
    }));

  const iconURL = serverInfo[0].icon
    ? `https://cdn.discordapp.com/icons/${serverInfo[0].id}/${serverInfo[0].icon}.png`
    : null;

  const shortName = serverInfo[0].name
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
    queue: queue,
    icon: iconURL,
    shortName: shortName,
  }));
  const singleServerInfo = finalServerInfo[0];
  return singleServerInfo;
};

const getVoice = async (guildId) => {
  const guild = client.guilds.cache.get(guildId);
  const member = guild.members.cache.get(process.env.DISCORD_CLIENT_ID);
  return member.voice;
};

const getQueue = async (guildId) => {
  const player = await client.aqua.get(guildId);
  const queue = await player.getQueue();
  return queue;
};

const autoLeave = async (guildId) => {
  const TIMEOUT = 300_000;
  await new Promise((resolve) => setTimeout(resolve, TIMEOUT));

  try {
    const player = await client.aqua.get(guildId);

    if (!player.current) {
      await leaveChannel(guildId);
    }
  } catch (err) {
    errsole.warn(err.stack);
  }
};

const pauseQueue = async (guildId) => {
  const player = await client.aqua.get(guildId);
  player.pause(true);
  return "Paused the queue";
};

const resumeQueue = async (guildId) => {
  const player = await client.aqua.get(guildId);
  player.pause(false);
  return "Resumed the queue";
};

const clearQueue = async (guildId) => {
  const player = await client.aqua.get(guildId);
  player.queue.clear();
  return "Cleared the queue";
};

const checkLast = async (guildId) => {
  const player = await client.aqua.get(guildId);
  const removedTrack = player.queue.slice(-1);
  if (removedTrack.length === 0) {
    return;
  }
  return `Are you sure you want to remove ${removedTrack[0].info.title} by ${removedTrack[0].info.author} from the queue?`;
};

const removeLast = async (guildId) => {
  const player = await client.aqua.get(guildId);
  const removedTrack = player.queue.slice(-1);
  if (player.queue.length === 1) {
    clearQueue(guildId);
  } else {
    player.queue = player.queue.slice(0, -1);
  }
  return `Removed ${removedTrack[0].info.title} by ${removedTrack[0].info.author} from the queue`;
};

const skipSong = async (guildId) => {
  const player = await client.aqua.get(guildId);
  const skip = player.skip();
  return skip;
};

const addSong = async (guildId, query, requester, youtubeFlag) => {
  const player = await client.aqua.get(guildId);

  const options = {
    query: query,
    requester: requester,
  };

  if (youtubeFlag) {
    options.source = "ytsearch";
  }

  const resolve = await client.aqua.resolve(options);
  const { loadType, tracks, playlistInfo, pluginInfo } = resolve;

  switch (loadType) {
    case "playlist": {
      for (const track of tracks) {
        player.queue.add(track);
      }
      if (!player.playing && !player.paused) {
        player.play();
      }
      return `Added ${tracks.length} songs from **${playlistInfo.name}** by ${pluginInfo.author}`;
    }

    case "search":
    case "track": {
      const [track] = tracks;
      player.queue.add(track);
      if (!player.playing && !player.paused) {
        player.play();
      }

      return `Added **${track.title}** by ${track.author}`;
    }

    default:
      throw new Error(`Failed to add to queue. LoadType: ${loadType}`);
  }
};

const getOverride = (guildId) => {
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

  const matchedOverride = overrideChannels.find((override) => override.guildId === guildId);
  return matchedOverride?.channelId;
};

const nowPlaying = async (guildId, track) => {
  try {
    const voiceData = await getVoice(guildId);
    const selectedChannelId = getOverride(guildId) ?? voiceData.channelId;
    const channel = client.channels.cache.get(selectedChannelId);
    const queueButton = new ButtonBuilder().setCustomId("queue").setLabel("Show Queue").setStyle(ButtonStyle.Primary);
    const hjelpButton = new ButtonBuilder().setCustomId("hjelp").setLabel("Hjelp").setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder().addComponents(queueButton, hjelpButton);

    if (!channel?.isTextBased()) {
      logger.error(`Channel Id must exist and allow text: ${voiceData.channelId}`);
      return;
    }

    const { title, author, uri, artworkUrl } = track;
    const albumName = track.pluginInfo.albumName ?? "";

    const nowPlayingEmbed = new EmbedBuilder()
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

    const response = await channel.send({ embeds: [nowPlayingEmbed], components: [row] });
    client.user.setPresence({
      activities: [{ name: `Listening to ${title} - ${author}`, type: 2 }],
    });
  } catch (error) {
    logger.error(error.stack);
  }
};

const getCommands = () => {
  const commands = client.commands;
  const prettyCommands = commands.map((command) => ({
    name: command.data.name,
    description: command.data.description,
  }));
  return prettyCommands;
};

const services = {
  moveChannel,
  joinChannel,
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
  getOverride,
  nowPlaying,
  getCommands,
  checkLast,
  removeLast,
};

export {
  moveChannel,
  joinChannel,
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
  getOverride,
  nowPlaying,
  getCommands,
  checkLast,
  removeLast,
};

export default services;
