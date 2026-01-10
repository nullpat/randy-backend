import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { getQueue } from "../services/services.js";

const data = new SlashCommandBuilder().setName("queue").setDescription("Displays a list of songs in queue");

const execute = async (interaction, message) => {
  const guildId = message?.guildId ?? interaction.guildId;

  try {
    const queue = await getQueue(guildId);

    if (!queue || queue.length === 0) {
      return await sendMessage(interaction, message, "The queue is empty");
    }

    const queueText = queue
      .map((song, i) => {
        const position = i + 1;
        const title = song.info.title;
        const author = song.info.author;
        return `${position}. ${title}\n${author}`;
      })
      .join("\n\n");

    const queueEmbed = new EmbedBuilder().setDescription(queueText);

    await sendMessage(interaction, message, null, queueEmbed);
  } catch (error) {
    logger.error(error.stack);
    await sendMessage(interaction, message, error.message);
  }
};

export { data, execute };
