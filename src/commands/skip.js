import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { skipSong } from "../services/services.js";

const data = new SlashCommandBuilder().setName("skip").setDescription("Skips the current song");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const skip = await skipSong(guildId);
    if (skip) sendReply(interaction, message, "Skipped song.");
    else sendReply(interaction, message, "Failed to skip song. Likely 1 song in queue.");
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, error.message);
  }
}

export { data, execute };
