import { Client, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import { Aqua } from "aqualink";
import { autoLeave, getNowPlayingOverride, nowPlaying } from "./services/services.js";

const lavaHostname = process.env.LAVA_HOSTNAME;
const lavaSecure = process.env.LAVA_SECURE === "true";
const lavaPassword = process.env.LAVA_PASSWORD;
const lavaPort = process.env.LAVA_PORT;
const botId = process.env.DISCORD_CLIENT_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
  ],
});

const nodes = [
  {
    host: lavaHostname,
    password: lavaPassword,
    port: lavaPort,
    ssl: lavaSecure,
    name: botId,
  },
];

const aqua = new Aqua(client, nodes, {
  defaultSearchPlatform: "dzsearch",
  restVersion: "v4",
  autoResume: true,
  infiniteReconnects: true,
  loadBalancer: "LeastLoad",
  leaveOnEnd: false,
});

client.aqua = aqua;

client.commands = new Collection();

const eventFiles = readdirSync("./src/events");

const loadEvents = async () => {
  for (const eventFile of eventFiles) {
    const event = await import(`#events/${eventFile}`);

    if (event.runOnce) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
};

loadEvents();

client.aqua.on("nodeConnect", (node) => {
  console.log(`Node connected: ${node.name}`);
});

client.aqua.on("nodeError", (node, error) => {
  console.log(`Node "${node.name}" encountered an error: ${error.message}`);
});

client.aqua.on("trackStart", async (player, track) => {
  await nowPlaying(player.guildId, track);
});

client.aqua.on("queueEnd", async (player) => {
  const override = getNowPlayingOverride(player.guildId) ?? player.textChannel;
  const channel = client.channels.cache.get(override);

  if (channel) channel.send("The queue has ended. Randy's warmth will leave you in 5 minutes unless songs are added to the queue");
  await autoLeave(player.guildId);
});

export default client;
