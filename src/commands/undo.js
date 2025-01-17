import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { removeLast } from "../services/services.js";

const data = new SlashCommandBuilder().setName("undo").setDescription("Removes last song from the queue");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const undo = await removeLast(guildId);
    sendReply(interaction, message, undo);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, error.message);
  }
}

export { data, execute };
