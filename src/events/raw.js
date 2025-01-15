import FastLink from "@performanc/fastlink";
import { EmbedBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { getVoice, getQueue, autoLeave } from "../services/services.js";
import { client } from "../musicbot.js";

const name = "raw";
const runOnce = false;

const lavaHostname = process.env.LAVA_HOSTNAME;
const lavaSecure = process.env.LAVA_SECURE === "true";
const lavaPassword = process.env.LAVA_PASSWORD;
const lavaPort = process.env.LAVA_PORT;
const botId = process.env.DISCORD_CLIENT_ID;

const lavaClient = FastLink.node.connectNodes(
  [
    {
      hostname: lavaHostname,
      secure: lavaSecure,
      password: lavaPassword,
      port: lavaPort,
    },
  ],
  {
    botId,
    shards: 1,
    queue: true,
  }
);

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

let isFirstStartEvent = true;

async function nowPlaying(data) {
  try {
    const voiceData = await getVoice(data.guildId);
    const queue = await getQueue(data.guildId);
    const matchedOverride = overrideChannels.find(
      (override) => override.guildId === data.guildId
    );
    const selectedChannelId = matchedOverride
      ? matchedOverride.channelId
      : voiceData.channelId;
    const channel = client.channels.cache.get(selectedChannelId);

    if (typeof queue !== "object") {
      client.user.setPresence({ activities: [{ name: "you sleep", type: 3 }] });
      autoLeave(data.guildId);
      return;
    }

    if (!channel || !channel.isTextBased()) {
      logger.error(
        `Channel Id must exist and allow text: ${voiceData.channelId}`
      );
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
        ${albumName}`
      )
      .setThumbnail(artworkUrl)
      .setImage(
        "https://raw.githubusercontent.com/nullpat/randy-backend/refs/heads/qolThings/invis.png"
      );

    channel.send({ embeds: [nowPlaying] });
    client.user.setPresence({
      activities: [{ name: `${title} - ${author}`, type: 2 }],
    });
  } catch (error) {
    logger.error(error.stack);
  }
}

lavaClient.on("raw", async (data) => {
  if (data.type === "TrackStartEvent") {
    if (isFirstStartEvent) {
      isFirstStartEvent = false;
      nowPlaying(data);
    }
  } else if (data.type === "TrackEndEvent") {
    nowPlaying(data);
  } else {
    return;
  }
});

async function execute(data) {
  FastLink.other.handleRaw(data);
}

export { name, runOnce, execute };
