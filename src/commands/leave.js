import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { leaveChannel } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("leave")
  .setDescription("Leaves the current voice channel and ends playback");

const execute = async (interaction, message) => {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const leave = await leaveChannel(guildId);
    await sendMessage(interaction, message, leave);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
