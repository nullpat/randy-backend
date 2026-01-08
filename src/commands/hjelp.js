import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
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
      "Available Commands",
      "─".repeat(73),
      "Use commands like >clear or /clear or just the first letter like >c or /c",
      "",
      commandListString
    ].join("\n");

    const embed = new EmbedBuilder()
      .setDescription(formattedHjelp)
      .setImage("https://raw.githubusercontent.com/nullpat/randy-backend/refs/heads/tes-128-aqualink/line2.png");
    await sendMessage(interaction, message, null, embed);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
