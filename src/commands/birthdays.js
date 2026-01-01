import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { birthdays } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("birthdays")
  .setDescription("See all set user birthdays.");

const execute = async (interaction, message) => {
  const guildId = message ? message.guildId : interaction.guildId;
  try {
    const birthdayList = birthdays(); 
    await sendMessage(interaction, message, birthdayList);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };