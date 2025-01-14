import { Client, Collection, EmbedBuilder, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import { lavaClient } from "./events/raw.js";
import { logger } from "./utils/logger.js";
import { getVoice } from "./services/services.js";

const eventFiles = readdirSync("./src/events");


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.commands = new Collection();

for (const eventFile of eventFiles) {
  import(`#events/${eventFile}`).then((event) => {
    if (event.runOnce) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
}

lavaClient.on("raw", async (data) => {
  console.log(data);
  if (data.type !== "TrackStartEvent") return;

  try {
    const voiceData = await getVoice(data.guildId);
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

export { client };
