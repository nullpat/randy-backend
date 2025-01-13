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
  const event = await import(`#events/${eventFile}`);

  if (event.runOnce) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

export { client };
