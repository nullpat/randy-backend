import { MessageFlags } from "discord.js";
import { logger } from "../utils/logger.js";

const name = "interactionCreate";
const runOnce = false;

const execute = async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      await handleChatInputCommand(interaction);
    } else if (interaction.isButton()) {
      await handleButtonInteraction(interaction);
    }
  } catch (error) {
    logger.error(error.stack);
  }
};

const handleChatInputCommand = async (interaction) => {
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
        content: error.message,
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: error.message,
        flags: MessageFlags.Ephemeral,
      });
    }
  }
};

const handleButtonInteraction = async (interaction) => {
  const command = interaction.client.commands.get(interaction.customId);

  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(error.stack);
    }
  }
};

export { name, runOnce, execute };
