import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { clearQueue } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Removes all songs from the queue including whats currently playing");

const execute = async (interaction, message) => {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const clear = await clearQueue(guildId);
    await sendMessage(interaction, message, clear);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
