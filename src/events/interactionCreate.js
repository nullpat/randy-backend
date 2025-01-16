import { MessageFlags } from "discord.js";
import { logger } from "../utils/logger.js";

const name = "interactionCreate";
const runOnce = false;

async function execute(interaction) {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      logger.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(error.stack);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command!",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  } else if (interaction.isButton()) {
    try {
      const command = interaction.client.commands.get("queue");
      await command.execute(interaction);
    } catch (error) {
      logger.error(error.stack);
    }
  } else {
    return;
  }
}

export { name, runOnce, execute };
