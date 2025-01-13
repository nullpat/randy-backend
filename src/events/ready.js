import { readdirSync } from "fs";

const name = "ready";
const once = true;

async function execute(client) {
  const commandFiles = readdirSync("./src/commands");

  for (const commandFile of commandFiles) {
    const command = await import(`#commands/${commandFile}`);

    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `The ${commandFile} command is missing a required "data" or "execute" property.`
      );
    }
  }
  console.log(`Successfully loaded ${client.commands.size} (/) commands.`);
}
export { name, once, execute };
