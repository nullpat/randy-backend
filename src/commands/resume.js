import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { resumeQueue } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resumes song playback");

async function execute(interaction, message, isMessage) {
  const guildId = isMessage ? message.guildId : interaction.guildId;

  try {
    const resume = await resumeQueue(guildId);
    sendReply(interaction, message, isMessage, resume);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, isMessage, error.message);
  }
}

export { data, execute };
