import { Client, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";

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
  import(`#events/${eventFile}`)
    .then((event) => {
      if (event.runOnce) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));

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
    case "next":
    case "leave":
    case "exit":
    case "end":
      }
    })
}

export { client };
