import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { skipSong } from "../services/services.js";

const data = new SlashCommandBuilder().setName("skip").setDescription("Skips the current song");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const skip = await skipSong(guildId);
    if (skip) sendMessage(interaction, message, "Skipped song.");
    else sendMessage(interaction, message, "Failed to skip song. Likely 1 song in queue.");
  } catch (error) {
    logger.error(error.stack);
    sendMessage(interaction, message, error.message);
  }
}

export { data, execute };
