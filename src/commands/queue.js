import { SlashCommandBuilder } from "discord.js";
import { logger } from "../utils/logger.js";
import { sendReply } from "../helpers/helpers.js";
import { getQueue } from "../services/services.js";

const data = new SlashCommandBuilder()
  .setName("queue")
  .setDescription("Replies with the song queue");

async function execute(interaction, message, isMessage) {
  const guildId = isMessage ? message.guildId : interaction.guildId;

  try {
    const queue = await getQueue(guildId);
    const prettyQueue = queue.map((song) => ({
      title: song.info.title,
      author: song.info.author,
      album: song.pluginInfo?.albumName,
    }));
    sendReply(
      interaction,
      message,
      isMessage,
      `\`\`\`json\n${JSON.stringify(prettyQueue, null, 2)}\n\`\`\``
    );
  } catch (error) {
    logger.error(error.stack);
    sendReply(interaction, message, isMessage, error.message);
  }
}

export { data, execute };
