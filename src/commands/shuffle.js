import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { shuffleQueue } from "../services/services.js";

const data = new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles Queue");

const execute = async (interaction, message) => {
  const guildId = message?.guildId ?? interaction.guildId;

  try {
    const shuffle = shuffleQueue(guildId);
    await sendMessage(interaction, message, shuffle);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
