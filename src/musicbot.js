import { Client, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import { Aqua } from "aqualink";
import { nowPlaying } from "./services/services.js";

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

for (const eventFile of eventFiles) {
  import(`#events/${eventFile}`).then((event) => {
    if (event.runOnce) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
}

client.aqua.on("nodeConnect", (node) => {
  console.log(`Node connected: ${node.name}`);
});

client.aqua.on("nodeError", (node, error) => {
  console.log(`Node "${node.name}" encountered an error: ${error.message}.`);
});

client.aqua.on('trackStart', async (player, track) => {
  await nowPlaying(player.guildId, true);
});

client.aqua.on("queueEnd", (player) => {
  const channel = client.channels.cache.get(player.textChannel);
  if (channel) channel.send("The queue has ended.");
  player.destroy();
});

export default client;
