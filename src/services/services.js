import errsole from "errsole";
import client from "../musicbot.js";
import { logger } from "../utils/logger.js";
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { ApplicationError, ValidationError } from "../utils/errors.js";
import birthdayList from "../../dummybirthdays.js";
import cron from "node-cron";

const AUTO_LEAVE_TIMEOUT = 300_000;
const NOWPLAYING_OVERRIDE_CHANNELS = [
  {
    guildId: "889971568732684298",
    channelId: "1139615420400291851",
  },
  {
    guildId: "166740556947390465",
    channelId: "708165175341088828",
  },
  {
    guildId: "1207461053949284392",
    channelId: "1207461053949284395",
  },
];

const BIRTHDAY_OVERRIDE_CHANNELS = [
  {
    guildId: "889971568732684298",
    channelId: "1139615420400291851",
  },
  // {
  //   guildId: "166740556947390465",
  //   channelId: "708172723955695657",
  // },
  {
    guildId: "1207461053949284392",
    channelId: "1207461053949284395",
  },
];

const getPlayer = (guildId) => {
  const player = client.aqua.players.get(guildId);
  if (!player) {
    throw new ApplicationError("Player is not connected to a voice channel in this guild");
  }
  return player;
};

const checkBirthdays = () => {
  cron.schedule("0 22 * * *", () => {
    const today = new Date();

    const month = today.getMonth() + 1;
    const day = today.getDate() + 1;

    birthdayList.forEach((user) => {
      if (user.month == month && user.day == day) {
        sendBirthdays(user);
      }
    });
  });
};

const sendBirthdays = async (birthdayPerson) => {
  console.log(birthdayPerson);

  const channelId = getBirthdayOverride(birthdayPerson.serverId);
  const channel = await client.channels.fetch(channelId);
  const channelMembers = channel.members;
  for (const member of channelMembers.values()) {
    if (member.id !== birthdayPerson.userId && member.id !== client.application.id) {
      const recipient = await client.users.fetch(member.id);
      const birthdayMessage = `${birthdayPerson.name}'s birthday is coming up on ${birthdayPerson.month}/${birthdayPerson.day}! Make sure to send them a message`;
      await recipient.send(birthdayMessage);
    }
  }
};

const moveChannel = (guildId, voiceId) => {
  const player = getPlayer(guildId);
  player.setVoiceChannel(voiceId);
  return "Joined your voice channel";
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

const changeVolume = (guildId, volume) => {
  const volumeInt = Number(volume);
  if (!Number.isFinite(volumeInt)) {
    throw new ValidationError("Volume must be a valid number");
  }
  const player = getPlayer(guildId);
  player.setVolume(volumeInt);
  return `Volume set to ${volumeInt}%`;
};

const getServers = () => {
  const servers = client.guilds.cache;
  return servers;
};

const getServer = (guildId) => {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    throw new ApplicationError("Invalid guild ID provided");
  }

  const player = getPlayer(guildId);
  const queue = player.getQueue();

  const iconURL = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null;

  const shortName = guild.name
    .match(/\b\w|\W+/g)
    .map((namePart) => {
      if (/\w/.test(namePart)) {
        return namePart.charAt(0).toUpperCase();
      }
      if (namePart.trim() === "") {
        return "";
      }
      return namePart;
    })
    .join("")
    .replace("'S", "");

  return {
    name: guild.name,
    queue,
    icon: iconURL,
    shortName,
  };
};

const getVoice = (guildId) => {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    throw new ApplicationError("Invalid guild ID provided");
  }
  const member = guild.members.cache.get(process.env.DISCORD_CLIENT_ID);
  if (!member) {
    throw new ApplicationError("Failed to get cached bot status");
  }
  return member.voice;
};

const getQueue = (guildId) => {
  const player = getPlayer(guildId);
  const queue = player.getQueue();
  return queue;
};

const autoLeave = async (guildId) => {
  await new Promise((resolve) => setTimeout(resolve, AUTO_LEAVE_TIMEOUT));

  try {
    const player = client.aqua.players.get(guildId);

    if (!player || !player.current) {
      await leaveChannel(guildId);
    }
  } catch (err) {
    errsole.warn(err.stack);
  }
};

const pauseQueue = (guildId) => {
  const player = getPlayer(guildId);
  player.pause(true);
  return "Paused the queue";
};

const resumeQueue = (guildId) => {
  const player = getPlayer(guildId);
  player.pause(false);
  return "Resumed the queue";
};

const clearQueue = (guildId) => {
  const player = getPlayer(guildId);
  player.queue.clear();
  return "Cleared the queue";
};

const checkLast = (guildId) => {
  const player = getPlayer(guildId);
  const removedTrack = player.queue.slice(-1);
  if (removedTrack.length === 0) {
    return;
  }
  return `Are you sure you want to remove ${removedTrack[0].info.title} by ${removedTrack[0].info.author} from the queue?`;
};

const removeLast = (guildId) => {
  const player = getPlayer(guildId);
  const removedTrack = player.queue.slice(-1);
  if (removedTrack.length === 0) {
    throw new ApplicationError("Queue is empty, nothing to remove");
  }
  if (player.queue.length === 1) {
    clearQueue(guildId);
  } else {
    player.queue = player.queue.slice(0, -1);
  }
  return `Removed ${removedTrack[0].info.title} by ${removedTrack[0].info.author} from the queue`;
};

const skipSong = (guildId) => {
  const player = getPlayer(guildId);
  const skip = player.skip();
  return skip;
};

const addSong = async (guildId, query, requester, youtubeFlag) => {
  const player = getPlayer(guildId);

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

const getNowPlayingOverride = (guildId) => {
  const matchedOverride = NOWPLAYING_OVERRIDE_CHANNELS.find((override) => override.guildId === guildId);
  return matchedOverride?.channelId;
};

const getBirthdayOverride = (guildId) => {
  const matchedOverride = BIRTHDAY_OVERRIDE_CHANNELS.find((override) => override.guildId === guildId);
  return matchedOverride?.channelId;
};

const nowPlaying = async (guildId, track) => {
  try {
    let voiceData;
    try {
      voiceData = getVoice(guildId);
    } catch (error) {
      logger.error(`Failed to get voice data for guild ${guildId}: ${error.message}`);
      return;
    }
    const selectedChannelId = getNowPlayingOverride(guildId) ?? voiceData.channelId;
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
      .setImage(process.env.NOW_PLAYING_LINE_IMAGE);

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
  checkBirthdays,
  sendBirthdays,
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
  getNowPlayingOverride,
  nowPlaying,
  getCommands,
  checkLast,
  removeLast,
};

export {
  checkBirthdays,
  sendBirthdays,
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
  getNowPlayingOverride,
  nowPlaying,
  getCommands,
  checkLast,
  removeLast,
};

export default services;
