import FastLink from "@performanc/fastlink";
import { Client, GatewayIntentBits, EmbedBuilder } from "discord.js";
import services from "./services/services.js";
import logger from "./utils/logger.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const prefix = process.env.PREFIX;
const botId = process.env.DISCORD_ID;

const events = FastLink.node.connectNodes(
  [
    {
      hostname: "127.0.0.1",
      secure: false,
      password: "youshallnotpass",
      port: 2333,
    },
  ],
  {
    botId,
    shards: 1,
    queue: true,
  }
);

// events.on("debug", console.log);

events.on("raw", async (data) => {
  console.log(data)
  if (data.type !== "TrackStartEvent") return;

  try {
    const voiceData = await services.getVoice(data.guildId);
    const channel = client.channels.cache.get(voiceData.channelId);

    if (!channel || !channel.isTextBased()) {
      console.error(
        `Channel Id must exist and allow text: ${voiceData.channelId}`
      );
      return;
    }
    const { title, author, uri, artworkUrl } = data.track.info;
    const albumName = data.track.pluginInfo.albumName || "";

    const nowPlaying = new EmbedBuilder()
      .setTitle("Now Playing")
      .setURL(uri)
      .setThumbnail(artworkUrl)
      .setDescription(
        `**${title}**
        ${author}
        ${albumName}`
      );

    channel.send({ embeds: [nowPlaying] });
  } catch (error) {
    logger.error(error.stack);
  }
});

client.on("raw", (data) => FastLink.other.handleRaw(data));

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const commandName = message.content
    .split(" ")[0]
    .toLowerCase()
    .substring(prefix.length);
  const args = message.content.split(" ").slice(1).join(" ");

  switch (commandName) {
    case "queue":
    case "q":
      try {
        const queue = await services.getQueue(message.guildId);
        message.channel.send(JSON.stringify(queue, null, 2));
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    case "move":
    case "join":
      if (!message.member.voice.channel) {
        message.channel.send("You are not in a voice channel.");
        break;
      }
      try {
        const join = await services.joinChannel(
          message.guildId,
          message.member.voice.channel.id
        );
        message.channel.send(join);
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    case "play":
    case "p":
    case ">":
      if (!message.member.voice.channel) {
        message.channel.send("You are not in a voice channel.");
        break;
      }
      try {
        const join = await services.joinChannel(
          message.guildId,
          message.member.voice.channel.id
        );
        const play = await services.addSong(message.guildId, args);
        message.channel.send(play);
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    case "youtube":
    case "yt":
      if (!message.member.voice.channel) {
        message.channel.send("You are not in a voice channel.");
        break;
      }
      try {
        const join = await services.joinChannel(
          message.guildId,
          message.member.voice.channel.id
        );
        const play = await services.addSong(message.guildId, args, true);
        message.channel.send(play);
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    case "pause":
      try {
        const pause = await services.pauseQueue(message.guildId);
        message.channel.send(pause);
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    case "resume":
      try {
        const resume = await services.resumeQueue(message.guildId);
        message.channel.send(resume);
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    case "clear":
      try {
        const clear = await services.clearQueue(message.guildId);
        message.channel.send(clear);
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    case "skip":
    case "next":
      try {
        const skip = await services.skipSong(message.guildId);
        if (skip) message.channel.send("Skipped song.");
        else
          message.channel.send("Failed to skip song. Likely 1 song in queue.");
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    case "volume":
      try {
        const volume = await services.changeVolume(message.guildId, args); // add validation for args
        message.channel.send(volume);
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    case "disconnect":
    case "destroy":
    case "leave":
    case "stop":
    case "exit":
    case "end":
      try {
        const destroy = await services.disconnectPlayer(message.guildId);
        message.channel.send(destroy);
      } catch (error) {
        logger.error(error.stack);
        message.channel.send(error.message);
      }
      break;

    default:
      message.channel.send("Unknown command.");
      break;
  }
});

export { client };
