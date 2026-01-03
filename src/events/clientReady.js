import { readdirSync } from "fs";
import { REST, Routes } from "discord.js";
import { logger } from "../utils/logger.js";

const name = "clientReady";
const runOnce = true;
const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.DISCORD_TOKEN;
const rest = new REST().setToken(token);

const execute = async (client) => {
  const commandFiles = readdirSync("./src/commands");

  for (const commandFile of commandFiles) {
    import(`#commands/${commandFile}`).then((command) => {
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      } else {
        logger.error(`The ${commandFile} command is missing a required "data" or "execute" property.`);
      }
    });
  }

  const deployCommands = async () => {
    const commandData = client.commands.map((command) => command.data);
    try {
      const data = await rest.put(Routes.applicationCommands(clientId), {
        body: commandData,
      });
      console.log(`Successfully deployed ${data.length} application (/) commands.`);
    } catch (error) {
      logger.error(error.stack);
    }
  };

  setTimeout(deployCommands, 1000);
  client.user.setPresence({ activities: [{ name: "Watching you sleep", type: 3 }] });

  client.aqua.init(client.user.id);
  console.log(`Logged in as ${client.user.tag}`);
};

export { name, runOnce, execute };
