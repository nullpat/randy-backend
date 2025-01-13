import { readdirSync } from "fs";

const name = "ready";
const runOnce = true;

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
      console.log(`Successfully loaded ${command.data.name} (/) command.`);
    })
  }
}

export { name, runOnce, execute };
