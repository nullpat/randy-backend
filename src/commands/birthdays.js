import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
// helpers import
// services import

const data = new SlashCommandBuilder()
  .setName("birthdays")
  .setDescription("See all set user birthdays.");

const execute = async (interaction, message) => {
  const guildId = message ? message.guildId : interaction.guildId;
// retool logic below after helpers and services
  try {
    const clear = await clearQueue(guildId);
    await sendMessage(interaction, message, clear);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

// export { data, execute };