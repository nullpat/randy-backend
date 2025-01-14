import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { leaveChannel } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Leaves the current voice channel and ends song playback");

async function execute(interaction, message, isMessage) {
  const guildId = isMessage ? message.guildId : interaction.guildId;

  try {
    const leave = await leaveChannel(guildId);
    sendReply(interaction, message, isMessage, leave);
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, isMessage, error.message);
  }
}

export { data, execute };
