import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendMessage } from "../helpers/helpers.js";
import { getQueue } from "../services/services.js";

const data = new SlashCommandBuilder().setName("queue").setDescription("Displays songs in queue");

async function execute(interaction, message) {
  const guildId = message ? message.guildId : interaction.guildId;

  try {
    const queue = await getQueue(guildId);
    const prettyQueue = queue.map((song) => ({
      title: song.info.title,
      author: song.info.author,
      album: song.pluginInfo?.albumName,
    }));
    const prettierQueue = JSON.stringify(prettyQueue, null, 2);
    const formattedQueue = `\`\`\`json\n${prettierQueue}\n\`\`\``;
    sendMessage(interaction, message, formattedQueue);
  } catch (error) {
    logger.error(error.stack);
    sendMessage(interaction, message, error.message);
  }
}

export { data, execute };
