import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { pauseQueue } from "../services/services.js";

const data = new SlashCommandBuilder().setName("pause").setDescription("Pauses playback");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const pause = await pauseQueue(guildId);
    sendReply(interaction, message, pause);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, error.message);
  }
}

export { data, execute };
