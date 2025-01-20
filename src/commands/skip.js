import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { skipSong } from "../services/services.js";

const data = new SlashCommandBuilder().setName("skip").setDescription("Skips the current song");

const execute = async (interaction, message) => {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const skip = await skipSong(guildId);
    if (skip) await sendMessage(interaction, message, "Skipped song.");
    else await sendMessage(interaction, message, "Failed to skip song. Likely 1 song in queue.");
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
