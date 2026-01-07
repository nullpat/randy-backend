import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { clearQueue, getQueue } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("clear")
  .setDescription("Removes all songs from the queue except the song currently playing");

const execute = async (interaction, message) => {
  const guildId = message?.guildId ?? interaction.guildId;

  try {
    const queue = await getQueue(guildId);

    if (queue.length === 0) {
      return await sendMessage(interaction, message, "Nothing to do, queue is already empty");
    }

    const clear = await clearQueue(guildId);
    await sendMessage(interaction, message, clear);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
