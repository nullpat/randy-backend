import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { pauseQueue } from "../services/services.js";

const data = new SlashCommandBuilder().setName("pause").setDescription("Pauses playback");

const execute = async (interaction, message) => {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const pause = await pauseQueue(guildId);
    await sendMessage(interaction, message, pause);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
