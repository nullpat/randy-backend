import { readdirSync } from "fs";
import { REST, Routes } from "discord.js";

const name = "ready";
const runOnce = true;
const clientId = process.env.DISCORD_CLIENT_ID;
const token = process.env.DISCORD_TOKEN;
const rest = new REST().setToken(token);

async function execute(client) {
  const commandFiles = readdirSync("./src/commands");

  for (const commandFile of commandFiles) {
    import(`#commands/${commandFile}`).then((command) => {
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `The ${commandFile} command is missing a required "data" or "execute" property.`
        );
      }
    });
  }

  async function deployCommands() {
    const commandData = client.commands.map((command) => command.data);
    try {
      const data = await rest.put(Routes.applicationCommands(clientId), {
        body: commandData,
      });
      console.log(
        `Successfully deployed ${data.length} application (/) commands.`
      );
    } catch (error) {
      console.error(error);
    }
  }

  setTimeout(deployCommands, 1000);
}

export { name, runOnce, execute };
