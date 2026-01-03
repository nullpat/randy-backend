import { Client, Collection, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import { Aqua } from "aqualink";

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
      name: botId
  }
];

const aqua = new Aqua(client, nodes, {
  defaultSearchPlatform: "dzsearch",
  restVersion: "v4",
  autoResume: true,
  infiniteReconnects: true,
  loadBalancer: 'LeastLoad',
  leaveOnEnd: false
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

export default client;
