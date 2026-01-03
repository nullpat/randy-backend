import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { getBirthdays } from "../services/services.js";

const data = new SlashCommandBuilder().setName("birthday").setDescription("Displays a list of birthdays");

const execute = async (interaction, message) => {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const birthdayList = getBirthdays(guildId);
    // todo: hide unnecessary server IDs from end users
    await sendMessage(interaction, message, birthdayList);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
