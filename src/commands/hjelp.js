import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { getCommands } from "../services/services.js";

const data = new SlashCommandBuilder().setName("hjelp").setDescription("Displays a list of commands");

const execute = async (interaction, message) => {
  try {
    const commandListArray = getCommands();

    const commandListString = commandListArray
      .map((command) => `${command.name.padEnd(10)} - ${command.description}`)
      .join("\n");

    const formattedHjelp = [
      "```",
      "Available Commands",
      "─".repeat(73),
      "Use commands like >clear or /clear or just the first letter like >c or /c",
      "",
      commandListString,
      "```",
    ].join("\n");

    await sendMessage(interaction, message, formattedHjelp);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
