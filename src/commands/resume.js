import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { resumeQueue } from "../services/services.js";

const data = new SlashCommandBuilder().setName("resume").setDescription("Resumes playback");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const resume = await resumeQueue(guildId);
    sendMessage(interaction, message, resume);
  } catch (error) {
    logger.error(error.stack);
    sendMessage(interaction, message, error.message);
  }
}

export { data, execute };
