import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { clearQueue } from "../services/services.js";

const data = new SlashCommandBuilder().setName("clear").setDescription("Clears the song queue");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const clear = await clearQueue(guildId);
    sendReply(interaction, message, clear);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, error.message);
  }
}

export { data, execute };
