import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { pauseQueue } from "../services/services.js";

const data = new SlashCommandBuilder().setName("pause").setDescription("Pauses playback");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const pause = await pauseQueue(guildId);
    sendMessage(interaction, message, pause);
  } catch (error) {
    logger.error(error.stack);
    sendMessage(interaction, message, error.message);
  }
}

export { data, execute };
